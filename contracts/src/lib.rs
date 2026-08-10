#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, String
};

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
    pub amount: i128,
    pub interval: u64, // Interval in seconds
    pub last_payment: u64, // Timestamp of last payment
    pub merchant: Address,
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

    /// User subscribes to a merchant plan
    pub fn subscribe(env: Env, subscriber: Address, merchant: Address, amount: i128, interval: u64) {
        subscriber.require_auth();

        let key = DataKey::Subscription(subscriber.clone());
        
        let sub_data = SubscriptionData {
            amount,
            interval,
            last_payment: env.ledger().timestamp(), // Start counting from now
            merchant,
            active: true,
        };

        env.storage().persistent().set(&key, &sub_data);
    }

    /// Called by a relayer/cron to process payments that are due
    pub fn process_payment(env: Env, subscriber: Address) {
        let key = DataKey::Subscription(subscriber.clone());
        let mut sub_data: SubscriptionData = env.storage().persistent().get(&key).unwrap();

        if !sub_data.active {
            panic!("Subscription is not active");
        }

        let current_time = env.ledger().timestamp();
        if current_time < sub_data.last_payment + sub_data.interval {
            panic!("Payment not due yet");
        }

        // Pull funds from subscriber to merchant
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);

        // This requires the subscriber to have previously approved the contract
        // to transfer the token amount on their behalf via `token.approve()`
        token_client.transfer_from(
            &env.current_contract_address(),
            &subscriber,
            &sub_data.merchant,
            &sub_data.amount,
        );

        // Update last payment time
        sub_data.last_payment = current_time;
        env.storage().persistent().set(&key, &sub_data);
    }

    /// Cancel a subscription
    pub fn cancel(env: Env, subscriber: Address) {
        subscriber.require_auth();

        let key = DataKey::Subscription(subscriber.clone());
        let mut sub_data: SubscriptionData = env.storage().persistent().get(&key).unwrap();
        
        sub_data.active = false;
        env.storage().persistent().set(&key, &sub_data);
    }
}
