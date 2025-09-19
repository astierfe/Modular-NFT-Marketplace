// ./nft-frontend/hooks/useMinting.ts - Hook pour minting (public + owner) - CORRIGÉ
'use client'

import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { parseEther, type Address } from 'viem'
import { useCallback, useEffect } from 'react'
import { MODULAR_NFT_ABI, getContractAddress } from '@/lib/contracts/ModularNFT'
import { type MintParams, contractUtils } from '../lib/types/contractTypes'

// Hook pour minting public - TYPES CORRIGÉS
export function usePublicMint() {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)
  
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  })

  const mint = useCallback((tokenURI: string, mintPrice: string) => {
    console.log('usePublicMint: Initiating public mint...', { tokenURI, mintPrice })
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'publicMint',
      args: [tokenURI],
      value: parseEther(mintPrice),
    })
  }, [contractAddress, writeContract])

  // Auto-trigger global refresh après succès
  useEffect(() => {
    if (isConfirmed) {
      console.log('usePublicMint: Transaction confirmed, triggering global refresh...')
      if (typeof window !== 'undefined' && (window as any).refreshNFTGrid) {
        setTimeout(() => {
          (window as any).refreshNFTGrid()
        }, 2000)
      }
    }
  }, [isConfirmed])

  return {
    mint,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: error || confirmError,
  }
}

// Hook pour minting owner - TYPES CORRIGÉS
export function useOwnerMint() {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)
  
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  })

  const mint = useCallback((to: Address, tokenURI: string) => {
    console.log('useOwnerMint: Initiating owner mint...', { to, tokenURI })
    
    // ✅ VALIDATION DU TYPE ADDRESS
    const validatedTo = contractUtils.validateAddress(to)
    
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'ownerMint',
      args: [validatedTo, tokenURI],
    })
  }, [contractAddress, writeContract])

  const mintBatch = useCallback((params: MintParams[]) => {
    console.log('useOwnerMint: Initiating batch mint...', { count: params.length })
    
    // ✅ VALIDATION DES TYPES - params déjà au bon format MintParams
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'ownerMintBatch',
      args: [params as any], // ← Types corrects maintenant
    })
  }, [contractAddress, writeContract])

  // Fonction helper pour créer des params batch facilement
  const createBatchParams = useCallback((
    items: Array<{
      to: string
      tokenURI: string
      royaltyRecipient?: string
      royaltyPercentage?: number
    }>
  ): MintParams[] => {
    return items.map(item => contractUtils.createMintParams(
      item.to,
      item.tokenURI,
      item.royaltyRecipient,
      item.royaltyPercentage
    ))
  }, [])

  // Auto-trigger global refresh après succès
  useEffect(() => {
    if (isConfirmed) {
      console.log('useOwnerMint: Transaction confirmed, triggering global refresh...')
      if (typeof window !== 'undefined' && (window as any).refreshNFTGrid) {
        setTimeout(() => {
          (window as any).refreshNFTGrid()
        }, 2000)
      }
    }
  }, [isConfirmed])

  return {
    mint,
    mintBatch,
    createBatchParams,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: error || confirmError,
  }
}