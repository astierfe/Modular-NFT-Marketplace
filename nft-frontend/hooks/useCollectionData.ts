'use client'

import { useReadContract, useChainId } from 'wagmi'
import { formatEther, type Address } from 'viem'
import { useCallback, useMemo } from 'react'
import { MODULAR_NFT_ABI, getContractAddress } from '@/lib/contracts/ModularNFT'
import { type CollectionInfo, type CollectionStats } from '../lib/types/contractTypes'

export function useCollectionInfo() {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)

  const { data, isError, isLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'getCollectionInfo',
    query: {
      refetchInterval: 10000,
      staleTime: 5000,
    }
  })

  const { data: defaultRoyalty, refetch: refetchRoyalty } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'getDefaultRoyalty',
    query: {
      refetchInterval: 15000,
      staleTime: 10000,
    }
  })

  const collectionInfo = useMemo((): (CollectionInfo & { defaultRoyalty?: { recipient: string; percentage: number } }) | null => {
    if (!data) return null
    
    const baseInfo: CollectionInfo = {
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

    if (defaultRoyalty) {
      return {
        ...baseInfo,
        defaultRoyalty: {
          recipient: defaultRoyalty[0],
          percentage: Number(defaultRoyalty[1]) / 100
        }
      }
    }

    return baseInfo
  }, [data, defaultRoyalty])

  const enhancedRefetch = useCallback(async () => {
    console.log('useCollectionInfo: Refetching collection data...')
    try {
      const results = await Promise.all([refetch(), refetchRoyalty()])
      console.log('useCollectionInfo: Refetch completed')
      return results
    } catch (error) {
      console.error('useCollectionInfo: Refetch failed', error)
      throw error
    }
  }, [refetch, refetchRoyalty])

  return {
    collectionInfo,
    isLoading,
    isError,
    refetch: enhancedRefetch
  }
}

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

export function useIsOwner() {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)

  const { data: contractOwner, refetch } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'owner',
    query: {
      refetchInterval: 60000,
    }
  })

  return {
    isOwner: (address: Address) => address && contractOwner ? 
      address.toLowerCase() === contractOwner.toLowerCase() : false,
    contractOwner,
    refetch,
  }
}