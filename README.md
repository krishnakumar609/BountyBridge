# BountyBridge

### *Create, Fund, and Complete Bounties on Stellar*

BountyBridge is a fully decentralized, trustless Web3 bounty marketplace. It is built natively on the **Stellar** blockchain using **Soroban smart contracts** and a reactive, client-side React-TypeScript state management layer. The platform allows creators to publish funded development tasks, lock reward escrows, manage submissions from global builders, and disburse rewards transparently when a winner is selected.

---

## 🚀 Deployed Contracts & Live Access

- **BountyEscrow Contract**: [`CAXMWH5RIF3ZTH6IGKZMBMLNM6ESES56SYKZFA3BJGO37YKXTEJUM2IP`](https://stellar.expert/explorer/testnet/contract/CAXMWH5RIF3ZTH6IGKZMBMLNM6ESES56SYKZFA3BJGO37YKXTEJUM2IP)
- **SubmissionRegistry Contract**: [`CCV2TRDYYCGZE5AEQYZSZXVH6FYKBDPTRAXS2ZMI377ROMUULIGHKKHX`](https://stellar.expert/explorer/testnet/contract/CCV2TRDYYCGZE5AEQYZSZXVH6FYKBDPTRAXS2ZMI377ROMUULIGHKKHX)
- **Stellar Network**: `Stellar Testnet`

---

## 🏗️ Technical Stack & badges

![Stellar](https://img.shields.io/badge/Stellar-Black?style=for-the-badge&logo=stellar)
![Soroban](https://img.shields.io/badge/Soroban-Rust-orange?style=for-the-badge&logo=rust)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Freighter](https://img.shields.io/badge/Freighter_Wallet-0052FF?style=for-the-badge&logo=stellar&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00AD9F?style=for-the-badge&logo=netlify&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

---

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [The Solution](#the-solution)
4. [Key Features](#key-features)
5. [System Architecture](#system-architecture)
6. [Application Workflows](#application-workflows)
7. [Smart Contract Design](#smart-contract-design)
8. [Wallet Integration](#wallet-integration)
9. [User Interface Overview](#user-interface-overview)
10. [Real-Time Event Streaming](#real-time-event-streaming)
11. [Security Model](#security-model)
12. [Project Structure](#project-structure)
13. [Technology Stack Matrix](#technology-stack-matrix)
14. [Installation Guide](#installation-guide)
15. [Environment Variables](#environment-variables)
16. [Local Development & Setup](#local-development--setup)
17. [Testing Suite](#testing-suite)
18. [CI/CD Pipeline](#cicd-pipeline)
19. [Responsive Design & Accessibility](#responsive-design--accessibility)
20. [Stellar Campus Program Level 3 Compliance Checklist](#stellar-campus-program-level-3-compliance-checklist)
21. [Future Roadmap](#future-roadmap)
22. [Team & Contributions](#team--contributions)
23. [License](#license)
24. [Acknowledgements](#acknowledgements)

---

## 🌟 Project Overview

Traditional freelance marketplaces suffer from fee bloat, payment delays, and trust asymmetry. Project owners frequently delay payouts, and developers are left with little recourse when disputes arise. By transitioning reward escrowing to on-chain logic, **BountyBridge** solves these systemic problems.

BountyBridge was built to serve as a decentralized bridge connecting Web3 creators and developers. By utilizing Soroban smart contracts, the escrow is managed entirely by self-executing code. The project owner funds the escrow upon creation, proving that funds are locked, and developers submit proof of work directly. When a winner is selected, the contract instantly and autonomously dispatches the funds to the winner's Stellar wallet.

### Why Stellar & Soroban?
- **Predictable, Low Fees**: Stellar transactions cost a fraction of a cent, ensuring that even micro-bounties are cost-effective.
- **Fast Settlements**: Escrows are resolved and settled in under 5 seconds.
- **Robust Security**: The Soroban Rust SDK offers a sandboxed WebAssembly execution environment with strict state isolation and formal authorization hooks.

---

## ⚠️ Problem Statement

Modern freelancing platforms are bottlenecked by centralized design:
- **Delayed Payouts**: Creators hold developer funds in traditional bank structures, resulting in long settlement cycles.
- **Payment Trust Deficit**: Developers must work on good faith. There is no proof that the bounty budget is actually allocated or available.
- **High Platforms Fees**: Services like Upwork or Fiverr extract up to 20% of the contract value.
- **Lack of Verification**: Creator requirements change mid-project, and dispute resolution is opaque.

---

## 💡 The Solution

BountyBridge implements a decentralized architecture to fix the gig economy:
- **On-Chain Escrows**: Once a bounty is initialized, funds are transferred to the escrow contract, guaranteeing that the reward is locked.
- **Wallet-Level Identity**: Creators and contributors connect via Freighter, Albedo, or xBull, using public/private key pairs for authentication.
- **Self-Executing Payouts**: The selection of a winner triggers immediate payout release.
- **Decentralized Reputation**: Contributors gain a verifiable reputation score based on their history of on-chain submissions, wins, and deposits.

---

## 🛠️ Key Features

| Feature | Description | Deployed State |
|---|---|---|
| **Wallet Connection** | Multi-wallet authentication support using Freighter, Albedo, xBull, and local Simulator profiles. | Complete |
| **Bounty Creation** | Creators input requirements, choose a deadline, specify a reward amount, and initialize deposits. | Complete |
| **Escrow Rewards** | Cryptographically locks reward tokens inside the smart contract during the bounty lifecycle. | Complete |
| **Submission Management** | Contributors register solution links, code documentation, and metadata on-chain. | Complete |
| **Winner Selection** | Creators select a winner, releasing the locked escrow funds directly to the developer. | Complete |
| **Dispute Resolution / Cancellation** | Allows creators to cancel inactive bounties and claim refunds after the deadline expires. | Complete |
| **Transaction Audits** | Full transparency of all transaction hashes, linked explorer events, and state mutations. | Complete |
| **Reputation System** | Automatically calculates developer reputation based on historical activities. | Complete |
| **CI/CD Automations** | Validates code formatting, Rust compilations, and React bundles on every branch merge. | Complete |

---

## 📐 System Architecture

BountyBridge operates entirely without a traditional database or backend server. State persistence relies on a hybrid of the Stellar ledger and localized client-side store backups.

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend App                   │
│   (Vite + TypeScript + Zustand State + LocalStorage)    │
└────────────────────────────┬────────────────────────────┘
                             │ (Signatures / Invokes)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Wallet Middleware                    │
│           (Freighter / Albedo / xBull SDKs)             │
└────────────────────────────┬────────────────────────────┘
                             │ (Signed XDR Submit)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   Stellar Horizon RPC                   │
│           (Testnet Node Endpoint Processing)            │
└────────────────────────────┬────────────────────────────┘
                             │ (WASM Invocation)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 Soroban Smart Contracts                 │
│    (bounty_escrow.wasm  /  submission_registry.wasm)    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Application Workflows

### 1. Creator Workflow
```
[ Connect Wallet ]
        │
        ▼
[ Input Details (Reward, Title, Deadline) ]
        │
        ▼
[ Invoke create_bounty() on BountyEscrow ]
        │
        ▼
[ Tokens Transferred & Locked in Escrow ]
        │
        ▼
[ Monitor Submissions ] ──► [ Select Winner ] ──► [ Release Escrow Funds ]
```

### 2. Contributor Workflow
```
[ Connect Wallet ]
        │
        ▼
[ Explore Active Bounties ]
        │
        ▼
[ Submit Solution Meta to SubmissionRegistry ]
        │
        ▼
[ Solution Verified on Ledger ]
        │
        ▼
[ Winner Selected ] ──► [ Receive Tokens Directly in Stellar Wallet ]
```

---

## 📜 Smart Contract Design

The contracts are built in Rust using the Soroban SDK.

### 1. Bounty Escrow Contract (`bounty-escrow`)
Manages locking reward balances, tracking deadlines, and transferring tokens.

#### Functions:
- `create_bounty(env: Env, creator: Address, reward_amount: i128, deadline: u64) -> u32`
  - Instantiates a new bounty, stores it in contract storage, and returns a unique incremented bounty ID.
- `lock_reward(env: Env, bounty_id: u32)`
  - Transfers the reward tokens from the creator's wallet into the escrow contract's address using the Stellar Asset Contract token client.
- `select_winner(env: Env, bounty_id: u32, winner: Address)`
  - Rehearses ownership checks, verifies the bounty is unresolved, transfers the locked tokens to the winner, and marks the status as completed.
- `cancel_bounty(env: Env, bounty_id: u32)`
  - Verifies the caller is the creator, checks if the deadline has passed, releases the escrowed funds back to the creator, and marks the status as cancelled.

---

### 2. Submission Registry Contract (`submission-registry`)
Records solution URLs, metadata, and developer records on-chain.

#### Functions:
- `add_submission(env: Env, bounty_id: u32, contributor: Address, proof_url: Symbol)`
  - Authenticates the contributor via `require_auth()` and logs the proof hash under the bounty ID and contributor keys.
- `get_submissions_by_bounty(env: Env, bounty_id: u32) -> Vec<RegistrySubmission>`
  - Queries contract storage to fetch all solutions logged for a specific bounty.
- `get_submissions_by_user(env: Env, contributor: Address) -> Vec<RegistrySubmission>`
  - Queries contract storage to fetch all historical work submitted by a developer address.
- `update_submission_status(env: Env, bounty_id: u32, contributor: Address, proof_url: Symbol, new_status: u32, updater: Address)`
  - Updates the submission status to Accepted, Rejected, or Winner.

---

## 💼 Wallet Integration

BountyBridge implements a multi-wallet adapter pattern to connect to the Stellar Network.

- **Freighter Wallet**: Extracted from `@stellar/freighter-api`. Implements native browser extension popup signing.
- **Albedo Wallet**: Integrates via the Albedo web interface, ideal for developers using non-Chrome platforms.
- **xBull Wallet**: Integrates for advanced users managing multiple key pairs.
- **Simulator Profiles**: Pre-loads simulated test addresses so developers can test the complete end-to-end flow instantly in the browser.

---

## 🖥️ User Interface Overview

BountyBridge implements a premium handcrafted, developer-first SaaS aesthetic using a cohesive natural palette:
- **Palette**: Moss Green (`#778873`), Sage Green (`#A1BC98`), Warm Stone (`#DCCFC0`), and Cream (`#FDF6ED`).
- **Typography**: Sleek, sans-serif layouts designed for maximum readability.

### Key Pages:
- **Landing Dashboard**: Introduces the platform, metrics, and active ecosystem bounty statistics.
- **Explore Board**: Advanced client-side search, filtering by category (Development, Design, Security), and sorting.
- **Create Form**: Interactive dashboard that helps creators calculate timelines, enter reward amounts, and initialize contract deposits.
- **Bounty Details**: Shows requirements, locked transaction details, and a contributor submission interface.
- **Profile Summary**: Displays the connected user's credentials, active milestones (Legend, Expert, Builder), and reputation score.

---

## 📡 Real-Time Event Streaming

The frontend synchronizes contract events dynamically:
- **Stellar Horizon Event Log**: Monitors incoming transactions on-chain.
- **UI Notifications**: Triggers instant notifications when a creator creates a bounty, a developer uploads a submission, or a winner receives a payout.
- **Persistent Transactions**: Logged transactions are saved directly to the user's audit trail, complete with `stellar.expert` links.

---

## 🔒 Security Model

BountyBridge prioritizes code safety and security:
- **Cryptographic Auths**: Smart contract transactions require explicit cryptographic signatures (`require_auth()`).
- **Role Isolation**: Only the creator can cancel a bounty or select a winner. Only the contributor can submit work.
- **Escrow Custody**: Funds are stored directly inside the contract, separating them from user wallets during the bounty lifecycle.
- **Double-Spend & Replay Protection**: Handled at the ledger level by the Stellar protocol.
- **Unit Test Coverage**: Comprehensive Rust test suites verify that unauthenticated wallets cannot call admin operations.

---

## 📁 Project Structure

```
BountyBridge/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI/CD configuration
├── client/
│   ├── public/                # Static public assets
│   ├── src/
│   │   ├── assets/            # CSS, images, and graphics
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Route templates (Dashboard, Explore, etc.)
│   │   ├── services/          # Stellar wallet interface services
│   │   ├── store/             # Zustand decentralized state management
│   │   └── types/             # TypeScript model definitions
│   ├── tailwind.config.js     # Tailwind CSS theme configurations
│   └── vite.config.ts         # Vite server settings
├── contracts/
│   ├── bounty-escrow/         # Bounty Escrow Soroban contract (Rust)
│   └── submission-registry/   # Submission Registry Soroban contract (Rust)
├── netlify.toml               # Netlify SPA deployment configuration
└── README.md                  # Comprehensive Documentation
```

---

## ⚙️ Technology Stack Matrix

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styles & Theme** | Tailwind CSS |
| **State Store** | Zustand, LocalStorage Cache |
| **Smart Contracts** | Rust, Soroban SDK v22.0.2 |
| **Blockchain SDK** | `stellar-sdk`, `@stellar/freighter-api` |
| **Testing** | Rust cargo unit tests, cargo testrunner |
| **Deployment** | Netlify |

---

## 🔧 Installation Guide

### Prerequisites
- Node.js (v18+)
- Rust & Cargo (with `wasm32-unknown-unknown` target installed)
- Stellar CLI (optional, for contract deployments)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/krishnakumar609/BountyBridge.git
   cd BountyBridge
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Compile Smart Contracts**
   ```bash
   cd ../contracts
   cargo build --target wasm32-unknown-unknown --release
   ```

4. **Run Contract Tests**
   ```bash
   cargo test
   ```

5. **Start Frontend Dev Server**
   ```bash
   cd ../client
   npm run dev
   ```

---

## 🌐 Environment Variables

Create a `.env` file inside the `client/` folder:

| Variable Name | Description | Example Value |
|---|---|---|
| `VITE_RPC_URL` | Stellar Horizon/Soroban RPC URL | `https://soroban-testnet.stellar.org` |
| `VITE_NETWORK_PASSPHRASE` | Identifies the Stellar network | `Test SDF Network ; September 2015` |
| `VITE_ESCROW_CONTRACT_ID` | Address of the deployed Escrow contract | `CAXMWH5RIF3ZTH6IGKZMBMLNM6ESES56SYKZFA3BJGO37YKXTEJUM2IP` |
| `VITE_REGISTRY_CONTRACT_ID` | Address of the Registry contract | `CCV2TRDYYCGZE5AEQYZSZXVH6FYKBDPTRAXS2ZMI377ROMUULIGHKKHX` |

---

## 🧪 Testing Suite

### 1. Smart Contract Unit Tests
The contract logic is validated using built-in testing libraries:
```bash
cd contracts
cargo test
```
The test suite compiles the WASM bytecode, mocks transaction authorities, funds test addresses, and verifies contract state changes.

### 2. Frontend Build Verification
Verify that the React compiler builds production-ready bundles without errors:
```bash
cd client
npm run build
```

---

## 🛡️ CI/CD Pipeline

The project uses GitHub Actions (`.github/workflows/ci.yml`) to maintain code quality:
- **Rust Unit Tests**: Automatically runs tests on every push.
- **Frontend Validation**: Runs TypeScript checks (`tsc`) and Vite builds on every branch merge.
- **Netlify Deployments**: Automatically deploys the `client/dist` directory to production upon merging changes into the `main` branch.

---

## ♿ Responsive Design & Accessibility

- **Responsive Screens**: Fully optimized for mobile, tablet, laptop, and 4K desktop configurations.
- **Accessibility**:
  - ARIA attributes are integrated across all interactive inputs and buttons.
  - Keyboard navigation is fully supported for all menus, forms, and modals.
  - High-contrast visual elements ensure readability for visually impaired users.

---

## 🎓 Stellar Campus Program Compliance Checklist

- [x] **Wallet Integration**: Completed Freighter, Albedo, and xBull integrations.
- [x] **Smart Contract Deployment**: Deployed verified contracts to Stellar Testnet.
- [x] **Frontend Integration**: Connected React client to the Horizon RPC network.
- [x] **Transaction Handling**: Displays clear loading and confirmation overlays for all on-chain operations.
- [x] **Error Handling**: Gracefully handles transaction rejections and network errors.
- [x] **Testing**: Implemented comprehensive unit tests for both contracts.
- [x] **Documentation**: Created a complete, hackathon-grade README.md.
- [x] **CI/CD**: Active GitHub Actions workflows for automated verification.

---

## 🗺️ Future Roadmap

- **Phase 1: Milestone-Based Payments**: Allow creators to divide payouts across multiple deliverables.
- **Phase 2: DAO Governance**: Enable developers to vote on disputes and resolve code claims collectively.
- **Phase 3: Multi-Token Support**: Support stablecoin rewards (e.g. USDC on Stellar) alongside native XLM.
- **Phase 4: AI Submission Review**: Automatically review code submissions using automated LLM validation tools.

---

## 👥 Team & Contributions

- **Lead Developer**: `krishnakumar609` (Decentralized state architecture, Soroban smart contracts, and React implementation).
- **Stellar Community**: Special thanks to the Stellar Development Foundation and the open-source community for providing excellent documentation and tools.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🤝 Acknowledgements

- **Stellar Development Foundation**: For the Stellar Network and ecosystem tools.
- **Soroban Developers**: For providing the Rust SDK and sandbox test utilities.
- **Netlify**: For reliable, low-latency frontend hosting.
