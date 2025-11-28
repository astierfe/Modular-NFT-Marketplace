# Contract Addresses

> **⚠️ CRITICAL**: Official deployed contract addresses for Modular NFT platform

## Current Deployment

### Sepolia Testnet (Active)

**ModularNFT Contract**:
- **Address**: `0xd34F288Fa68b657926989EF286477E9f3C87A825`
- **Network**: Ethereum Sepolia (Chain ID: 11155111)
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0xd34F288Fa68b657926989EF286477E9f3C87A825)
- **Verified**: ✅ Yes
- **Deployment Date**: 2024
- **Status**: 🟢 Active

**External Marketplace**:
- **Address**: `0x2AE08980761CB189DA6ca1f89fffD0C6DAD65a8F`
- **Frontend**: [modular-marketplace.vercel.app/marketplace](https://modular-marketplace.vercel.app/marketplace)

### Local Development (Anvil)

**Address**: `0xd34F288Fa68b657926989EF286477E9f3C87A825`
**Network**: Anvil local blockchain (Chain ID: 31337)
**RPC**: `http://localhost:8545`

### Mainnet

**Status**: 🔴 Not deployed yet

## ⚠️ Deprecated Addresses

**Old Sepolia Address** (DO NOT USE):
- `0x72Bd342Ec921BFcfDaeb429403cc1F0Da43fD312`
- **Status**: Deprecated
- **Reason**: Redeployed with updated configuration

## Frontend Configuration

```typescript
// nft-frontend/lib/contracts/ModularNFT.ts
export const CONTRACT_ADDRESSES = {
  31337: '0xd34F288Fa68b657926989EF286477E9f3C87A825',     // Anvil
  11155111: '0xd34F288Fa68b657926989EF286477E9f3C87A825',  // Sepolia ✅
  1: '0x',  // Mainnet (not deployed)
}
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA=0xd34F288Fa68b657926989EF286477E9f3C87A825
NEXT_PUBLIC_CONTRACT_ADDRESS_ANVIL=0xd34F288Fa68b657926989EF286477E9f3C87A825
```

## Verification

Verify deployment:
```bash
cast call 0xd34F288Fa68b657926989EF286477E9f3C87A825 "name()" --rpc-url $SEPOLIA_RPC_URL
# Returns: "Modular NFT Collection - Sepolia"
```
