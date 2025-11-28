# Modular NFT Documentation

Complete technical documentation for the Modular NFT platform - a production-ready Web3 NFT collection platform with ERC-721 smart contracts and Next.js frontend.

## Quick Navigation

### 🏗️ Architecture
- **[System Overview](architecture/SYSTEM_OVERVIEW.md)** - High-level system architecture and components
- **[Technical Architecture](architecture/TECHNICAL_ARCHITECTURE.md)** - Detailed component architecture with diagrams
- **[Frontend Architecture](architecture/FRONTEND_ARCHITECTURE.md)** - Next.js app structure and Web3 integration
- **[Blockchain Layer](architecture/BLOCKCHAIN_LAYER.md)** - Smart contract layer details *(Coming in Phase 2)*

### 📚 Guides
- **[Getting Started](guides/GETTING_STARTED.md)** - Quick start guide and prerequisites *(Coming in Phase 2)*
- **[Local Development](guides/LOCAL_DEVELOPMENT.md)** - Development environment setup *(Coming in Phase 2)*
- **[Testing Guide](guides/TESTING_GUIDE.md)** - Test suite usage and coverage *(Coming in Phase 2)*
- **[Troubleshooting](guides/TROUBLESHOOTING.md)** - Common issues and solutions *(Coming in Phase 2)*

### 📜 Smart Contracts
- **[ModularNFT Contract](smart-contracts/MODULAR_NFT.md)** - Contract overview and state machine *(Coming in Phase 2)*
- **[Contract API](smart-contracts/CONTRACT_API.md)** - Complete function reference *(Coming in Phase 2)*
- **[Security](smart-contracts/SECURITY.md)** - Security features and best practices *(Coming in Phase 2)*
- **[Gas Optimization](smart-contracts/GAS_OPTIMIZATION.md)** - Gas costs and optimization *(Coming in Phase 2)*

### 🚀 Deployment
- **[Contract Addresses](deployment/CONTRACT_ADDRESSES.md)** - **⚠️ CRITICAL** Official contract addresses
- **[Deployment Guide](deployment/DEPLOYMENT_GUIDE.md)** - Step-by-step deployment process
- **[Network Configuration](deployment/NETWORK_CONFIGURATION.md)** - Network configs and .env setup *(Coming in Phase 2)*
- **[Verification](deployment/VERIFICATION.md)** - Etherscan verification process *(Coming in Phase 2)*

### 🎨 NFT Assets
- **[NFT Asset Pipeline](nft-assets/NFT_ASSET_PIPELINE.md)** - Complete creation pipeline (Nano Banana → Marketplace)
- **[Metadata Standard](nft-assets/METADATA_STANDARD.md)** - ERC-721 JSON metadata spec *(Coming in Phase 2)*
- **[IPFS Integration](nft-assets/IPFS_INTEGRATION.md)** - Pinata upload and IPFS gateways *(Coming in Phase 2)*
- **[Collection Details](nft-assets/COLLECTION_DETAILS.md)** - Crypto Code Doodles collection info *(Coming in Phase 2)*

### 🏪 Marketplace
- **[Marketplace Integration](marketplace/MARKETPLACE_INTEGRATION.md)** - External marketplace integration *(Coming in Phase 2)*
- **[OpenSea Setup](marketplace/OPENSEA_SETUP.md)** - OpenSea listing guide *(Coming in Phase 2)*

## Project Overview

**Modular NFT** is a complete NFT collection platform featuring:

- **Smart Contract**: ModularNFT.sol - ERC-721 with EIP-2981 royalties
- **Frontend**: Next.js 15 + wagmi v2 + RainbowKit
- **Deployment**: Ethereum Sepolia testnet
- **Collection**: "Crypto Code Doodles" - 10 unique NFTs (100 max supply)
- **Trading**: Integration with external marketplace contract

### Key Features

**Smart Contract**:
- ✅ ERC-721 standard with Enumerable and URIStorage extensions
- ✅ EIP-2981 royalty standard (5% default)
- ✅ Owner and public minting functions
- ✅ Batch minting for gas efficiency
- ✅ Configurable collection parameters (price, supply, base URI)
- ✅ Emergency withdrawal functions

**Frontend**:
- ✅ Wallet connection via RainbowKit (MetaMask, WalletConnect, etc.)
- ✅ Real-time NFT collection display with IPFS metadata
- ✅ Advanced filtering and sorting (rarity, owner, search)
- ✅ Admin panel for contract owners
- ✅ Minting interface (public + owner mint)
- ✅ Optimized IPFS image loading with multiple gateway fallbacks

**Infrastructure**:
- ✅ IPFS storage via Pinata
- ✅ Multiple IPFS gateway fallbacks
- ✅ Alchemy RPC for blockchain queries
- ✅ Vercel frontend deployment
- ✅ Etherscan contract verification

## Current Deployment

**Network**: Ethereum Sepolia Testnet

