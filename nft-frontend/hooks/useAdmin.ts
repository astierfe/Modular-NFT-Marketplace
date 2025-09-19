// ./nft-frontend/hooks/useAdmin.ts - Hook pour fonctions admin - TYPES CORRIGÉS
'use client'

import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { parseEther, type Address } from 'viem'
import { useCallback, useEffect } from 'react'
import { MODULAR_NFT_ABI, getContractAddress } from '@/lib/contracts/ModularNFT'
import { contractUtils } from '../lib/types/contractTypes'

export function useAdminFunctions() {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)
  
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  })

  const setMintPrice = useCallback((newPrice: string) => {
    console.log('useAdminFunctions: Setting mint price...', { newPrice })
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'setMintPrice',
      args: [parseEther(newPrice)],
    })
  }, [contractAddress, writeContract])

  const setMintingActive = useCallback((active: boolean) => {
    console.log('useAdminFunctions: Setting minting active...', { active })
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'setMintingActive',
      args: [active],
    })
  }, [contractAddress, writeContract])

  const setMaxSupply = useCallback((newMaxSupply: number) => {
    console.log('useAdminFunctions: Setting max supply...', { newMaxSupply })
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'setMaxSupply',
      args: [BigInt(newMaxSupply)], // ✅ BIGINT corrigé
    })
  }, [contractAddress, writeContract])

  const setBaseURI = useCallback((newBaseURI: string) => {
    console.log('useAdminFunctions: Setting base URI...', { newBaseURI })
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'setBaseURI',
      args: [newBaseURI],
    })
  }, [contractAddress, writeContract])

  const setDefaultRoyalty = useCallback((recipient: Address, percentage: number) => {
    console.log('useAdminFunctions: Setting default royalty...', { recipient, percentage })
    
    // ✅ CONVERSION CORRIGÉE : number → bigint
    const validatedRecipient = contractUtils.validateAddress(recipient)
    const basisPoints = contractUtils.percentageToBasisPoints(percentage) // ← Retourne bigint
    
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'setDefaultRoyalty',
      args: [validatedRecipient, basisPoints], // ← Types corrects
    })
  }, [contractAddress, writeContract])

  const setTokenRoyalty = useCallback((
    tokenId: number, 
    recipient: Address, 
    percentage: number
  ) => {
    console.log('useAdminFunctions: Setting token royalty...', { tokenId, recipient, percentage })
    
    const validatedRecipient = contractUtils.validateAddress(recipient)
    const basisPoints = contractUtils.percentageToBasisPoints(percentage)
    
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'setTokenRoyalty',
      args: [BigInt(tokenId), validatedRecipient, basisPoints],
    })
  }, [contractAddress, writeContract])

  const withdraw = useCallback(() => {
    console.log('useAdminFunctions: Withdrawing funds...')
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'withdraw',
    })
  }, [contractAddress, writeContract])

  const emergencyWithdraw = useCallback((to: Address) => {
    console.log('useAdminFunctions: Emergency withdraw...', { to })
    
    const validatedTo = contractUtils.validateAddress(to)
    
    writeContract({
      address: contractAddress,
      abi: MODULAR_NFT_ABI,
      functionName: 'emergencyWithdraw',
      args: [validatedTo],
    })
  }, [contractAddress, writeContract])

  // Auto-trigger global refresh après succès admin
  useEffect(() => {
    if (isConfirmed) {
      console.log('useAdminFunctions: Transaction confirmed, triggering global refresh...')
      if (typeof window !== 'undefined' && (window as any).refreshNFTGrid) {
        setTimeout(() => {
          (window as any).refreshNFTGrid()
        }, 1000)
      }
    }
  }, [isConfirmed])

  return {
    // Configuration functions
    setMintPrice,
    setMintingActive,
    setMaxSupply,
    setBaseURI,
    
    // Royalty functions
    setDefaultRoyalty,
    setTokenRoyalty,
    
    // Financial functions
    withdraw,
    emergencyWithdraw,
    
    // Transaction state
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: error || confirmError,
  }
}