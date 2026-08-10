#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_create_and_query_subscription() {
    let env = Env::default();
    let contract_id = env.register_contract(None, SubStellarContract);
    let client = SubStellarContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let token = Address::generate(&env);
    let subscriber = Address::generate(&env);
    let merchant = Address::generate(&env);

    client.initialize(&admin, &token);

    env.mock_all_auths();

    client.create_subscription(&subscriber, &merchant, &50000000, &2592000);

    let sub = client.get_subscription(&subscriber).unwrap();
    assert_eq!(sub.subscriber, subscriber);
    assert_eq!(sub.merchant, merchant);
    assert_eq!(sub.amount, 50000000);
    assert_eq!(sub.interval, 2592000);
    assert_eq!(sub.active, true);
}

#[test]
fn test_cancel_subscription() {
    let env = Env::default();
    let contract_id = env.register_contract(None, SubStellarContract);
    let client = SubStellarContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let token = Address::generate(&env);
    let subscriber = Address::generate(&env);
    let merchant = Address::generate(&env);

    client.initialize(&admin, &token);
    env.mock_all_auths();

    client.create_subscription(&subscriber, &merchant, &100000000, &2592000);
    client.cancel_subscription(&subscriber);

    let sub = client.get_subscription(&subscriber).unwrap();
    assert_eq!(sub.active, false);
}
