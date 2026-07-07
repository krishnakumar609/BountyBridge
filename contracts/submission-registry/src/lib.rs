#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, Vec};

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct RegistrySubmission {
    pub bounty_id: u32,
    pub contributor: Address,
    pub proof_url: Symbol,
    pub timestamp: u64,
    pub status: u32, // 0 = Pending, 1 = Accepted, 2 = Rejected, 3 = Winner
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    BountySubmissions(u32), // bounty_id -> Vec<RegistrySubmission>
    UserSubmissions(Address), // user -> Vec<RegistrySubmission>
}

#[contract]
pub struct SubmissionRegistry;

#[contractimpl]
impl SubmissionRegistry {
    // Add a submission
    pub fn add_submission(env: Env, bounty_id: u32, contributor: Address, proof_url: Symbol) {
        contributor.require_auth();

        let new_sub = RegistrySubmission {
            bounty_id,
            contributor: contributor.clone(),
            proof_url,
            timestamp: env.ledger().timestamp(),
            status: 0, // Pending
        };

        // Save under bounty_id
        let mut bounty_subs: Vec<RegistrySubmission> = env
            .storage()
            .instance()
            .get(&DataKey::BountySubmissions(bounty_id))
            .unwrap_or(Vec::new(&env));
        bounty_subs.push_back(new_sub.clone());
        env.storage().instance().set(&DataKey::BountySubmissions(bounty_id), &bounty_subs);

        // Save under contributor
        let mut user_subs: Vec<RegistrySubmission> = env
            .storage()
            .instance()
            .get(&DataKey::UserSubmissions(contributor.clone()))
            .unwrap_or(Vec::new(&env));
        user_subs.push_back(new_sub);
        env.storage().instance().set(&DataKey::UserSubmissions(contributor.clone()), &user_subs);

        // Emit event
        env.events().publish(
            (symbol_short!("reg_sub"), bounty_id),
            contributor,
        );
    }

    // Get submissions by bounty
    pub fn get_submissions_by_bounty(env: Env, bounty_id: u32) -> Vec<RegistrySubmission> {
        env.storage()
            .instance()
            .get(&DataKey::BountySubmissions(bounty_id))
            .unwrap_or(Vec::new(&env))
    }

    // Get submissions by user
    pub fn get_submissions_by_user(env: Env, contributor: Address) -> Vec<RegistrySubmission> {
        env.storage()
            .instance()
            .get(&DataKey::UserSubmissions(contributor))
            .unwrap_or(Vec::new(&env))
    }

    // Update submission status (e.g. Creator accepts/rejects work)
    pub fn update_submission_status(
        env: Env,
        bounty_id: u32,
        contributor: Address,
        proof_url: Symbol,
        new_status: u32,
        updater: Address,
    ) {
        updater.require_auth(); // Typically verified out-of-band or via the escrow contract

        // Update bounty sub list
        let mut bounty_subs: Vec<RegistrySubmission> = env
            .storage()
            .instance()
            .get(&DataKey::BountySubmissions(bounty_id))
            .unwrap_or(Vec::new(&env));

        for i in 0..bounty_subs.len() {
            if let Some(mut sub) = bounty_subs.get(i) {
                if sub.contributor == contributor && sub.proof_url == proof_url {
                    sub.status = new_status;
                    bounty_subs.set(i, sub);
                    break;
                }
            }
        }
        env.storage().instance().set(&DataKey::BountySubmissions(bounty_id), &bounty_subs);

        // Update user sub list
        let mut user_subs: Vec<RegistrySubmission> = env
            .storage()
            .instance()
            .get(&DataKey::UserSubmissions(contributor.clone()))
            .unwrap_or(Vec::new(&env));

        for i in 0..user_subs.len() {
            if let Some(mut sub) = user_subs.get(i) {
                if sub.bounty_id == bounty_id && sub.proof_url == proof_url {
                    sub.status = new_status;
                    user_subs.set(i, sub);
                    break;
                }
            }
        }
        env.storage().instance().set(&DataKey::UserSubmissions(contributor), &user_subs);

        // Emit event
        env.events().publish(
            (symbol_short!("status_up"), bounty_id),
            new_status,
        );
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env, Symbol};

    #[test]
    fn test_submissions_registry_lifecycle() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, SubmissionRegistry);
        let client = SubmissionRegistryClient::new(&env, &contract_id);

        let contributor = Address::generate(&env);
        let creator = Address::generate(&env);
        let bounty_id = 1;
        let proof_url = Symbol::new(&env, "ipfs_hash");

        // 1. Add submission
        client.add_submission(&bounty_id, &contributor, &proof_url);

        // 2. Query by bounty
        let bounty_subs = client.get_submissions_by_bounty(&bounty_id);
        assert_eq!(bounty_subs.len(), 1);
        let sub1 = bounty_subs.get(0).unwrap();
        assert_eq!(sub1.bounty_id, bounty_id);
        assert_eq!(sub1.contributor, contributor);
        assert_eq!(sub1.proof_url, proof_url);
        assert_eq!(sub1.status, 0); // Pending

        // 3. Query by user
        let user_subs = client.get_submissions_by_user(&contributor);
        assert_eq!(user_subs.len(), 1);
        let sub2 = user_subs.get(0).unwrap();
        assert_eq!(sub2.bounty_id, bounty_id);
        assert_eq!(sub2.status, 0); // Pending

        // 4. Update status (e.g. mark as Accepted = 1)
        client.update_submission_status(&bounty_id, &contributor, &proof_url, &1, &creator);

        // Verify updated status
        let updated_subs = client.get_submissions_by_bounty(&bounty_id);
        assert_eq!(updated_subs.get(0).unwrap().status, 1);
    }
}