**Smart Contract**:
- Address: `0xd34F288Fa68b657926989EF286477E9f3C87A825`
- Verified: [View on Etherscan](https://sepolia.etherscan.io/address/0xd34F288Fa68b657926989EF286477E9f3C87A825)
- Collection: "Modular NFT Collection - Sepolia"
- Max Supply: 100 NFTs
- Mint Price: 0.01 ETH (public mint)

**External Marketplace**:
- Address: `0x2AE08980761CB189DA6ca1f89fffD0C6DAD65a8F`
- Frontend: [modular-marketplace.vercel.app/marketplace](https://modular-marketplace.vercel.app/marketplace)
- Repository: [github.com/astierfe/Modular-Marketplace](https://github.com/astierfe/Modular-Marketplace)

See [deployment/CONTRACT_ADDRESSES.md](deployment/CONTRACT_ADDRESSES.md) for complete address information.

## Collection: Crypto Code Doodles

The platform currently hosts the "Crypto Code Doodles" collection - coding-themed digital art NFTs:

- **Total Created**: 10 unique NFTs
- **Rarity Distribution**:
  - Common (40%): 4 NFTs - Basic code elements
  - Rare (30%): 3 NFTs - Advanced code concepts
  - Epic (20%): 2 NFTs - Complex systems
  - Legend (10%): 1 NFT - Ultimate developer achievement

Each NFT features:
- 1024x1024px PNG artwork
- Detailed ERC-721 metadata
- Rarity-based attributes
- Programming language themes
- 5% creator royalty (EIP-2981)

## Technology Stack

**Smart Contract Development**:
- Solidity 0.8.20
- Foundry (forge, cast, anvil)
- OpenZeppelin Contracts 4.9.3
- Etherscan verification

**Frontend Development**:
- Next.js 15.0.0 (App Router)
- React 18.3.0
- TypeScript 5.6.0
- wagmi 2.12.0 (Web3 React Hooks)
- viem 2.21.0 (Ethereum interactions)
- RainbowKit 2.1.0 (Wallet UI)
- TanStack React Query 5.56.0
- Tailwind CSS 3.4.0

**Infrastructure**:
- IPFS / Pinata Cloud
- Alchemy SDK 3.6.3
- Vercel (frontend hosting)
- GitHub (version control)

## Documentation Structure

This documentation follows a modular structure for easy navigation:

```
docs/
├── README.md (this file)
├── architecture/          # System architecture and design
├── guides/                # Getting started and development guides
├── smart-contracts/       # Contract documentation and API
├── deployment/            # Deployment and configuration
├── nft-assets/            # NFT creation pipeline and assets
└── marketplace/           # Marketplace integration
```

## Diagrams Index

The documentation includes 7 Mermaid diagrams for visual understanding:

1. **System Overview** - High-level architecture (in [architecture/SYSTEM_OVERVIEW.md](architecture/SYSTEM_OVERVIEW.md))
2. **Detailed Architecture** - Component layers (in [architecture/TECHNICAL_ARCHITECTURE.md](architecture/TECHNICAL_ARCHITECTURE.md))
3. **NFT Minting Flow** - Asset pipeline (in [nft-assets/NFT_ASSET_PIPELINE.md](nft-assets/NFT_ASSET_PIPELINE.md))
4. **NFT Loading Flow** - Frontend data flow *(Coming in Phase 2)*
5. **User Interaction** - User journey flowchart *(Coming in Phase 2)*
6. **Contract State Machine** - Contract lifecycle *(Coming in Phase 2)*
7. **Deployment Pipeline** - Deployment workflow (in [deployment/DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md))

All diagrams render natively in GitHub markdown.

## Getting Started

**For Users**: Start with [guides/GETTING_STARTED.md](guides/GETTING_STARTED.md) *(Coming in Phase 2)*

**For Developers**: Review [architecture/SYSTEM_OVERVIEW.md](architecture/SYSTEM_OVERVIEW.md), then [guides/LOCAL_DEVELOPMENT.md](guides/LOCAL_DEVELOPMENT.md) *(Coming in Phase 2)*

**For Deployers**: See [deployment/DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md)

**For NFT Creators**: Read [nft-assets/NFT_ASSET_PIPELINE.md](nft-assets/NFT_ASSET_PIPELINE.md)

## Archived Documentation

Original French documentation and PlantUML diagrams have been preserved in the [`../archive/`](../archive/) directory. See [`../archive/README.md`](../archive/README.md) for details.

## Contributing

For contribution guidelines, see the main [README.md](../README.md#contributing).

## Support

For questions or issues:
- Review this documentation thoroughly
- Check [guides/TROUBLESHOOTING.md](guides/TROUBLESHOOTING.md) *(Coming in Phase 2)*
- Open an issue on GitHub
- Contact: support@example.com *(placeholder)*

## License

MIT License - See [../README.md](../README.md#license) for details.

---

**Last Updated**: 2025
**Documentation Version**: 1.0 (Priority 1 Phase)
**Project Status**: ✅ Deployed on Sepolia, Active Development
