// ./nft-frontend/hooks/useNFTFilters.ts - Hook pour filtrage et tri des NFTs
'use client'

import { useState, useMemo, useCallback } from 'react'
import { type Address } from 'viem'
import { type NFTWithMetadata } from '@/lib/utils/metadataUtils'

export interface FilterState {
  searchTerm: string
  selectedRarity: string
  sortBy: 'tokenId' | 'name' | 'rarity'
  viewMode: 'grid' | 'list'
  showOnlyOwned: boolean
}

export interface FilterActions {
  setSearchTerm: (term: string) => void
  setSelectedRarity: (rarity: string) => void
  setSortBy: (sort: FilterState['sortBy']) => void
  setViewMode: (mode: FilterState['viewMode']) => void
  setShowOnlyOwned: (show: boolean) => void
  clearSearch: () => void
  resetFilters: () => void
}

const RARITY_ORDER = { 
  'legendary': 4, 
  'epic': 3, 
  'rare': 2, 
  'common': 1 
} as const

export function useNFTFilters(nfts: NFTWithMetadata[], userAddress?: Address) {
  // États des filtres
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedRarity: 'all',
    sortBy: 'tokenId',
    viewMode: 'grid',
    showOnlyOwned: false,
  })

  // Actions pour modifier les filtres
  const actions: FilterActions = {
    setSearchTerm: useCallback((searchTerm: string) => {
      setFilters(prev => ({ ...prev, searchTerm }))
    }, []),

    setSelectedRarity: useCallback((selectedRarity: string) => {
      setFilters(prev => ({ ...prev, selectedRarity }))
    }, []),

    setSortBy: useCallback((sortBy: FilterState['sortBy']) => {
      setFilters(prev => ({ ...prev, sortBy }))
    }, []),

    setViewMode: useCallback((viewMode: FilterState['viewMode']) => {
      setFilters(prev => ({ ...prev, viewMode }))
    }, []),

    setShowOnlyOwned: useCallback((showOnlyOwned: boolean) => {
      setFilters(prev => ({ ...prev, showOnlyOwned }))
    }, []),

    clearSearch: useCallback(() => {
      setFilters(prev => ({ ...prev, searchTerm: '' }))
    }, []),

    resetFilters: useCallback(() => {
      setFilters({
        searchTerm: '',
        selectedRarity: 'all',
        sortBy: 'tokenId',
        viewMode: 'grid',
        showOnlyOwned: false,
      })
    }, [])
  }

  // Extraire les raretés disponibles
  const availableRarities = useMemo(() => {
    const rarities = new Set<string>()
    nfts.forEach(nft => {
      nft.metadata?.attributes?.forEach(attr => {
        if (attr.trait_type.toLowerCase() === 'rarity') {
          rarities.add(attr.value)
        }
      })
    })
    return Array.from(rarities).sort()
  }, [nfts])

  // Appliquer les filtres et tri
  const filteredAndSortedNFTs = useMemo(() => {
    let filtered = [...nfts]

    // Filtre par propriété
    if (filters.showOnlyOwned && userAddress) {
      filtered = filtered.filter(nft => 
        nft.owner.toLowerCase() === userAddress.toLowerCase()
      )
    }

    // Filtre par recherche
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(nft => 
        nft.metadata?.name.toLowerCase().includes(searchLower) ||
        nft.tokenId.toString().includes(filters.searchTerm)
      )
    }

    // Filtre par rareté
    if (filters.selectedRarity !== 'all') {
      filtered = filtered.filter(nft => 
        nft.metadata?.attributes?.some(attr => 
          attr.trait_type.toLowerCase() === 'rarity' && 
          attr.value.toLowerCase() === filters.selectedRarity.toLowerCase()
        )
      )
    }

    // Tri
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'tokenId':
          return a.tokenId - b.tokenId
          
        case 'name':
          return (a.metadata?.name || '').localeCompare(b.metadata?.name || '')
          
        case 'rarity':
          const aRarity = a.metadata?.attributes?.find(attr => 
            attr.trait_type.toLowerCase() === 'rarity'
          )?.value.toLowerCase() || 'common'
          
          const bRarity = b.metadata?.attributes?.find(attr => 
            attr.trait_type.toLowerCase() === 'rarity'
          )?.value.toLowerCase() || 'common'
          
          return (RARITY_ORDER[bRarity as keyof typeof RARITY_ORDER] || 1) - 
                 (RARITY_ORDER[aRarity as keyof typeof RARITY_ORDER] || 1)
          
        default:
          return 0
      }
    })

    return filtered
  }, [nfts, filters, userAddress])

  // Statistiques des résultats
  const stats = useMemo(() => ({
    total: nfts.length,
    filtered: filteredAndSortedNFTs.length,
    hasFilters: filters.searchTerm !== '' || 
                filters.selectedRarity !== 'all' || 
                filters.showOnlyOwned,
    uniqueOwners: nfts.length > 0 ? new Set(nfts.map(n => n.owner)).size : 0
  }), [nfts, filteredAndSortedNFTs, filters])

  return {
    // États
    filters,
    
    // Résultats
    filteredNFTs: filteredAndSortedNFTs,
    availableRarities,
    stats,
    
    // Actions
    ...actions,
  }
}