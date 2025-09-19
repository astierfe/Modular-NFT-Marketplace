// ./nft-frontend/components/nft/NFTGrid.tsx - VERSION REFACTORISÉE ET SIMPLIFIÉE
'use client'

import { Button } from '@/components/ui/Button'
import { useAccount } from 'wagmi'
import { useReadContract } from 'wagmi'
import { CollectionStatsHeader } from '../collection/CollectionStatsHeader'
import { NFTFiltersControls } from './NFTFiltersControls'
import { NFTGridView } from './NFTGridView'
import { useCollectionInfo, useCollectionStats } from '@/hooks'
import { useNFTMetadata } from '@/hooks/useNFTMetadata'
import { useNFTFilters } from '@/hooks/useNFTFilters'
import { MODULAR_NFT_ABI, getContractAddress } from '@/lib/contracts/ModularNFT'
import { useChainId } from 'wagmi'

interface NFTGridProps {
  className?: string
  showMintButton?: boolean
  onMintClick?: () => void
  onNFTClick?: (tokenId: number) => void
}

export function NFTGrid({ 
  className = "",
  showMintButton = false,
  onMintClick,
  onNFTClick 
}: NFTGridProps) {
  const { address } = useAccount()
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)
  
  // Hooks principaux
  const { collectionInfo, isLoading: isLoadingCollection } = useCollectionInfo()
  const collectionStats = useCollectionStats()

  // Total supply pour charger les NFTs
  const { data: totalSupply } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'totalSupply',
  })

  // Chargement des métadonnées
  const { 
    allNFTs, 
    loadingMetadata, 
    refreshKey, 
    forceRefresh 
  } = useNFTMetadata(Number(totalSupply))

  // Filtrage et tri
  const {
    filters,
    filteredNFTs,
    availableRarities,
    stats,
    setSearchTerm,
    setSelectedRarity,
    setSortBy,
    setViewMode,
    setShowOnlyOwned,
    clearSearch,
  } = useNFTFilters(allNFTs, address)

  // Actions
  const handleRefresh = () => {
    console.log('Manual refresh triggered')
    forceRefresh()
  }

  const handleShowAllNFTs = () => {
    setShowOnlyOwned(false)
  }

  // Loading state
  if (isLoadingCollection) {
    return <NFTGridSkeleton />
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Debug info - peut être supprimé en production */}
      <div className="text-sm text-muted-foreground">
        Debug: Total Supply: {totalSupply?.toString()}, Loaded NFTs: {allNFTs.length}, Loading: {loadingMetadata.toString()}, Refresh: {refreshKey}
      </div>

      {/* En-tête avec statistiques */}
      <CollectionStatsHeader
        collectionInfo={collectionInfo}
        collectionStats={collectionStats ? {
          totalSupply: collectionStats.totalSupply || 0,
          maxSupply: collectionStats.maxSupply || 0,
          remaining: collectionStats.remaining || 0,
          progress: collectionStats.progress || 0,
          mintPrice: collectionStats.mintPrice || '0',
          soldOut: collectionStats.soldOut || false,
          mintingActive: collectionStats.mintingActive || false,
        } : null}
        uniqueOwners={stats.uniqueOwners}
      />

      {/* Contrôles et filtres */}
      <NFTFiltersControls
        filters={filters}
        actions={{
          setSearchTerm,
          setSelectedRarity,
          setSortBy,
          setViewMode,
          setShowOnlyOwned,
          clearSearch,
          resetFilters: () => {
            setSearchTerm('')
            setSelectedRarity('all')
            setSortBy('tokenId')
            setViewMode('grid')
            setShowOnlyOwned(false)
          }
        }}
        availableRarities={availableRarities}
        isLoading={loadingMetadata}
        showMintButton={showMintButton}
        onMintClick={onMintClick}
        onRefresh={handleRefresh}
      />

      {/* Résultats */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {stats.filtered} NFT{stats.filtered !== 1 ? 's' : ''} found
          {filters.showOnlyOwned && address && ' (owned by you)'}
          {loadingMetadata && ' (Loading metadata...)'}
        </p>
        
        {filters.searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
          >
            Clear search
          </Button>
        )}
      </div>

      {/* Grille des NFTs */}
      <NFTGridView
        filteredNFTs={filteredNFTs}
        isLoading={loadingMetadata}
        refreshKey={refreshKey}
        totalSupply={Number(totalSupply)}
        userAddress={address}
        viewMode={filters.viewMode}
        hasFilters={stats.hasFilters}
        showOnlyOwned={filters.showOnlyOwned}
        onNFTClick={onNFTClick}
        onShowAllNFTs={handleShowAllNFTs}
      />
    </div>
  )
}

// Composant skeleton simple
export function NFTGridSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-8 w-16 bg-muted rounded animate-pulse mx-auto" />
                <div className="h-4 w-12 bg-muted rounded animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          <div className="h-2 w-full bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Controls skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="h-10 w-64 bg-muted rounded animate-pulse" />
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex space-x-2">
          <div className="h-10 w-20 bg-muted rounded animate-pulse" />
          <div className="h-10 w-16 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="flex space-x-2">
                <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                <div className="h-6 w-20 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}