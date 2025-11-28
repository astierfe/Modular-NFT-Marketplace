# Quick Start Guide

> Get started with Modular NFT in 5 minutes

## Prerequisites

- **Node.js** 18+ ([nodejs.org](https://nodejs.org))
- **Foundry** ([getfoundry.sh](https://getfoundry.sh))
- **Git**
- **MetaMask** or any Web3 wallet

## Installation

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd Modular-NFT-Marketplace
```

### 2. Install Dependencies

**Backend (Smart Contracts)**:
```bash
forge install
```

**Frontend**:
```bash
cd nft-frontend
npm install
```

### 3. Configure Environment

**Backend** (`.env.local`):
```bash
RPC_URL=http://localhost:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
COLLECTION_NAME="Dev NFT Collection"
COLLECTION_SYMBOL="DEVNFT"
MAX_SUPPLY=100
MINT_PRICE=0
BASE_URI="http://localhost:8080/ipfs/"
```

**Frontend** (`nft-frontend/.env.local`):
```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Contract addresses
NEXT_PUBLIC_CONTRACT_ADDRESS_ANVIL=0xd34F288Fa68b657926989EF286477E9f3C87A825
NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA=0xd34F288Fa68b657926989EF286477E9f3C87A825
```

## Local Development

### Terminal 1 - Start Anvil (Local Blockchain)

```bash
anvil
```

### Terminal 2 - Deploy Contract

```bash
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY --broadcast
```

**Note the deployed contract address**, then update:
- `nft-frontend/lib/contracts/ModularNFT.ts` → `CONTRACT_ADDRESSES[31337]`

### Terminal 3 - Start Frontend

```bash
cd nft-frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Basic Usage

### 1. Connect Wallet

Click **"Connect Wallet"** → Select MetaMask → Approve connection

### 2. View Collection

Navigate to **"Collection"** tab → Browse minted NFTs

### 3. Mint NFT (Owner Only)

1. Navigate to **"Mint"** tab
2. Select an image from the gallery
3. Enter recipient address
4. Click **"Owner Mint (Free)"**
5. Confirm transaction in wallet

### 4. Configure Contract (Admin Only)

Navigate to **"Admin"** tab:
- Set mint price
- Toggle public minting
- Configure royalties
- Withdraw funds

## Deploy to Sepolia

### 1. Get Sepolia ETH

Visit [sepolia-faucet.pk910.de](https://sepolia-faucet.pk910.de)

### 2. Configure Environment

Create `.env.sepolia`:
```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=YOUR_KEY
COLLECTION_NAME="Modular NFT Collection - Sepolia"
COLLECTION_SYMBOL="MNFT-SEP"
MAX_SUPPLY=100
MINT_PRICE=10000000000000000  # 0.01 ETH
BASE_URI="https://gateway.pinata.cloud/ipfs/"
```

### 3. Deploy

```bash
./script/deploy-sepolia.sh
```

### 4. Verify on Etherscan

```bash
forge verify-contract {CONTRACT_ADDRESS} ModularNFT \
  --chain sepolia \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### 5. Update Frontend

Edit `nft-frontend/lib/contracts/ModularNFT.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  31337: '0x...',      // Anvil
  11155111: '0x...',   // Sepolia ← UPDATE THIS
  1: '0x',             // Mainnet
}
```

## Testing

### Run Smart Contract Tests

```bash
forge test
```

### Run with Verbosity

```bash
forge test -vvv
```

### Gas Report

```bash
forge test --gas-report
```

## NFT Asset Pipeline

To create and mint your own NFTs:

1. **Create artwork** (1024x1024 PNG)
2. **Upload to Pinata** → Get Image CID
3. **Create metadata JSON**:
   ```json
   {
     "name": "My NFT #1",
     "description": "Description",
     "image": "ipfs://YOUR_IMAGE_CID",
     "attributes": [
       {"trait_type": "Rarity", "value": "Common"}
     ]
   }
   ```
4. **Upload metadata to Pinata** → Get Metadata CID
5. **Mint**: `ownerMint(address, "ipfs://METADATA_CID")`

See [NFT Asset Pipeline](../nft-assets/NFT_ASSET_PIPELINE.md) for complete guide.

## Troubleshooting

### "Contract not deployed"
- Check contract address in `ModularNFT.ts` matches deployment
- Verify you're on correct network (Anvil/Sepolia)

### "Insufficient funds"
- Ensure wallet has ETH for gas fees
- For Sepolia: Use faucet to get test ETH

### "Minting not active"
- Admin must enable minting: `setMintingActive(true)`
- Or use owner mint (always available)

### IPFS images not loading
- Check IPFS gateways are accessible
- Frontend has 4 fallback gateways (auto-retry)
- Verify CID is correct in metadata

## Next Steps

- 📖 Read [System Overview](../architecture/SYSTEM_OVERVIEW.md)
- 📜 Review [Contract API](../smart-contracts/CONTRACT_API.md)
- 🚀 Study [Deployment Guide](../deployment/DEPLOYMENT_GUIDE.md)
- 🎨 Create your NFTs with [Asset Pipeline](../nft-assets/NFT_ASSET_PIPELINE.md)

## Support

- Check [documentation](../)
- Review [CONTRACT_ADDRESSES.md](../deployment/CONTRACT_ADDRESSES.md)
- Open an issue on GitHub

---

**Ready to build?** Start with local development, then deploy to Sepolia when ready!
