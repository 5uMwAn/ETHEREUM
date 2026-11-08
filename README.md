# Ethereum NFT Tokenization Platform

A simple NFT tokenization platform built on Ethereum. Create, explore, and transfer unique digital collectibles using ERC-721 smart contracts.

**Live application:** https://ethereum-tan.vercel.app

## Overview

This project demonstrates how digital assets can be represented as non-fungible tokens (NFTs) on the Ethereum blockchain.

Users can mint NFTs, browse the public collection, view their owned NFTs, and transfer tokens to other wallet addresses.

The application uses the Ethereum Sepolia testnet. It is an educational project and does not represent ownership of physical or real-world assets.

## Features

- **Mint NFTs:** Create ERC-721 tokens with a name, description, and image.
- **Public Gallery:** Browse NFTs minted through the platform.
- **My NFTs:** View the NFTs owned by your connected wallet.
- **Transfer NFTs:** Transfer tokens to another Ethereum address.
- **IPFS Metadata:** Store NFT metadata using IPFS.
- **Wallet Integration:** Connect an Ethereum wallet to interact with the application.

## Technology Stack

| Smart contracts         | Solidity, OpenZeppelin     |
| ----------------------- | -------------------------- |
| Development environment | Hardhat                    |
| Frontend                | Next.js, React, TypeScript |
| Ethereum interaction    | Wagmi, Viem                |
| Wallet connection       | RainbowKit                 |
| Metadata storage        | IPFS                       |
| Blockchain network      | Ethereum Sepolia           |
| Frontend hosting        | Vercel                     |
| Layer                   | Technologies               |

## Smart Contract

The `YourCollectible` ERC-721 smart contract is deployed on Ethereum Sepolia.

- **Contract address:** `0x5ad74cf92f36e514b0b9c593a4f77acc02c0b7da`
- **Network:** Sepolia Testnet
- **Explorer:** [View contract on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x5ad74cf92f36e514b0b9c593a4f77acc02c0b7da)

## Getting Started

### Requirements

- Node.js 22.10 or newer
- Yarn 4.13.0
- Git
- An Ethereum wallet, such as MetaMask

### Installation

Clone the repository and install dependencies:

```bash
git clone <https://github.com/5uMwAn/ETHEREUM>
cd challenge-tokenization
yarn install
```

### Environment Configuration

Create local environment files from the provided examples:

```bash
cp packages/hardhat/.env.example packages/hardhat/.env
cp packages/nextjs/.env.example packages/nextjs/.env.local
```

Configure the required values in those local files using the examples as a guide. Never commit private keys, API secrets, or other credentials.

### Run Locally

Start a local Hardhat blockchain:

```bash
yarn chain
```

In a second terminal, deploy the contracts to the local network:

```bash
yarn deploy
```

In a third terminal, start the frontend:

```bash
yarn workspace @se-2/nextjs dev --webpack
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Useful Commands

| Command | Description |
|---|---|
| `yarn chain` | Start a local blockchain |
| `yarn deploy` | Deploy contracts |
| `yarn test` | Run smart contract tests |
| `yarn compile` | Compile smart contracts |
| `yarn next:build` | Build the frontend |
| `yarn lint` | Run lint checks |

## Project Structure

```text
challenge-tokenization/
├── packages/
│   ├── hardhat/
│   │   ├── contracts/       # Solidity smart contracts
│   │   ├── deploy/           # Deployment scripts
│   │   └── test/             # Contract tests
│   │
│   └── nextjs/
│       ├── app/              # Application pages
│       ├── components/       # Shared UI components
│       ├── contracts/        # Contract configuration
│       ├── services/         # Web3 services
│       └── styles/           # Application styles
│
├── package.json
└── yarn.lock
```

## Network Information

The public application uses the **Ethereum Sepolia testnet**. Make sure your wallet is connected to Sepolia before minting or transferring NFTs.

Sepolia ETH is test currency and has no intended real-world monetary value. This project is intended for learning and experimentation, not production asset issuance.

## License

See [LICENCE](LICENCE) for license information.