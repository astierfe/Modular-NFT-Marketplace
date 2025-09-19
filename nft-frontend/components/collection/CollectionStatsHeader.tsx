// ./nft-frontend/components/collection/CollectionStatsHeader.tsx
'use client'

import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { TrendingUp, Plus, Users } from 'lucide-react'
import { type CollectionStats } from '@/hooks'

interface CollectionStatsHeaderProps {
  collectionInfo?: {
    name?: string
    symbol?: string
  } | null
  collectionStats?: CollectionStats | null
  uniqueOwners: number
  className?: string
}

export function CollectionStatsHeader({ 
  collectionInfo, 
  collectionStats, 
  uniqueOwners,
  className = "" 
}: CollectionStatsHeaderProps) {
  if (!collectionStats) return null

  return (
    <div className={`rounded-lg border bg-card p-6 ${className}`}>
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
            <div className="text-2xl font-bold">{uniqueOwners}</div>
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
          <span>{collectionStats.progress?.toFixed(1) || 0}%</span>
        </div>
        <Progress value={collectionStats.progress || 0} className="w-full" />
      </div>
    </div>
  )
}