# Modular NFT Marketplace

## Phase 1: NFT Smart Contract Infrastructure

Complete ERC721 smart contract implementation with:
- ERC721 + Enumerable + URIStorage
- EIP-2981 Royalties support
- Owner and public minting
- Dynamic configuration
- Comprehensive test suite
- Multi-environment deployment

## Stack

- **Framework**: Foundry
- **Solidity**: 0.8.20
- **Libraries**: OpenZeppelin 4.9.3

## Quick Start

```bash
# Setup environment
./scripts/setup.sh

# Run tests
forge test -vv

# Deploy locally
anvil
forge script script/Deploy.s.sol:Deploy --rpc-url http://localhost:8545 --broadcast
```

## Project Structure

- `src/` - Smart contracts
- `test/` - Test files
- `script/` - Deployment scripts
- `deployments/` - Deployment artifacts

## Next Phases

- Phase 2: IPFS metadata strategy
- Phase 3: Marketplace smart contracts
- Phase 4: Frontend dApp
