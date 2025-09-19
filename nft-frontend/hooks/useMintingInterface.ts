// ./nft-frontend/hooks/useMintingInterface.ts - Hook pour logique interface minting
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { type Address } from 'viem'
import { usePublicMint, useOwnerMint, useCollectionInfo } from '@/hooks'

export interface MintingFormState {
  // Public mint
  publicTokenURI: string
  
  // Owner mint
  ownerRecipient: string
  ownerTokenURI: string
}

export interface MintingActions {
  // Form actions
  setPublicTokenURI: (uri: string) => void
  setOwnerRecipient: (recipient: string) => void
  setOwnerTokenURI: (uri: string) => void
  
  // Mint actions
  handlePublicMint: () => void
  handleOwnerMint: () => void
  
  // Reset actions
  resetPublicForm: () => void
  resetOwnerForm: () => void
}

export interface MintingStatus {
  // States
  canPublicMint: boolean
  canOwnerMint: boolean
  
  // Public mint status
  publicMinting: boolean
  publicMintSuccess: boolean
  publicMintError: string | null
  
  // Owner mint status
  ownerMinting: boolean
  ownerMintSuccess: boolean
  ownerMintError: string | null
}

export function useMintingInterface(isOwner: boolean) {
  const { address } = useAccount()
  const { collectionInfo } = useCollectionInfo()
  
  // Form states
  const [formState, setFormState] = useState<MintingFormState>({
    publicTokenURI: '',
    ownerRecipient: address || '',
    ownerTokenURI: '',
  })

  // Hooks de minting
  const { 
    mint: publicMint, 
    isPending: isPublicMintPending, 
    isConfirming: isPublicMintConfirming,
    isConfirmed: isPublicMintConfirmed,
    error: publicMintError 
  } = usePublicMint()
  
  const { 
    mint: ownerMint, 
    isPending: isOwnerMintPending,
    isConfirming: isOwnerMintConfirming, 
    isConfirmed: isOwnerMintConfirmed,
    error: ownerMintError 
  } = useOwnerMint()

  // Auto-update recipient when address changes
  useEffect(() => {
    if (address && !formState.ownerRecipient) {
      setFormState(prev => ({ ...prev, ownerRecipient: address }))
    }
  }, [address, formState.ownerRecipient])

  // Auto-reset after successful mint
  useEffect(() => {
    if (isPublicMintConfirmed) {
      setFormState(prev => ({ ...prev, publicTokenURI: '' }))
    }
  }, [isPublicMintConfirmed])

  useEffect(() => {
    if (isOwnerMintConfirmed) {
      setFormState(prev => ({ 
        ...prev, 
        ownerRecipient: address || '', 
        ownerTokenURI: '' 
      }))
    }
  }, [isOwnerMintConfirmed, address])

  // Actions
  const actions: MintingActions = {
    // Form setters
    setPublicTokenURI: useCallback((publicTokenURI: string) => {
      setFormState(prev => ({ ...prev, publicTokenURI }))
    }, []),

    setOwnerRecipient: useCallback((ownerRecipient: string) => {
      setFormState(prev => ({ ...prev, ownerRecipient }))
    }, []),

    setOwnerTokenURI: useCallback((ownerTokenURI: string) => {
      setFormState(prev => ({ ...prev, ownerTokenURI }))
    }, []),

    // Mint handlers
    handlePublicMint: useCallback(() => {
      if (!formState.publicTokenURI) {
        alert('Please enter a token URI')
        return
      }
      if (!collectionInfo?.mintPrice) {
        alert('Mint price not available')
        return
      }
      publicMint(formState.publicTokenURI, collectionInfo.mintPrice)
    }, [formState.publicTokenURI, collectionInfo?.mintPrice, publicMint]),

    handleOwnerMint: useCallback(() => {
      if (!formState.ownerRecipient) {
        alert('Please enter a recipient address')
        return
      }
      if (!formState.ownerTokenURI) {
        alert('Please enter a token URI')
        return
      }
      ownerMint(formState.ownerRecipient as `0x${string}`, formState.ownerTokenURI)
    }, [formState.ownerRecipient, formState.ownerTokenURI, ownerMint]),

    // Reset actions
    resetPublicForm: useCallback(() => {
      setFormState(prev => ({ ...prev, publicTokenURI: '' }))
    }, []),

    resetOwnerForm: useCallback(() => {
      setFormState(prev => ({ 
        ...prev, 
        ownerRecipient: address || '', 
        ownerTokenURI: '' 
      }))
    }, [address]),
  }

  // Status computation
  const status: MintingStatus = {
    // Capabilities
    canPublicMint: !!collectionInfo?.mintingActive,
    canOwnerMint: isOwner,
    
    // Public mint status
    publicMinting: isPublicMintPending || isPublicMintConfirming,
    publicMintSuccess: isPublicMintConfirmed,
    publicMintError: publicMintError?.message || null,
    
    // Owner mint status
    ownerMinting: isOwnerMintPending || isOwnerMintConfirming,
    ownerMintSuccess: isOwnerMintConfirmed,
    ownerMintError: ownerMintError?.message || null,
  }

  return {
    // State
    formState,
    status,
    collectionInfo,
    
    // Actions
    ...actions,
  }
}