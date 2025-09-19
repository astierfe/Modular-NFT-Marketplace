// ./nft-frontend/hooks/useAdminInterface.ts - Hook pour logique interface admin
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAdminFunctions, useCollectionInfo } from '@/hooks'

export interface AdminFormState {
  // Configuration
  newMintPrice: string
  newMaxSupply: string
  
  // Royalties
  newRoyaltyPercentage: string
  newRoyaltyRecipient: string
}

export interface AdminActions {
  // Form setters
  setNewMintPrice: (price: string) => void
  setNewMaxSupply: (supply: string) => void
  setNewRoyaltyPercentage: (percentage: string) => void
  setNewRoyaltyRecipient: (recipient: string) => void
  
  // Configuration actions
  handleToggleMinting: () => void
  handleUpdatePrice: () => void
  handleUpdateMaxSupply: () => void
  handleUpdateRoyalty: () => void
  handleWithdraw: () => void
  
  // Reset actions
  resetConfigForm: () => void
  resetRoyaltyForm: () => void
}

export interface AdminStatus {
  // Transaction states
  isProcessing: boolean
  isConfirming: boolean
  isSuccess: boolean
  error: string | null
  
  // Capabilities
  canToggleMinting: boolean
  canUpdateConfig: boolean
  canManageRoyalties: boolean
  canWithdraw: boolean
}

export function useAdminInterface() {
  const { address } = useAccount()
  const { collectionInfo } = useCollectionInfo()
  
  // Form states
  const [formState, setFormState] = useState<AdminFormState>({
    newMintPrice: '',
    newMaxSupply: '',
    newRoyaltyPercentage: '',
    newRoyaltyRecipient: '',
  })

  // Admin functions hook
  const { 
    setMintingActive, 
    setMintPrice, 
    setMaxSupply, 
    setDefaultRoyalty,
    withdraw,
    isPending, 
    isConfirming, 
    isConfirmed,
    error 
  } = useAdminFunctions()

  // Auto-reset forms after successful transactions
  useEffect(() => {
    if (isConfirmed) {
      setFormState({
        newMintPrice: '',
        newMaxSupply: '',
        newRoyaltyPercentage: '',
        newRoyaltyRecipient: '',
      })
    }
  }, [isConfirmed])

  // Actions
  const actions: AdminActions = {
    // Form setters
    setNewMintPrice: useCallback((newMintPrice: string) => {
      setFormState(prev => ({ ...prev, newMintPrice }))
    }, []),

    setNewMaxSupply: useCallback((newMaxSupply: string) => {
      setFormState(prev => ({ ...prev, newMaxSupply }))
    }, []),

    setNewRoyaltyPercentage: useCallback((newRoyaltyPercentage: string) => {
      setFormState(prev => ({ ...prev, newRoyaltyPercentage }))
    }, []),

    setNewRoyaltyRecipient: useCallback((newRoyaltyRecipient: string) => {
      setFormState(prev => ({ ...prev, newRoyaltyRecipient }))
    }, []),

    // Configuration actions
    handleToggleMinting: useCallback(() => {
      if (collectionInfo) {
        setMintingActive(!collectionInfo.mintingActive)
      }
    }, [collectionInfo, setMintingActive]),

    handleUpdatePrice: useCallback(() => {
      if (formState.newMintPrice) {
        setMintPrice(formState.newMintPrice)
      }
    }, [formState.newMintPrice, setMintPrice]),

    handleUpdateMaxSupply: useCallback(() => {
      if (formState.newMaxSupply) {
        const newSupply = parseInt(formState.newMaxSupply)
        if (!isNaN(newSupply)) {
          setMaxSupply(newSupply)
        }
      }
    }, [formState.newMaxSupply, setMaxSupply]),

    handleUpdateRoyalty: useCallback(() => {
      if (formState.newRoyaltyRecipient && formState.newRoyaltyPercentage && address) {
        const percentage = parseFloat(formState.newRoyaltyPercentage)
        if (!isNaN(percentage)) {
          setDefaultRoyalty(
            formState.newRoyaltyRecipient as `0x${string}`, 
            percentage
          )
        }
      }
    }, [formState.newRoyaltyRecipient, formState.newRoyaltyPercentage, address, setDefaultRoyalty]),

    handleWithdraw: useCallback(() => {
      withdraw()
    }, [withdraw]),

    // Reset actions
    resetConfigForm: useCallback(() => {
      setFormState(prev => ({ 
        ...prev, 
        newMintPrice: '', 
        newMaxSupply: '' 
      }))
    }, []),

    resetRoyaltyForm: useCallback(() => {
      setFormState(prev => ({ 
        ...prev, 
        newRoyaltyPercentage: '', 
        newRoyaltyRecipient: '' 
      }))
    }, []),
  }

  // Status computation
  const status: AdminStatus = {
    // Transaction states
    isProcessing: isPending,
    isConfirming: isConfirming,
    isSuccess: isConfirmed,
    error: error?.message || null,
    
    // Capabilities
    canToggleMinting: !!collectionInfo,
    canUpdateConfig: !!collectionInfo,
    canManageRoyalties: !!address,
    canWithdraw: !!address,
  }

  // Validation helpers
  const validation = {
    canUpdatePrice: formState.newMintPrice !== '' && !isPending,
    canUpdateMaxSupply: formState.newMaxSupply !== '' && !isPending,
    canUpdateRoyalty: formState.newRoyaltyRecipient !== '' && 
                      formState.newRoyaltyPercentage !== '' && 
                      !isPending,
  }

  return {
    // State
    formState,
    status,
    collectionInfo,
    validation,
    
    // Actions
    ...actions,
  }
}