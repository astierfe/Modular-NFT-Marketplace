// ./nft-frontend/components/nft/NFTFiltersControls.tsx
'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Search, 
  Grid3X3, 
  List, 
  RefreshCw,
  Plus,
  Eye
} from 'lucide-react'
import { type FilterState, type FilterActions } from '@/hooks/useNFTFilters'

interface NFTFiltersControlsProps {
  filters: FilterState
  actions: FilterActions
  availableRarities: string[]
  isLoading?: boolean
  showMintButton?: boolean
  onMintClick?: () => void
  onRefresh?: () => void
  className?: string
}

export function NFTFiltersControls({
  filters,
  actions,
  availableRarities,
  isLoading = false,
  showMintButton = false,
  onMintClick,
  onRefresh,
  className = ""
}: NFTFiltersControlsProps) {
  return (
    <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4 ${className}`}>
      {/* Recherche et filtres */}
      <div className="flex flex-1 space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or token ID..."
            value={filters.searchTerm}
            onChange={(e) => actions.setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={filters.selectedRarity}
          onChange={(e) => actions.setSelectedRarity(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background text-sm"
        >
          <option value="all">All Rarities</option>
          {availableRarities.map(rarity => (
            <option key={rarity} value={rarity}>{rarity}</option>
          ))}
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => actions.setSortBy(e.target.value as FilterState['sortBy'])}
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
          onClick={() => actions.setShowOnlyOwned(!filters.showOnlyOwned)}
          className={filters.showOnlyOwned ? 'bg-primary text-primary-foreground' : ''}
        >
          <Eye className="h-4 w-4 mr-1" />
          {filters.showOnlyOwned ? 'Show All' : 'My NFTs'}
        </Button>

        <div className="flex border rounded-md">
          <Button
            variant={filters.viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => actions.setViewMode('grid')}
            className="rounded-r-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={filters.viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => actions.setViewMode('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}

        {showMintButton && onMintClick && (
          <Button onClick={onMintClick} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Mint NFT
          </Button>
        )}
      </div>
    </div>
  )
}