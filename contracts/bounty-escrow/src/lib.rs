#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, Vec};

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Bounty {
    pub id: u32,
    pub creator: Address,
    pub token: Address,
    pub reward_amount: i128,
    pub deadline: u64,
    pub status: u32, // 0 = Created, 1 = Locked/Funded, 2 = Completed/Released, 3 = Cancelled
    pub winner: Option<Address>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Submission {
    pub contributor: Address,
    pub proof_url: Symbol,
    pub timestamp: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Bounty(u32),
    BountyCount,
    Submissions(u32), // bounty_id -> Vec<Submission>
}

#[contract]
pub struct BountyEscrow;

#[contractimpl]
impl BountyEscrow {
    // Initialize or get the current bounty count
    pub fn get_bounty_count(env: &Env) -> u32 {
        env.storage().instance().get(&DataKey::BountyCount).unwrap_or(0)
    }

    // Create a new bounty
    pub fn create_bounty(env: Env, creator: Address, token: Address, reward_amount: i128, deadline: u64) -> u32 {
        creator.require_auth();
        
        let count = Self::get_bounty_count(&env);
        let bounty_id = count + 1;

        let bounty = Bounty {
            id: bounty_id,
            creator: creator.clone(),
            token,
            reward_amount,
            deadline,
            status: 0, // Created
            winner: Option::None,
        };

        env.storage().instance().set(&DataKey::Bounty(bounty_id), &bounty);
        env.storage().instance().set(&DataKey::BountyCount, &bounty_id);

        // Emit event
        env.events().publish(
            (symbol_short!("created"), bounty_id),
            (creator, reward_amount),
        );

        bounty_id
    }

    // Lock reward funds from creator to the escrow contract
    pub fn lock_reward(env: Env, bounty_id: u32) {
        let mut bounty = Self::get_bounty(&env, bounty_id);
        assert_eq!(bounty.status, 0, "Bounty is not in Created status");
        
        bounty.creator.require_auth();

        // Perform token transfer
        let token_client = soroban_sdk::token::Client::new(&env, &bounty.token);
        token_client.transfer(
            &bounty.creator,
            &env.current_contract_address(),
            &bounty.reward_amount,
        );

        bounty.status = 1; // Locked/Funded
        env.storage().instance().set(&DataKey::Bounty(bounty_id), &bounty);

        // Emit event
        env.events().publish(
            (symbol_short!("locked"), bounty_id),
            bounty.reward_amount,
        );
    }

    // Submit work for a bounty
    pub fn submit_work(env: Env, bounty_id: u32, contributor: Address, proof_url: Symbol) {
        contributor.require_auth();
        let bounty = Self::get_bounty(&env, bounty_id);
        assert_eq!(bounty.status, 1, "Bounty must be funded to submit work");
        assert!(env.ledger().timestamp() < bounty.deadline, "Bounty deadline has passed");

        let submission = Submission {
            contributor: contributor.clone(),
            proof_url,
            timestamp: env.ledger().timestamp(),
        };

        let mut submissions: Vec<Submission> = env
            .storage()
            .instance()
            .get(&DataKey::Submissions(bounty_id))
            .unwrap_or(Vec::new(&env));

        submissions.push_back(submission);
        env.storage().instance().set(&DataKey::Submissions(bounty_id), &submissions);

        // Emit event
        env.events().publish(
            (symbol_short!("submitted"), bounty_id),
            contributor,
        );
    }

    // Select winner for the bounty
    pub fn select_winner(env: Env, bounty_id: u32, winner: Address) {
        let mut bounty = Self::get_bounty(&env, bounty_id);
        bounty.creator.require_auth();
        assert_eq!(bounty.status, 1, "Bounty must be Funded/Locked to select winner");

        bounty.winner = Option::Some(winner.clone());
        bounty.status = 2; // Completed/Released
        env.storage().instance().set(&DataKey::Bounty(bounty_id), &bounty);

        // Release reward
        let token_client = soroban_sdk::token::Client::new(&env, &bounty.token);
        token_client.transfer(
            &env.current_contract_address(),
            &winner,
            &bounty.reward_amount,
        );

        // Emit event
        env.events().publish(
            (symbol_short!("won"), bounty_id),
            (winner, bounty.reward_amount),
        );
    }

    // Cancel bounty and refund creator
    pub fn cancel_bounty(env: Env, bounty_id: u32) {
        let mut bounty = Self::get_bounty(&env, bounty_id);
        bounty.creator.require_auth();
        assert!(bounty.status == 0 || bounty.status == 1, "Bounty cannot be cancelled");

        if bounty.status == 1 {
            // Refund funds locked in escrow
            let token_client = soroban_sdk::token::Client::new(&env, &bounty.token);
            token_client.transfer(
                &env.current_contract_address(),
                &bounty.creator,
                &bounty.reward_amount,
            );
        }

        bounty.status = 3; // Cancelled
        env.storage().instance().set(&DataKey::Bounty(bounty_id), &bounty);

        // Emit event
        env.events().publish(
            (symbol_short!("cancelled"), bounty_id),
            bounty.creator.clone(),
        );
    }

    // Retrieve bounty details
    pub fn get_bounty(env: &Env, bounty_id: u32) -> Bounty {
        env.storage()
            .instance()
            .get(&DataKey::Bounty(bounty_id))
            .expect("Bounty does not exist")
    }

    // Retrieve submissions for a bounty
    pub fn get_submissions(env: &Env, bounty_id: u32) -> Vec<Submission> {
        env.storage()
            .instance()
            .get(&DataKey::Submissions(bounty_id))
            .unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env, Symbol};
    use soroban_sdk::token::Client as TokenClient;
    use soroban_sdk::token::StellarAssetClient as TokenAdminClient;

    #[test]
    fn test_bounty_lifecycle() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, BountyEscrow);
        let client = BountyEscrowClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        let contributor = Address::generate(&env);
        
        // Setup token
        let token_admin = Address::generate(&env);
        let token_address = env.register_stellar_asset_contract(token_admin.clone());
        let token = TokenClient::new(&env, &token_address);
        let token_admin_client = TokenAdminClient::new(&env, &token_address);

        // Mint tokens to creator
        token_admin_client.mint(&creator, &1000);
        assert_eq!(token.balance(&creator), 1000);

        // 1. Create bounty
        let reward_amount = 500;
        let deadline = env.ledger().timestamp() + 3600;
        let bounty_id = client.create_bounty(&creator, &token_address, &reward_amount, &deadline);
        assert_eq!(bounty_id, 1);

        let bounty = client.get_bounty(&bounty_id);
        assert_eq!(bounty.id, 1);
        assert_eq!(bounty.creator, creator);
        assert_eq!(bounty.reward_amount, reward_amount);
        assert_eq!(bounty.status, 0); // Created

        // 2. Lock reward
        client.lock_reward(&bounty_id);
        
        // Assert token transfers
        assert_eq!(token.balance(&creator), 500);
        assert_eq!(token.balance(&contract_id), 500);
        
        let bounty = client.get_bounty(&bounty_id);
        assert_eq!(bounty.status, 1); // Funded/Locked

        // 3. Submit work
        let proof_url = Symbol::new(&env, "github_com_proof");
        client.submit_work(&bounty_id, &contributor, &proof_url);
        
        let subs = client.get_submissions(&bounty_id);
        assert_eq!(subs.len(), 1);
        let sub = subs.get(0).unwrap();
        assert_eq!(sub.contributor, contributor);
        assert_eq!(sub.proof_url, proof_url);

        // 4. Select winner
        client.select_winner(&bounty_id, &contributor);
        
        // Assert token release to winner
        assert_eq!(token.balance(&contributor), 500);
        assert_eq!(token.balance(&contract_id), 0);
        
        let bounty = client.get_bounty(&bounty_id);
        assert_eq!(bounty.status, 2); // Completed
        assert_eq!(bounty.winner, Some(contributor));
    }

    #[test]
    fn test_cancel_bounty() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, BountyEscrow);
        let client = BountyEscrowClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        
        // Setup token
        let token_admin = Address::generate(&env);
        let token_address = env.register_stellar_asset_contract(token_admin.clone());
        let token = TokenClient::new(&env, &token_address);
        let token_admin_client = TokenAdminClient::new(&env, &token_address);

        token_admin_client.mint(&creator, &1000);

        let reward_amount = 500;
        let deadline = env.ledger().timestamp() + 3600;
        let bounty_id = client.create_bounty(&creator, &token_address, &reward_amount, &deadline);

        // Lock reward
        client.lock_reward(&bounty_id);
        assert_eq!(token.balance(&creator), 500);
        assert_eq!(token.balance(&contract_id), 500);

        // Cancel bounty
        client.cancel_bounty(&bounty_id);
        
        // Refunded
        assert_eq!(token.balance(&creator), 1000);
        assert_eq!(token.balance(&contract_id), 0);
        
        let bounty = client.get_bounty(&bounty_id);
        assert_eq!(bounty.status, 3); // Cancelled
    }
}
