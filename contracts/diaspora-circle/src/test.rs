extern crate std;

use soroban_sdk::{Env, Symbol};

use crate::DiasporaCircleContract;

#[test]
fn hello_returns_hello() {
    let env = Env::default();

    let result = DiasporaCircleContract::hello(env.clone());

    assert_eq!(result, Symbol::new(&env, "hello"));
}