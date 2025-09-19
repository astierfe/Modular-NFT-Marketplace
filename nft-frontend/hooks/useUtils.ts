// ./nft-frontend/hooks/useUtils.ts - Hooks utilitaires
'use client'

import { useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useCollectionInfo } from '../hooks/useCollectionData'
import { useUserNFTs } from '../hooks/useUserNFTs'
import { useIsOwner } from '../hooks/useCollectionData'

// Hook pour formater les adresses
export function useFormatAddress(address?: string) {
  return useMemo(() => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [address])
}

// Hook pour refresh global de toutes les données
export function useGlobalRefresh() {
  const { refetch: refetchCollection } = useCollectionInfo()
  const { address } = useAccount()
  const { refetch: refetchUserNFTs } = useUserNFTs(address)
  const { refetch: refetchOwner } = useIsOwner()

  const refreshAll = useCallback(async () => {
    console.log('useGlobalRefresh: Refreshing all data...')
    const promises = [
      refetchCollection(),
      refetchUserNFTs(),
      refetchOwner(),
    ]
    
    try {
      const results = await Promise.all(promises)
      console.log('useGlobalRefresh: All refreshes completed')
      
      // Trigger NFTGrid refresh si disponible
      if (typeof window !== 'undefined' && (window as any).refreshNFTGrid) {
        (window as any).refreshNFTGrid()
      }
      
      return results
    } catch (error) {
      console.error('useGlobalRefresh: Some refreshes failed', error)
      throw error
    }
  }, [refetchCollection, refetchUserNFTs, refetchOwner])

  return {
    refreshAll,
  }
}

// Hook pour vérifier si l'utilisateur connecté est owner
export function useCurrentUserIsOwner() {
  const { address } = useAccount()
  const { isOwner } = useIsOwner()
  
  return useMemo(() => {
    return address ? isOwner(address) : false
  }, [address, isOwner])
}