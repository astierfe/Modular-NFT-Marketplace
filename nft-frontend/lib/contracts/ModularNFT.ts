// ./nft-frontend/lib/contracts/ModularNFT.ts
export const MODULAR_NFT_ABI = [
  // ERC721 Standard Functions
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "from", "type": "address"},
      {"name": "to", "type": "address"},
      {"name": "tokenId", "type": "uint256"}
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "tokenId", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "getApproved",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "operator", "type": "address"},
      {"name": "approved", "type": "bool"}
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "operator", "type": "address"}
    ],
    "name": "isApprovedForAll",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },

  // ERC721 Metadata
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },

  // ERC721 Enumerable
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "index", "type": "uint256"}],
    "name": "tokenByIndex",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "index", "type": "uint256"}
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Custom View Functions
  {
    "inputs": [],
    "name": "maxSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintPrice",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintingActive",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "baseURI",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "exists",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "tokensOfOwner",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCollectionInfo",
    "outputs": [{
      "components": [
        {"name": "name", "type": "string"},
        {"name": "symbol", "type": "string"},
        {"name": "totalSupply", "type": "uint256"},
        {"name": "maxSupply", "type": "uint256"},
        {"name": "mintPrice", "type": "uint256"},
        {"name": "mintingActive", "type": "bool"},
        {"name": "baseURI", "type": "string"}
      ],
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "getTokenInfo",
    "outputs": [{
      "components": [
        {"name": "tokenId", "type": "uint256"},
        {"name": "owner", "type": "address"},
        {"name": "tokenURI", "type": "string"},
        {"name": "royaltyRecipient", "type": "address"},
        {"name": "royaltyPercentage", "type": "uint96"}
      ],
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenIds", "type": "uint256[]"}],
    "name": "getTokensBatch",
    "outputs": [{
      "components": [
        {"name": "tokenId", "type": "uint256"},
        {"name": "owner", "type": "address"},
        {"name": "tokenURI", "type": "string"},
        {"name": "royaltyRecipient", "type": "address"},
        {"name": "royaltyPercentage", "type": "uint96"}
      ],
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  },

  // EIP-2981 Royalties
  {
    "inputs": [
      {"name": "tokenId", "type": "uint256"},
      {"name": "salePrice", "type": "uint256"}
    ],
    "name": "royaltyInfo",
    "outputs": [
      {"name": "receiver", "type": "address"},
      {"name": "royaltyAmount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [],
    "name": "getDefaultRoyalty", 
    "outputs": [
      {"name": "recipient", "type": "address"},
      {"name": "percentage", "type": "uint96"}
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Minting Functions
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "tokenURI", "type": "string"}
    ],
    "name": "ownerMint",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "components": [
        {"name": "to", "type": "address"},
        {"name": "tokenURI", "type": "string"},
        {"name": "royaltyRecipient", "type": "address"},
        {"name": "royaltyPercentage", "type": "uint96"}
      ],
      "name": "params",
      "type": "tuple[]"
    }],
    "name": "ownerMintBatch",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenURI", "type": "string"}],
    "name": "publicMint",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },

  // Admin Functions
  {
    "inputs": [{"name": "newBaseURI", "type": "string"}],
    "name": "setBaseURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "newPrice", "type": "uint256"}],
    "name": "setMintPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "active", "type": "bool"}],
    "name": "setMintingActive",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "newMaxSupply", "type": "uint256"}],
    "name": "setMaxSupply",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "recipient", "type": "address"},
      {"name": "feeNumerator", "type": "uint96"}
    ],
    "name": "setDefaultRoyalty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "tokenId", "type": "uint256"},
      {"name": "recipient", "type": "address"},
      {"name": "feeNumerator", "type": "uint96"}
    ],
    "name": "setTokenRoyalty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "to", "type": "address"}],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Ownable
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "from", "type": "address"},
      {"indexed": true, "name": "to", "type": "address"},
      {"indexed": true, "name": "tokenId", "type": "uint256"}
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "owner", "type": "address"},
      {"indexed": true, "name": "approved", "type": "address"},
      {"indexed": true, "name": "tokenId", "type": "uint256"}
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "owner", "type": "address"},
      {"indexed": true, "name": "operator", "type": "address"},
      {"indexed": false, "name": "approved", "type": "bool"}
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "tokenId", "type": "uint256"},
      {"indexed": true, "name": "to", "type": "address"},
      {"indexed": false, "name": "tokenURI", "type": "string"}
    ],
    "name": "TokenMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "to", "type": "address"},
      {"indexed": false, "name": "tokenIds", "type": "uint256[]"}
    ],
    "name": "BatchMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "name": "newPrice", "type": "uint256"}
    ],
    "name": "MintPriceUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "name": "active", "type": "bool"}
    ],
    "name": "MintingToggled",
    "type": "event"
  }
] as const

// Contract addresses by network
export const CONTRACT_ADDRESSES = {
  // Local Anvil
  31337: '0xd34F288Fa68b657926989EF286477E9f3C87A825' as `0x${string}`, // Compte Anvil de test #0
  
  // Sepolia Testnet
  11155111: '0x72Bd342Ec921BFcfDaeb429403cc1F0Da43fD312' as `0x${string}`, // À remplir après déploiement
  
  // Ethereum Mainnet
  1: '0x' as `0x${string}`, // À remplir après déploiement
} as const

// Helper function to get contract address
export function getContractAddress(chainId: keyof typeof CONTRACT_ADDRESSES): `0x${string}` {
  const address = CONTRACT_ADDRESSES[chainId]
  if (!address || address === '0x') {
    throw new Error(`Contract address not configured for chain ${chainId}`)
  }
  return address
}

// TypeScript types for contract
export interface CollectionInfo {
  name: string
  symbol: string
  totalSupply: bigint
  maxSupply: bigint
  mintPrice: bigint
  mintingActive: boolean
  baseURI: string
}

export interface TokenInfo {
  tokenId: bigint
  owner: `0x${string}`
  tokenURI: string
  royaltyRecipient: `0x${string}`
  royaltyPercentage: bigint
}

export interface MintParams {
  to: `0x${string}`
  tokenURI: string
  royaltyRecipient: `0x${string}`
  royaltyPercentage: bigint
}