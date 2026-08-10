#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env
};

const DAY_IN_LEDGERS: u32 = 17280; // ~5s per ledger
const BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS; // Extend for 30 days
const LIFETIME_THRESHOLD: u32 = 7 * DAY_IN_LEDGERS;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Token,
    Subscription(Address), // Maps subscriber Address to Subscription Details
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SubscriptionData {
    pub subscriber: Address,
    pub merchant: Address,
    pub amount: i128,
    pub interval: u64, // Interval in seconds
    pub last_payment: u64, // Timestamp of last payment
    pub active: bool,
}

#[contract]
pub struct SubStellarContract;

#[contractimpl]
impl SubStellarContract {
    /// Initialize the contract with an admin and the accepted token (e.g., USDC)
    pub fn initialize(env: Env, admin: Address, token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
    }

    /// User creates a new subscription plan
    pub fn create_subscription(
        env: Env, 
        subscriber: Address, 
        merchant: Address, 
        amount: i128, 
        interval: u64
    ) {
        subscriber.require_auth();

        let key = DataKey::Subscription(subscriber.clone());
        
        let sub_data = SubscriptionData {
            subscriber: subscriber.clone(),
            merchant,
            amount,
            interval,
            last_payment: env.ledger().timestamp(),
            active: true,
        };

        env.storage().persistent().set(&key, &sub_data);
        env.storage().persistent().extend_ttl(&key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
    }

    /// Called by a relayer/cron to execute recurring billing pull
    pub fn execute_billing(env: Env, subscriber: Address) {
        let key = DataKey::Subscription(subscriber.clone());
        
        if !env.storage().persistent().has(&key) {
            panic!("Subscription not found");
        }

        let mut sub_data: SubscriptionData = env.storage().persistent().get(&key).unwrap();

        if !sub_data.active {
            panic!("Subscription is inactive");
        }

        let current_time = env.ledger().timestamp();
        if current_time < sub_data.last_payment + sub_data.interval {
            panic!("Billing cycle not due yet");
        }

        // Pull funds from subscriber to merchant
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);

        token_client.transfer_from(
            &env.current_contract_address(),
            &subscriber,
            &sub_data.merchant,
            &sub_data.amount,
        );

        // Update last payment timestamp and extend TTL rent
        sub_data.last_payment = current_time;
        env.storage().persistent().set(&key, &sub_data);
        env.storage().persistent().extend_ttl(&key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
    }

    /// Cancel an active subscription
    pub fn cancel_subscription(env: Env, subscriber: Address) {
        subscriber.require_auth();

        let key = DataKey::Subscription(subscriber.clone());
        if !env.storage().persistent().has(&key) {
            panic!("Subscription not found");
        }

        let mut sub_data: SubscriptionData = env.storage().persistent().get(&key).unwrap();
        sub_data.active = false;
        
        env.storage().persistent().set(&key, &sub_data);
    }

    /// Query subscription details for a subscriber address
    pub fn get_subscription(env: Env, subscriber: Address) -> Option<SubscriptionData> {
        let key = DataKey::Subscription(subscriber);
        if env.storage().persistent().has(&key) {
            env.storage().persistent().extend_ttl(&key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
            env.storage().persistent().get(&key)
        } else {
            None
        }
    }
}
