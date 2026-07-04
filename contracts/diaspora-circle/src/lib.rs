#![no_std]

use soroban_sdk::{contract, contractimpl, Env, Symbol};

#[contract]
pub struct DiasporaCircleContract;

#[contractimpl]
impl DiasporaCircleContract {
    /// Returns a greeting symbol.
    pub fn hello(_env: Env) -> Symbol {
        Symbol::new(&_env, "hello")
    }
}

#[cfg(test)]
mod test;