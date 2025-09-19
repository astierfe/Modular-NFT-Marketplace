// ./nft-frontend/components/nft/NFTGridView.tsx
'use client'

import { NFTCard, NFTCardSkeleton } from './NFTCard'
import { Button } from '@/components/ui/Button'
import { Search } from 'lucide-react'
import { type Address } from 'viem'
import { type NFTWithMetadata } from '@/lib/utils/metadataUtils'
import { type FilterState } from '@/hooks/useNFTFilters'

interface NFTGridViewProps {
  filteredNFTs: NFTWithMetadata[]
  isLoading: boolean
  refreshKey: number
  totalSupply?: number
  userAddress?: Address
  viewMode: FilterState['viewMode']
  hasFilters: boolean
  showOnlyOwned: boolean
  onNFTClick?: (tokenId: number) => void
  onShowAllNFTs?: () => void
  className?: string
}

export function NFTGridView({
  filteredNFTs,
  isLoading,
  refreshKey,
  totalSupply,
  userAddress,
  viewMode,
  hasFilters,
  showOnlyOwned,
  onNFTClick,
  onShowAllNFTs,
  className = ""
}: NFTGridViewProps) {
  // État de chargement avec skeletons
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: Number(totalSupply) || 4 }).map((_, i) => (
          <NFTCardSkeleton key={`loading-${i}-${refreshKey}`} />
        ))}
      </div>
    )
  }

  // État vide avec différents messages
  if (filteredNFTs.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
          <Search className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No NFTs found</h3>
        <p className="text-muted-foreground">
          {hasFilters 
            ? 'Try adjusting your filters or search terms'
            : showOnlyOwned 
              ? "You don't own any NFTs from this collection yet"
              : 'Loading NFTs or none minted yet...'
          }
        </p>
        {showOnlyOwned && onShowAllNFTs && (
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onShowAllNFTs}
          >
            View All NFTs
          </Button>
        )}
      </div>
    )
  }

  // Grille des NFTs
  return (
    <div className={
      viewMode === 'grid' 
        ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`
        : `space-y-4 ${className}`
    }>
      {filteredNFTs.map((nft) => (
        <NFTCard
          key={`${nft.tokenId}-${refreshKey}`}
          tokenId={nft.tokenId}
          owner={nft.owner}
          tokenURI={nft.tokenURI}
          royaltyRecipient={nft.royaltyRecipient}
          royaltyPercentage={nft.royaltyPercentage}
          metadata={nft.metadata}
          isOwned={userAddress ? nft.owner.toLowerCase() === userAddress.toLowerCase() : false}
          onClick={() => onNFTClick?.(nft.tokenId)}
          className={viewMode === 'list' ? 'max-w-none' : ''}
        />
      ))}
    </div>
  )
}