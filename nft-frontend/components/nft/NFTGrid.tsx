// components/nft/NFTGrid.tsx
'use client'

import { useState, useMemo, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { NFTCard, NFTCardSkeleton } from './NFTCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { 
  Search, 
  Filter, 
  SortAsc, 
  Grid3X3, 
  List, 
  RefreshCw,
  Plus,
  TrendingUp,
  Users,
  Eye
} from 'lucide-react'
import { useCollectionInfo, useUserNFTs, useCollectionStats } from '@/hooks/useModularNFT'

interface NFTWithMetadata {
  tokenId: number
  owner: string
  tokenURI: string
  royaltyRecipient: string
  royaltyPercentage: number
  metadata?: {
    name: string
    description: string
    image: string
    attributes?: Array<{
      trait_type: string
      value: string
      display_type?: string
    }>
    external_url?: string
  }
}

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
  const { collectionInfo, isLoading: isLoadingCollection, refetch: refetchCollection } = useCollectionInfo()
  const { userNFTs, isLoading: isLoadingUserNFTs } = useUserNFTs(address)
  const collectionStats = useCollectionStats()

  // États locaux pour les filtres et l'affichage
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRarity, setSelectedRarity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'tokenId' | 'name' | 'rarity'>('tokenId')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showOnlyOwned, setShowOnlyOwned] = useState(false)

  // Mock data pour la démonstration - À remplacer par les vraies données
  const mockNFTs: NFTWithMetadata[] = useMemo(() => {
    if (!collectionInfo) return []
    
    const nfts: NFTWithMetadata[] = []
    
    // Ajouter les NFTs de l'utilisateur s'il est connecté
    if (userNFTs.length > 0) {
      userNFTs.forEach(nft => {
        nfts.push({
          tokenId: nft.tokenId,
          owner: nft.owner,
          tokenURI: nft.tokenURI,
          royaltyRecipient: nft.royaltyRecipient,
          royaltyPercentage: nft.royaltyPercentage,
          metadata: {
            name: `${collectionInfo.name} #${nft.tokenId}`,
            description: `A unique NFT from the ${collectionInfo.name} collection`,
            image: `ipfs://QmMockHash${nft.tokenId}`,
            attributes: [
              { trait_type: 'Rarity', value: ['Common', 'Rare', 'Epic', 'Legendary'][nft.tokenId % 4] },
              { trait_type: 'Style', value: ['Photography', 'Digital Art', 'Abstract'][nft.tokenId % 3] },
              { trait_type: 'Color', value: ['Vibrant', 'Monochrome', 'Pastel'][nft.tokenId % 3] }
            ]
          }
        })
      })
    }
    
    // Ajouter quelques NFTs mock pour la démo
    const mockCount = Math.min(12, collectionInfo.totalSupply)
    for (let i = 1; i <= mockCount; i++) {
      if (!nfts.find(nft => nft.tokenId === i)) {
        nfts.push({
          tokenId: i,
          owner: `0x${'0'.repeat(36)}${i.toString(16).padStart(4, '0')}`,
          tokenURI: `ipfs://QmMockHash${i}`,
          royaltyRecipient: collectionInfo.name.includes('Owner') ? `0x${'0'.repeat(36)}${i.toString(16).padStart(4, '0')}` : '0x0000000000000000000000000000000000000000',
          royaltyPercentage: 5,
          metadata: {
            name: `${collectionInfo.name} #${i}`,
            description: `A unique NFT from the ${collectionInfo.name} collection. This piece showcases incredible artistry and creativity.`,
            image: `https://picsum.photos/400/400?random=${i}`,
            attributes: [
              { trait_type: 'Rarity', value: ['Common', 'Rare', 'Epic', 'Legendary'][i % 4] },
              { trait_type: 'Style', value: ['Photography', 'Digital Art', 'Abstract', 'Portrait', 'Landscape'][i % 5] },
              { trait_type: 'Color Palette', value: ['Vibrant', 'Monochrome', 'Pastel', 'Dark', 'Neon'][i % 5] },
              { trait_type: 'Generation', value: '1', display_type: 'number' }
            ],
            external_url: 'https://your-website.com'
          }
        })
      }
    }
    
    return nfts
  }, [collectionInfo, userNFTs])

  // Filtrage et tri des NFTs
  const filteredAndSortedNFTs = useMemo(() => {
    let filtered = mockNFTs

    // Filtre par propriété
    if (showOnlyOwned && address) {
      filtered = filtered.filter(nft => 
        nft.owner.toLowerCase() === address.toLowerCase()
      )
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(nft => 
        nft.metadata?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.tokenId.toString().includes(searchTerm)
      )
    }

    // Filtre par rareté
    if (selectedRarity !== 'all') {
      filtered = filtered.filter(nft => 
        nft.metadata?.attributes?.some(attr => 
          attr.trait_type === 'Rarity' && 
          attr.value.toLowerCase() === selectedRarity.toLowerCase()
        )
      )
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'tokenId':
          return a.tokenId - b.tokenId
        case 'name':
          return (a.metadata?.name || '').localeCompare(b.metadata?.name || '')
        case 'rarity':
          const rarityOrder = { 'legendary': 4, 'epic': 3, 'rare': 2, 'common': 1 }
          const aRarity = a.metadata?.attributes?.find(attr => attr.trait_type === 'Rarity')?.value.toLowerCase() || 'common'
          const bRarity = b.metadata?.attributes?.find(attr => attr.trait_type === 'Rarity')?.value.toLowerCase() || 'common'
          return (rarityOrder[bRarity as keyof typeof rarityOrder] || 1) - (rarityOrder[aRarity as keyof typeof rarityOrder] || 1)
        default:
          return 0
      }
    })

    return filtered
  }, [mockNFTs, searchTerm, selectedRarity, sortBy, showOnlyOwned, address])

  // Extraire les raretés uniques pour les filtres
  const availableRarities = useMemo(() => {
    const rarities = new Set<string>()
    mockNFTs.forEach(nft => {
      nft.metadata?.attributes?.forEach(attr => {
        if (attr.trait_type === 'Rarity') {
          rarities.add(attr.value)
        }
      })
    })
    return Array.from(rarities).sort()
  }, [mockNFTs])

  const handleRefresh = useCallback(() => {
    refetchCollection()
  }, [refetchCollection])

  if (isLoadingCollection) {
    return <NFTGridSkeleton />
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec statistiques */}
      {collectionStats && (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-2xl font-bold">
                {collectionInfo?.name || 'NFT Collection'}
              </h2>
              <p className="text-muted-foreground">
                {collectionInfo?.symbol} • {collectionStats.totalSupply} of {collectionStats.maxSupply} minted
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{collectionStats.totalSupply}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Total Supply
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{collectionStats.remaining}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <Plus className="h-4 w-4 mr-1" />
                  Available
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{collectionStats.mintPrice} ETH</div>
                <div className="text-sm text-muted-foreground">Floor Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{mockNFTs.length > 0 ? new Set(mockNFTs.map(n => n.owner)).size : 0}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <Users className="h-4 w-4 mr-1" />
                  Owners
                </div>
              </div>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Minting Progress</span>
              <span>{collectionStats.progress.toFixed(1)}%</span>
            </div>
            <Progress value={collectionStats.progress} className="w-full" />
          </div>
        </div>
      )}

      {/* Contrôles et filtres */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
        {/* Recherche et filtres */}
        <div className="flex flex-1 space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or token ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All Rarities</option>
            {availableRarities.map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'tokenId' | 'name' | 'rarity')}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="tokenId">Sort by Token ID</option>
            <option value="name">Sort by Name</option>
            <option value="rarity">Sort by Rarity</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOnlyOwned(!showOnlyOwned)}
            className={showOnlyOwned ? 'bg-primary text-primary-foreground' : ''}
          >
            <Eye className="h-4 w-4 mr-1" />
            {showOnlyOwned ? 'Show All' : 'My NFTs'}
          </Button>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          {showMintButton && onMintClick && (
            <Button onClick={onMintClick} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Mint NFT
            </Button>
          )}
        </div>
      </div>

      {/* Résultats */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {filteredAndSortedNFTs.length} NFT{filteredAndSortedNFTs.length !== 1 ? 's' : ''} found
          {showOnlyOwned && address && ' (owned by you)'}
        </p>
        
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
          >
            Clear search
          </Button>
        )}
      </div>

      {/* Grille des NFTs */}
      {filteredAndSortedNFTs.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No NFTs found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedRarity !== 'all' 
              ? 'Try adjusting your filters or search terms'
              : showOnlyOwned 
                ? "You don't own any NFTs from this collection yet"
                : 'No NFTs have been minted yet'
            }
          </p>
          {showOnlyOwned && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setShowOnlyOwned(false)}
            >
              View All NFTs
            </Button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredAndSortedNFTs.map((nft) => (
            <NFTCard
              key={nft.tokenId}
              tokenId={nft.tokenId}
              owner={nft.owner}
              tokenURI={nft.tokenURI}
              royaltyRecipient={nft.royaltyRecipient}
              royaltyPercentage={nft.royaltyPercentage}
              metadata={nft.metadata}
              isOwned={address ? nft.owner.toLowerCase() === address.toLowerCase() : false}
              onClick={() => onNFTClick?.(nft.tokenId)}
              className={viewMode === 'list' ? 'max-w-none' : ''}
            />
          ))}
        </div>
      )}

      {/* Loading state pour plus de NFTs */}
      {isLoadingUserNFTs && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <NFTCardSkeleton key={`loading-${i}`} />
          ))}
        </div>
      )}
    </div>
  )
}

// Composant skeleton pour la grille
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
          <NFTCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}