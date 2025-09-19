// ./nft-frontend/hooks/useNFTMetadata.ts - Hook pour chargement métadonnées NFT
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useChainId } from 'wagmi'
import { getContractAddress } from '@/lib/contracts/ModularNFT'
import { metadataUtils, type NFTWithMetadata } from '@/lib/utils/metadataUtils'

export function useNFTMetadata(totalSupply?: number) {
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)
  
  const [allNFTs, setAllNFTs] = useState<NFTWithMetadata[]>([])
  const [loadingMetadata, setLoadingMetadata] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  
  // RPC URL basé sur l'environnement
  const rpcUrl = chainId === 31337 
    ? 'http://localhost:8545'
    : `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`

  // Fonction pour forcer le refresh
  const forceRefresh = useCallback(() => {
    console.log('useNFTMetadata: Force refresh triggered')
    setRefreshKey(prev => prev + 1)
  }, [])

  // Exposer la fonction de refresh globalement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshNFTGrid = forceRefresh
    }
  }, [forceRefresh])

  // Charger tous les NFTs quand totalSupply change ou refresh
  useEffect(() => {
    const loadAllNFTs = async () => {
      if (!totalSupply || Number(totalSupply) === 0) {
        setAllNFTs([])
        return
      }

      console.log('Loading NFTs, total supply:', Number(totalSupply), 'refresh key:', refreshKey)
      setLoadingMetadata(true)

      try {
        const nfts = await metadataUtils.loadAllTokens(
          rpcUrl,
          contractAddress,
          Number(totalSupply)
        )
        
        console.log('Loaded NFTs:', nfts)
        setAllNFTs(nfts)
        
      } catch (error) {
        console.error('Error loading NFTs:', error)
        setAllNFTs([])
      } finally {
        setLoadingMetadata(false)
      }
    }

    loadAllNFTs()
  }, [totalSupply, contractAddress, refreshKey, rpcUrl])

  return {
    allNFTs,
    loadingMetadata,
    refreshKey,
    forceRefresh,
  }
}