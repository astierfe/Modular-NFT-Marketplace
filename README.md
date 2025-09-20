# Modular NFT Marketplace

A complete Web3 NFT collection platform built with modern Ethereum development tools. Features a Solidity smart contract backend and a Next.js frontend with full Web3 integration.

## 🌟 Features

### Smart Contract (ModularNFT.sol)
- **ERC-721 Standard**: Full NFT implementation with enumerable and URI storage extensions
- **EIP-2981 Royalties**: Built-in royalty system for secondary sales
- **Flexible Minting**: Owner and public minting with configurable pricing
- **Batch Operations**: Efficient batch minting for collections
- **Access Control**: Owner-only administrative functions
- **Financial Management**: Secure fund withdrawal mechanisms
- **Supply Management**: Configurable and reducible max supply

### Frontend (Next.js 15)
- **Modern Web3 Stack**: wagmi v2 + RainbowKit + React Query
- **Multi-Chain Support**: Anvil (local), Sepolia (testnet), Ethereum Mainnet
- **Responsive Design**: Tailwind CSS with dark/light mode
- **Real-time Updates**: Live contract state synchronization
- **Admin Panel**: Complete contract management interface
- **IPFS Integration**: Decentralized metadata and image storage

## 🏗️ Architecture

```
nft-contracts/                    # Root project
├── src/
│   └── Modular-NFT.sol          # Main smart contract
├── script/
│   └── Deploy.s.sol             # Deployment scripts
├── test/
│   └── TestModularNFT.sol       # Comprehensive test suite
├── foundry.toml                 # Foundry configuration
└── nft-frontend/                # Next.js frontend
    ├── app/                     # App Router structure
    ├── components/              # React components
    ├── hooks/                   # Custom Web3 hooks
    ├── lib/                     # Utilities and configurations
    └── package.json             # Frontend dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Foundry
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd nft-contracts
```

### 2. Install Dependencies
```bash
# Backend dependencies
forge install

# Frontend dependencies
cd nft-frontend
npm install
```

### 3. Environment Setup

**Backend (.env.local):**
```bash
# Local Anvil
RPC_URL=http://localhost:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
COLLECTION_NAME="Dev NFT Collection"
COLLECTION_SYMBOL="DEVNFT"
MAX_SUPPLY=10000
MINT_PRICE=0
BASE_URI="http://localhost:8080/ipfs/"
```

**Frontend (nft-frontend/.env.local):**
```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Contract addresses (update after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS_ANVIL=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA=0x72Bd342Ec921BFcfDaeb429403cc1F0Da43fD312
NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET=your_mainnet_address
```

> ⚠️ **Important**: After deploying to new networks, update the contract addresses in:
> - `nft-frontend/lib/contracts/ModularNFT.ts` (CONTRACT_ADDRESSES object)
> - `nft-frontend/.env.local` (NEXT_PUBLIC_CONTRACT_ADDRESS_* variables)

### 4. Local Development

**Terminal 1 - Start Anvil:**
```bash
anvil
```

**Terminal 2 - Deploy Contract:**
```bash
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```

**Terminal 3 - Start Frontend:**
```bash
cd nft-frontend
npm run dev
```

**Access:** http://localhost:3000

## 🧪 Testing

### Smart Contract Tests
```bash
# Run all tests
forge test

# Run with gas reporting
forge test --gas-report

# Run specific test
forge test --match-test testOwnerMint

# Coverage report
forge coverage
```

### Frontend Testing
```bash
cd nft-frontend
npm run test
```

## 🌐 Deployment

### Sepolia Testnet
```bash
# Deploy to Sepolia
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify

# The deployment will output the contract address, copy it for next steps
# Example output: "Contract Address: 0x72Bd342Ec921BFcfDaeb429403cc1F0Da43fD312"

# Verify contract
forge verify-contract <CONTRACT_ADDRESS> ModularNFT --chain sepolia
```

**After deployment, update contract addresses:**

