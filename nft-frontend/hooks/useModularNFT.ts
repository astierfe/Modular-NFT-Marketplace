// hooks/useModularNFT.ts
'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from 'wagmi'
import { parseEther, formatEther, type Address } from 'viem'
import { useCallback, useMemo } from 'react'
import { MODULAR_NFT_ABI, getContractAddress, type CollectionInfo, type TokenInfo, type MintParams } from '@/lib/contracts/ModularNFT'

// Hook pour lire les informations de la collection
export function useCollectionInfo() {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)

  const { data, isError, isLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'getCollectionInfo',
  })

  const collectionInfo = useMemo(() => {
    if (!data) return null
    
    return {
      name: data.name,
      symbol: data.symbol,
      totalSupply: Number(data.totalSupply),
      maxSupply: Number(data.maxSupply),
      mintPrice: formatEther(data.mintPrice),
      mintPriceWei: data.mintPrice,
      mintingActive: data.mintingActive,
      baseURI: data.baseURI,
      progress: Number(data.totalSupply) / Number(data.maxSupply) * 100
    }
  }, [data])

  return {
    collectionInfo,
    isLoading,
    isError,
    refetch
  }
}

// Hook pour lire les NFTs possédés par une adresse
export function useUserNFTs(address?: Address) {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)

  // Balance de l'utilisateur
  const { data: balance } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Liste des token IDs possédés
  const { data: tokenIds, isLoading: isLoadingTokens } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Informations détaillées des tokens (batch)
  const { data: tokensInfo, isLoading: isLoadingInfo } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'getTokensBatch',
    args: tokenIds ? [tokenIds] : undefined,
    query: {
      enabled: !!tokenIds && tokenIds.length > 0,
    }
  })

  const userNFTs = useMemo(() => {
    if (!tokensInfo) return []
    
    return tokensInfo.map((token) => ({
      tokenId: Number(token.tokenId),
      owner: token.owner,
      tokenURI: token.tokenURI,
      royaltyRecipient: token.royaltyRecipient,
      royaltyPercentage: Number(token.royaltyPercentage) / 100, // Convert basis points to percentage
    }))
  }, [tokensInfo])

  return {
    balance: balance ? Number(balance) : 0,
    tokenIds,
    userNFTs,
    isLoading: isLoadingTokens || isLoadingInfo,
  }
}

// Hook pour les informations d'un token spécifique
export function useTokenInfo(tokenId?: number) {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)

  const { data, isLoading, isError } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'getTokenInfo',
    args: tokenId !== undefined ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: tokenId !== undefined,
    }
  })

  const tokenInfo = useMemo(() => {
    if (!data) return null
    
    return {
      tokenId: Number(data.tokenId),
      owner: data.owner,
      tokenURI: data.tokenURI,
      royaltyRecipient: data.royaltyRecipient,
      royaltyPercentage: Number(data.royaltyPercentage) / 100,
    }
  }, [data])

  return {
    tokenInfo,
    isLoading,
    isError,
  }
}

// Hook pour vérifier si l'utilisateur est le owner du contrat
export function useIsOwner() {
  const { address } = useAccount()
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)

  const { data: contractOwner } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'owner',
  })

  return {
    isOwner: address && contractOwner ? address.toLowerCase() === contractOwner.toLowerCase() : false,
    contractOwner,
  }
}

// Hook pour le minting public
export function usePublicMint() {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)
  
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const mint = useCallback((tokenURI: string, mintPrice: string) => {
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'publicMint',
      args: [tokenURI],
      value: parseEther(mintPrice),
    })
  }, [contractAddress, writeContract])

  return {
    mint,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// Hook pour le minting owner
export function useOwnerMint() {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)
  
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const mint = useCallback((to: Address, tokenURI: string) => {
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'ownerMint',
      args: [to, tokenURI],
    })
  }, [contractAddress, writeContract])

  const mintBatch = useCallback((params: MintParams[]) => {
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'ownerMintBatch',
      args: [params],
    })
  }, [contractAddress, writeContract])

  return {
    mint,
    mintBatch,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// Hook pour les fonctions d'administration
export function useAdminFunctions() {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)
  
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const setMintPrice = useCallback((newPrice: string) => {
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'setMintPrice',
      args: [parseEther(newPrice)],
    })
  }, [contractAddress, writeContract])

  const setMintingActive = useCallback((active: boolean) => {
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'setMintingActive',
      args: [active],
    })
  }, [contractAddress, writeContract])

  const setMaxSupply = useCallback((newMaxSupply: number) => {
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'setMaxSupply',
      args: [BigInt(newMaxSupply)],
    })
  }, [contractAddress, writeContract])

  const setBaseURI = useCallback((newBaseURI: string) => {
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'setBaseURI',
      args: [newBaseURI],
    })
  }, [contractAddress, writeContract])

  const setDefaultRoyalty = useCallback((recipient: Address, percentage: number) => {
    // Convert percentage to basis points (5% = 500)
    const basisPoints = Math.floor(percentage * 100)
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'setDefaultRoyalty',
      args: [recipient, basisPoints],
    })
  }, [contractAddress, writeContract])

  const withdraw = useCallback(() => {
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'withdraw',
    })
  }, [contractAddress, writeContract])

  return {
    setMintPrice,
    setMintingActive,
    setMaxSupply,
    setBaseURI,
    setDefaultRoyalty,
    withdraw,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

// Hook pour les statistiques de la collection
export function useCollectionStats() {
  const { collectionInfo } = useCollectionInfo()
  
  return useMemo(() => {
    if (!collectionInfo) return null
    
    const remaining = collectionInfo.maxSupply - collectionInfo.totalSupply
    const soldOut = remaining === 0
    
    return {
      totalSupply: collectionInfo.totalSupply,
      maxSupply: collectionInfo.maxSupply,
      remaining,
      progress: collectionInfo.progress,
      mintPrice: collectionInfo.mintPrice,
      soldOut,
      mintingActive: collectionInfo.mintingActive,
    }
  }, [collectionInfo])
}

// Hook utilitaire pour formater les adresses
export function useFormatAddress(address?: string) {
  return useMemo(() => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [address])
}