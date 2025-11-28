# Smart Contract API Reference

> Complete function reference for ModularNFT.sol

**Contract**: `ModularNFT`
**Address (Sepolia)**: `0xd34F288Fa68b657926989EF286477E9f3C87A825`
**Standards**: ERC-721, ERC-721Enumerable, ERC-721URIStorage, EIP-2981

## Overview

ModularNFT is a production-ready NFT smart contract with:
- ✅ ERC-721 standard NFT functionality
- ✅ EIP-2981 royalty system (5% default)
- ✅ Owner and public minting
- ✅ Batch minting for gas efficiency
- ✅ Configurable collection parameters
- ✅ Secure financial management

## State Variables

```solidity
uint256 public maxSupply;          // Maximum collection size (100)
uint256 public mintPrice;          // Public mint price (0.01 ETH on Sepolia)
bool public mintingActive;         // Public minting toggle
```

## Minting Functions

### ownerMint

Mint a single NFT for free (owner only).

```solidity
function ownerMint(address to, string memory tokenURI)
    external onlyOwner
    returns (uint256)
```

**Parameters**:
- `to`: Recipient address
- `tokenURI`: IPFS metadata URI (e.g., `ipfs://bafkrei...`)

**Returns**: `tokenId` (sequential, starts at 1)

**Events**: `TokenMinted(tokenId, to, tokenURI)`

**Example**:
```typescript
await contract.ownerMint(
  "0x123...",
  "ipfs://bafkreicrfmlctens5kccm5fmggkc6qhnahhv6anxpqn7b7e6lkrl37uq74"
)
```

**Gas**: ~140,000

---

### ownerMintBatch

Mint multiple NFTs with custom royalties (owner only).

```solidity
function ownerMintBatch(MintParams[] memory params)
    external onlyOwner
    returns (uint256[] memory)

struct MintParams {
    address to;
    string tokenURI;
    address royaltyRecipient;
    uint96 royaltyPercentage;  // Basis points (500 = 5%)
}
```

**Parameters**:
- `params`: Array of minting parameters

**Returns**: Array of `tokenIds`

**Events**: `BatchMinted(to, tokenIds[])`

**Example**:
```typescript
await contract.ownerMintBatch([
  {
    to: "0x123...",
    tokenURI: "ipfs://QmHash1...",
    royaltyRecipient: "0xCreator...",
    royaltyPercentage: 500  // 5%
  },
  {
    to: "0x456...",
    tokenURI: "ipfs://QmHash2...",
    royaltyRecipient: "0xCreator...",
    royaltyPercentage: 1000  // 10%
  }
])
```

**Gas**: ~450,000 for 5 NFTs (60% savings vs individual mints)

---

### publicMint

Mint NFT with payment (public).

```solidity
function publicMint(string memory tokenURI)
    external payable nonReentrant
    returns (uint256)
```

**Requirements**:
- `mintingActive` must be `true`
- `msg.value` must equal `mintPrice`
- `totalSupply < maxSupply`

**Parameters**:
- `tokenURI`: IPFS metadata URI

**Returns**: `tokenId`

**Events**: `TokenMinted(tokenId, msg.sender, tokenURI)`

**Example**:
```typescript
await contract.publicMint("ipfs://QmHash...", {
  value: ethers.parseEther("0.01")
})
```

**Gas**: ~140,000 + mint price

---

## Configuration Functions (Owner Only)

### setMintPrice

```solidity
function setMintPrice(uint256 newPrice) external onlyOwner
```

**Example**: `setMintPrice(parseEther("0.05"))`
**Gas**: ~45,000

---

### setMintingActive

```solidity
function setMintingActive(bool active) external onlyOwner
```

**Example**: `setMintingActive(true)`
**Gas**: ~45,000

---

### setMaxSupply

```solidity
function setMaxSupply(uint256 newMaxSupply) external onlyOwner
```

**Note**: Can only reduce supply (cannot increase)
**Example**: `setMaxSupply(50)`
**Gas**: ~45,000

---

### setBaseURI

```solidity
function setBaseURI(string memory newBaseURI) external onlyOwner
```

**Example**: `setBaseURI("https://gateway.pinata.cloud/ipfs/")`
**Gas**: ~50,000

---

## Royalty Functions (Owner Only)

### setDefaultRoyalty

```solidity
function setDefaultRoyalty(address recipient, uint96 feeNumerator)
    external onlyOwner
```

**Parameters**:
- `recipient`: Royalty recipient address
- `feeNumerator`: Basis points (500 = 5%, max 1000 = 10%)

**Example**: `setDefaultRoyalty("0xCreator...", 500)`
**Gas**: ~47,000

---

### setTokenRoyalty

```solidity
function setTokenRoyalty(
    uint256 tokenId,
    address recipient,
    uint96 feeNumerator
) external onlyOwner
```

**Example**: `setTokenRoyalty(1, "0xArtist...", 750)` // 7.5%
**Gas**: ~48,000

---

### getDefaultRoyalty

```solidity
function getDefaultRoyalty()
    external view
    returns (address recipient, uint96 percentage)
```

**Returns**: Default royalty settings
**Gas**: Free (view function)

---

### royaltyInfo (EIP-2981)

```solidity
function royaltyInfo(uint256 tokenId, uint256 salePrice)
    external view
    returns (address receiver, uint256 royaltyAmount)
```

**Example**:
```typescript
const [receiver, amount] = await contract.royaltyInfo(1, parseEther("1"))
// Returns: ["0xCreator...", parseEther("0.05")] // 5% of 1 ETH
```

**Gas**: Free (view function)

---

