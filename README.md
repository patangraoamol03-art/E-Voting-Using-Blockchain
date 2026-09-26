# ChainVote — Blockchain-Based E-Voting System

ChainVote is a decentralized e-voting system built using **Blockchain and Ethereum Smart Contracts**. It provides a secure and transparent platform for conducting elections while storing votes on the blockchain.

## Features

* 🔐 Secure voter authentication
* 🗳️ Blockchain-based vote recording
* 👨‍💼 Admin election management
* 📊 Transparent election results
* 🔗 MetaMask wallet integration
* ⚡ React-based user interface
* ⛓️ Ethereum smart contract integration

## Tech Stack

* **Frontend:** React, Vite, CSS
* **Blockchain:** Ethereum / Sepolia
* **Smart Contract:** Solidity
* **Web3:** Wagmi
* **Wallet:** MetaMask
* **Tools:** Node.js, Foundry

## How It Works

1. Connect MetaMask wallet.
2. Authenticate as a voter.
3. Select a candidate and submit the vote.
4. The vote is recorded through the Ethereum smart contract.
5. Admin manages the election.
6. Results can be viewed transparently from the blockchain.

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd ChainVote
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_CONTRACT_ADDRESS=your_contract_address
```

Start the development server:

```bash
npm run dev
```

## Smart Contract

The voting logic is implemented using a **Solidity smart contract** that handles voter registration, vote submission, election management, and result retrieval.

## Security

Blockchain-based storage makes vote records **transparent and tamper-resistant**, while MetaMask provides wallet-based authentication for interacting with the smart contract.

## Future Improvements

* Multi-election support
* Enhanced voter verification
* Improved admin dashboard
* Transaction status notifications
* Mainnet deployment

## Author

**Amol Patangrao**

MCA — Computer Science
Savitribai Phule Pune University