**1. Update Frontend Contract Registry:**
```typescript
// Edit: nft-frontend/lib/contracts/ModularNFT.ts
export const CONTRACT_ADDRESSES = {
  31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Anvil
  11155111: 'YOUR_SEPOLIA_ADDRESS_HERE', // ← Update this
  1: 'YOUR_MAINNET_ADDRESS_HERE', // ← Update this
} as const
```

**2. Update Frontend Environment:**
```bash
# Edit: nft-frontend/.env.local
NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA=YOUR_SEPOLIA_ADDRESS_HERE
NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET=YOUR_MAINNET_ADDRESS_HERE
```

### Mainnet
```bash
# Deploy to Mainnet (use with caution)
forge script script/Deploy.s.sol --rpc-url $MAINNET_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify

# Update contract addresses in ModularNFT.ts and .env.local (see above)
```

## 📊 Smart Contract API

### Core Functions
```solidity
// Minting
function publicMint(string tokenURI) payable returns (uint256)
function ownerMint(address to, string tokenURI) returns (uint256)
function ownerMintBatch(MintParams[] params) returns (uint256[])

// Configuration
function setMintPrice(uint256 newPrice)
function setMintingActive(bool active)
function setMaxSupply(uint256 newMaxSupply)

// Royalties
function setDefaultRoyalty(address recipient, uint96 feeNumerator)
function setTokenRoyalty(uint256 tokenId, address recipient, uint96 feeNumerator)

// Financial
function withdraw()
function emergencyWithdraw(address payable to)
```

### View Functions
```solidity
function getCollectionInfo() returns (CollectionInfo)
function getTokenInfo(uint256 tokenId) returns (TokenInfo)
function tokensOfOwner(address owner) returns (uint256[])
function royaltyInfo(uint256 tokenId, uint256 salePrice) returns (address, uint256)
```

## 🎨 Frontend Components

### Layout Components
- **Header**: Wallet connection and navigation
- **HeroSection**: Landing page for non-connected users
- **NavigationTabs**: Section switching for connected users

### NFT Components
- **NFTGrid**: Collection display with filtering and sorting
- **NFTCard**: Individual NFT display with metadata
- **NFTFiltersControls**: Search and filter interface

### Management Components
- **MintSection**: Public and owner minting interface
- **AdminSection**: Complete contract administration
- **CollectionStatsHeader**: Real-time collection statistics

## 🔧 Configuration

### Supported Networks
- **Anvil (31337)**: Local development
- **Sepolia (11155111)**: Testnet deployment
- **Ethereum Mainnet (1)**: Production deployment

### IPFS Integration
- **Metadata Storage**: JSON metadata on IPFS
- **Image Storage**: Decentralized image hosting
- **Gateway Support**: Multiple IPFS gateways for reliability

## 📈 Performance

### Gas Optimization
- **Deployment**: ~2.8M gas
- **Single Mint**: ~140k gas
- **Batch Mint (5)**: ~450k gas
- **Admin Operations**: ~45k gas average

### Frontend Performance
- **SSR Hydration**: Optimized with mounted guards
- **State Management**: Efficient Web3 state synchronization
- **Image Loading**: IPFS gateway fallbacks and optimization

## 🛡️ Security

### Smart Contract Security
- **ReentrancyGuard**: Protection against reentrancy attacks
- **Access Control**: Owner-only administrative functions
- **Input Validation**: Comprehensive parameter validation
- **Error Handling**: Explicit error messages and reverts

### Frontend Security
- **CSP Headers**: Content Security Policy implementation
- **Wallet Security**: No private key handling on frontend
- **Environment Variables**: Secure API key management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: [Technical Architecture](docs/architecture.md)
- **Frontend Specs**: [Frontend Specifications](docs/frontend-specs.md)
- **Deployment Guide**: [Deployment Instructions](docs/deployment.md)

## 📞 Support

For support, email [your-email@domain.com] or create an issue in this repository.

---

**Built with ❤️ using Foundry, Next.js, and modern Web3 technologies.**