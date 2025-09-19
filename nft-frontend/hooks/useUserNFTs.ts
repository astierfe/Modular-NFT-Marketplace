// ./nft-frontend/hooks/useUserNFTs.ts - Hook pour NFTs utilisateur
'use client'

import { useReadContract, useChainId } from 'wagmi'
import { type Address } from 'viem'
import { useCallback, useMemo } from 'react'
import { MODULAR_NFT_ABI, getContractAddress } from '@/lib/contracts/ModularNFT'
import { type TokenInfo } from '../lib/types/contractTypes'

export function useUserNFTs(address?: Address) {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)

  // Balance de l'utilisateur
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 15000,
    }
  })

  // Liste des token IDs possédés
  const { data: tokenIds, isLoading: isLoadingTokens, refetch: refetchTokens } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 15000,
    }
  })

  // Informations détaillées des tokens (batch)
  const { data: tokensInfo, isLoading: isLoadingInfo, refetch: refetchTokensInfo } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'getTokensBatch',
    args: tokenIds ? [tokenIds] : undefined,
    query: {
      enabled: !!tokenIds && tokenIds.length > 0,
      refetchInterval: 20000,
    }
  })

  const userNFTs = useMemo((): TokenInfo[] => {
    if (!tokensInfo) return []
    
    return tokensInfo.map((token) => ({
      tokenId: Number(token.tokenId),
      owner: token.owner,
      tokenURI: token.tokenURI,
      royaltyRecipient: token.royaltyRecipient,
      royaltyPercentage: Number(token.royaltyPercentage) / 100,
    }))
  }, [tokensInfo])

  const refetchAll = useCallback(async () => {
    console.log('useUserNFTs: Refetching user NFT data...')
    const promises = [refetchBalance(), refetchTokens(), refetchTokensInfo()]
    try {
      await Promise.all(promises)
      console.log('useUserNFTs: All refetches completed')
    } catch (error) {
      console.error('useUserNFTs: Refetch failed', error)
      throw error
    }
  }, [refetchBalance, refetchTokens, refetchTokensInfo])

  return {
    balance: balance ? Number(balance) : 0,
    tokenIds,
    userNFTs,
    isLoading: isLoadingTokens || isLoadingInfo,
    refetch: refetchAll
  }
}

// Hook pour un token spécifique
export function useTokenInfo(tokenId?: number) {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)

  const { data, isLoading, isError, refetch } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'getTokenInfo',
    args: tokenId !== undefined ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: tokenId !== undefined,
      refetchInterval: 30000,
    }
  })

  const tokenInfo = useMemo((): TokenInfo | null => {
    if (!data) return null
    
    return {
      tokenId: Number(data.tokenId),
      owner: data.owner,
      tokenURI: data.tokenURI,
      royaltyRecipient: data.royaltyRecipient,
      royaltyPercentage: Number(data.royaltyPercentage) / 100,
    }
  }, [data])

  const enhancedRefetch = useCallback(async () => {
    console.log(`useTokenInfo: Refetching token ${tokenId} data...`)
    return await refetch()
  }, [refetch, tokenId])

  return {
    tokenInfo,
    isLoading,
    isError,
    refetch: enhancedRefetch
  }
}