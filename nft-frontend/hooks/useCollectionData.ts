// ./nft-frontend/hooks/useCollectionData.ts - Hook pour données collection
'use client'

import { useReadContract, useChainId } from 'wagmi'
import { formatEther, type Address } from 'viem'
import { useCallback, useMemo } from 'react'
import { MODULAR_NFT_ABI, getContractAddress } from '@/lib/contracts/ModularNFT'
import { type CollectionInfo, type CollectionStats } from '../lib/types/contractTypes'

// Hook principal pour les informations de collection
export function useCollectionInfo() {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)

  const { data, isError, isLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'getCollectionInfo',
    query: {
      refetchInterval: 10000, // 10 secondes
      staleTime: 5000,
    }
  })

  const collectionInfo = useMemo((): CollectionInfo | null => {
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

  const enhancedRefetch = useCallback(async () => {
    console.log('useCollectionInfo: Refetching collection data...')
    try {
      const result = await refetch()
      console.log('useCollectionInfo: Refetch completed')
      return result
    } catch (error) {
      console.error('useCollectionInfo: Refetch failed', error)
      throw error
    }
  }, [refetch])

  return {
    collectionInfo,
    isLoading,
    isError,
    refetch: enhancedRefetch
  }
}

// Hook pour les statistiques dérivées
export function useCollectionStats() {
  const { collectionInfo, refetch } = useCollectionInfo()
  
  const stats = useMemo((): CollectionStats | null => {
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

  return {
    ...stats,
    refetch,
  }
}

// Hook pour surveillance du total supply
export function useTotalSupplyWatcher() {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)

  const { data: totalSupply, refetch } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'totalSupply',
    query: {
      refetchInterval: 5000,
      staleTime: 1000,
    }
  })

  return {
    totalSupply: totalSupply ? Number(totalSupply) : 0,
    refetch,
  }
}

// Hook pour vérifier propriété
export function useIsOwner() {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)

  const { data: contractOwner, refetch } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'owner',
    query: {
      refetchInterval: 60000, // 1 minute
    }
  })

  return {
    isOwner: (address: Address) => address && contractOwner ? 
      address.toLowerCase() === contractOwner.toLowerCase() : false,
    contractOwner,
    refetch,
  }
}