## Financial Functions (Owner Only)

### withdraw

```solidity
function withdraw() external onlyOwner nonReentrant
```

Withdraw entire contract balance to owner.

**Events**: `Withdrawal(owner, amount)`
**Gas**: ~35,000

---

### emergencyWithdraw

```solidity
function emergencyWithdraw(address payable to)
    external onlyOwner
```

Emergency withdrawal to specific address.

**Events**: `EmergencyWithdrawal(to, amount)`
**Gas**: ~38,000

---

## View Functions

### getCollectionInfo

```solidity
function getCollectionInfo()
    external view
    returns (CollectionInfo memory)

struct CollectionInfo {
    string name;
    string symbol;
    uint256 totalSupply;
    uint256 maxSupply;
    uint256 mintPrice;
    bool mintingActive;
    address owner;
    string baseURI;
}
```

**Returns**: All collection parameters in one call
**Gas**: Free

**Example**:
```typescript
const info = await contract.getCollectionInfo()
console.log(info.totalSupply)  // 10
console.log(info.maxSupply)    // 100
```

---

### getTokenInfo

```solidity
function getTokenInfo(uint256 tokenId)
    external view
    returns (TokenInfo memory)

struct TokenInfo {
    uint256 tokenId;
    address owner;
    string tokenURI;
    address royaltyRecipient;
    uint96 royaltyPercentage;
}
```

**Returns**: Complete token information
**Gas**: Free

---

### tokensOfOwner

```solidity
function tokensOfOwner(address owner)
    external view
    returns (uint256[] memory)
```

**Returns**: Array of token IDs owned by address
**Gas**: Free

**Example**:
```typescript
const tokens = await contract.tokensOfOwner("0x123...")
// Returns: [1, 5, 10]
```

---

### exists

```solidity
function exists(uint256 tokenId)
    external view
    returns (bool)
```

**Returns**: `true` if token exists
**Gas**: Free

---

## Standard ERC-721 Functions

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256)
```

---

### ownerOf

```solidity
function ownerOf(uint256 tokenId) external view returns (address)
```

---

### tokenURI

```solidity
function tokenURI(uint256 tokenId)
    external view
    returns (string memory)
```

Returns full IPFS URI (e.g., `ipfs://bafkrei...`)

---

### approve

```solidity
function approve(address to, uint256 tokenId) external
```

---

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external
```

**Example** (Marketplace integration):
```typescript
await contract.setApprovalForAll(
  "0x2AE08980761CB189DA6ca1f89fffD0C6DAD65a8F",  // Marketplace
  true
)
```

---

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) external
```

---

### safeTransferFrom

```solidity
function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId
) external
```

---

## Events

```solidity
event TokenMinted(uint256 indexed tokenId, address indexed to, string tokenURI);
event BatchMinted(address indexed to, uint256[] tokenIds);
event MintPriceUpdated(uint256 newPrice);
event MintingToggled(bool active);
event MaxSupplyUpdated(uint256 newMaxSupply);
event DefaultRoyaltySet(address indexed recipient, uint96 feeNumerator);
event RoyaltySet(uint256 indexed tokenId, address indexed recipient, uint96 feeNumerator);
event Withdrawal(address indexed to, uint256 amount);
event EmergencyWithdrawal(address indexed to, uint256 amount);
```

## Custom Errors

```solidity
error InvalidAddress();
error TokenNotFound(uint256 tokenId);
error Unauthorized();
error InvalidInput(string parameter);
error MintingNotActive();
error MaxSupplyReached();
error IncorrectPayment(uint256 sent, uint256 required);
error InvalidTokenURI(string uri);
error RoyaltyTooHigh(uint96 percentage);
error InvalidRoyaltyRecipient();
error CannotIncreaseSupply(uint256 current, uint256 requested);
error InvalidSupplyReduction(uint256 totalSupply, uint256 newMaxSupply);
```

## Gas Costs Summary

| Function | Estimated Gas | Notes |
|----------|---------------|-------|
| `ownerMint` | ~140k | Single mint |
| `ownerMintBatch` (5 NFTs) | ~450k | 60% savings |
| `publicMint` | ~140k | + mint price |
| `setMintPrice` | ~45k | Config update |
| `setMintingActive` | ~45k | Toggle minting |
| `setDefaultRoyalty` | ~47k | Set royalty |
| `withdraw` | ~35k | Withdraw funds |
| All view functions | Free | No gas cost |

## Security Notes

- ✅ **ReentrancyGuard** on `publicMint` and `withdraw`
- ✅ **Ownable** for admin functions
- ✅ **Input validation** with custom errors
- ✅ **Supply constraints** (cannot increase maxSupply)
- ✅ **Royalty caps** (maximum 10%)

## Frontend Integration

**wagmi v2 Example**:
```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

const { writeContract, data: hash } = useWriteContract()
const { isSuccess } = useWaitForTransactionReceipt({ hash })

// Mint NFT
writeContract({
  address: '0xd34F288Fa68b657926989EF286477E9f3C87A825',
  abi: MODULAR_NFT_ABI,
  functionName: 'ownerMint',
  args: [recipientAddress, tokenURI]
})
```

## Related Documentation

- [System Overview](../architecture/SYSTEM_OVERVIEW.md)
- [Deployment Guide](../deployment/DEPLOYMENT_GUIDE.md)
- [Contract Addresses](../deployment/CONTRACT_ADDRESSES.md)

---

**Contract Source**: [src/Modular-NFT.sol](../../src/Modular-NFT.sol)
**Verified on Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0xd34F288Fa68b657926989EF286477E9f3C87A825)
