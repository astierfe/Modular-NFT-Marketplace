// components/nft/NFTGrid.tsx - VERSION CORRIGÉE
'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useReadContract } from 'wagmi'
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
import { MODULAR_NFT_ABI, getContractAddress } from '@/lib/contracts/ModularNFT'
import { useChainId } from 'wagmi'

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
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId as keyof typeof import('@/lib/contracts/ModularNFT').CONTRACT_ADDRESSES)
  
  const { collectionInfo, isLoading: isLoadingCollection, refetch: refetchCollection } = useCollectionInfo()
  const { userNFTs, isLoading: isLoadingUserNFTs } = useUserNFTs(address)
  const collectionStats = useCollectionStats()

  // États locaux pour les filtres et l'affichage
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRarity, setSelectedRarity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'tokenId' | 'name' | 'rarity'>('tokenId')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showOnlyOwned, setShowOnlyOwned] = useState(false)
  const [allNFTs, setAllNFTs] = useState<NFTWithMetadata[]>([])
  const [loadingMetadata, setLoadingMetadata] = useState(false)

  // Lire le total supply pour connaître le nombre de NFTs mintés
  const { data: totalSupply } = useReadContract({
    address: contractAddress,
    abi: MODULAR_NFT_ABI,
    functionName: 'totalSupply',
  })

  // Fonction pour récupérer les métadonnées depuis IPFS
  const fetchMetadata = async (tokenURI: string) => {
    try {
      console.log('Fetching metadata from:', tokenURI)
      
      // Validation et nettoyage de l'URI
      if (!tokenURI || !tokenURI.startsWith('ipfs://')) {
        console.error('Invalid IPFS URI:', tokenURI)
        return null
      }
      
      // Convertir ipfs:// vers gateway HTTP
      const ipfsHash = tokenURI.replace('ipfs://', '')
      const httpUrl = `https://ipfs.io/ipfs/${ipfsHash}`
      
      console.log('HTTP URL:', httpUrl)
      
      const response = await fetch(httpUrl)
      
      if (!response.ok) {
        console.error(`Failed to fetch metadata from ${httpUrl}:`, response.status)
        return null
      }
      
      const metadata = await response.json()
      console.log('Metadata loaded:', metadata)
      return metadata
    } catch (error) {
      console.error('Error fetching metadata:', error)
      return null
    }
  }

  // Fonction pour récupérer les infos d'un token spécifique
  const fetchTokenInfo = async (tokenId: number) => {
    try {
      // Utiliser les hooks directement ici ne marche pas, on doit faire un appel direct
      const response = await fetch('http://localhost:8545', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [
            {
              to: contractAddress,
              data: `0x4566c5ef${tokenId.toString(16).padStart(64, '0')}`, // getTokenInfo(uint256)
            },
            'latest'
          ],
          id: 1
        })
      })

      const data = await response.json()
      console.log('RPC response for token', tokenId, ':', data)
      
      if (data.error) {
        console.error('RPC Error:', data.error)
        return null
      }

      // Pour l'instant, retournons des données basiques qu'on peut récupérer
      // On va utiliser une approche plus simple
      return null
    } catch (error) {
      console.error('Error fetching token info:', error)
      return null
    }
  }

  // Charger tous les NFTs de manière simple
  useEffect(() => {
    const loadAllNFTs = async () => {
      if (!totalSupply || Number(totalSupply) === 0) {
        setAllNFTs([])
        return
      }

      console.log('Loading NFTs, total supply:', Number(totalSupply))
      setLoadingMetadata(true)

      try {
        const nfts: NFTWithMetadata[] = []
        
        // Pour chaque token de 1 à totalSupply
        for (let i = 1; i <= Number(totalSupply); i++) {
          try {
            console.log('Loading token', i)
            
            // Appeler directement les fonctions du contrat pour ce token
            const ownerResponse = await fetch('http://localhost:8545', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_call',
                params: [{
                  to: contractAddress,
                  data: `0x6352211e${i.toString(16).padStart(64, '0')}` // ownerOf(uint256)
                }, 'latest'],
                id: 1
              })
            })
            
            const ownerData = await ownerResponse.json()
            if (ownerData.error) {
              console.log(`Token ${i} does not exist or error:`, ownerData.error)
              continue
            }
            
            // Récupérer le tokenURI
            const uriResponse = await fetch('http://localhost:8545', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_call',
                params: [{
                  to: contractAddress,
                  data: `0xc87b56dd${i.toString(16).padStart(64, '0')}` // tokenURI(uint256)
                }, 'latest'],
                id: 2
              })
            })
            
            const uriData = await uriResponse.json()
            if (uriData.error) {
              console.log(`Could not get URI for token ${i}:`, uriData.error)
              continue
            }

            // Décoder les résultats hex
            const owner = '0x' + ownerData.result.slice(-40)
            
            // Décoder l'URI depuis la réponse hex
            let tokenURI = ''
            try {
              if (uriData.result && uriData.result !== '0x') {
                const hexString = uriData.result.slice(2) // enlever 0x
                
                // Décoder la string ABI-encoded
                // Format: offset(32 bytes) + length(32 bytes) + data
                const lengthHex = hexString.slice(64, 128) // 2ème chunk = length
                const length = parseInt(lengthHex, 16)
                
                if (length > 0) {
                  const dataHex = hexString.slice(128, 128 + (length * 2)) // data chunk
                  tokenURI = Buffer.from(dataHex, 'hex').toString('utf8')
                  
                  // Nettoyer l'URI
                  tokenURI = tokenURI.replace(/\0/g, '').replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim()
                  
                  console.log('Raw decoded URI for token', i, ':', tokenURI)
                  
                  // Corriger les URIs malformés
                  if (tokenURI.includes('ipfs://') && !tokenURI.startsWith('ipfs://')) {
                    // Extraire juste la partie ipfs://
                    const ipfsMatch = tokenURI.match(/ipfs:\/\/[a-zA-Z0-9]+/)
                    if (ipfsMatch) {
                      tokenURI = ipfsMatch[0]
                    }
                  }
                  
                  console.log('Cleaned URI for token', i, ':', tokenURI)
                } else {
                  tokenURI = `ipfs://placeholder-${i}`
                }
              } else {
                tokenURI = `ipfs://placeholder-${i}`
              }
            } catch (e) {
              console.error('Error decoding URI for token', i, ':', e)
              tokenURI = `ipfs://placeholder-${i}`
            }

            const nft: NFTWithMetadata = {
              tokenId: i,
              owner: owner,
              tokenURI: tokenURI,
              royaltyRecipient: owner, // Simplification
              royaltyPercentage: 5, // Simplification
            }

            // Essayer de récupérer les métadonnées si on a un URI IPFS valide
            if (tokenURI.startsWith('ipfs://')) {
              const metadata = await fetchMetadata(tokenURI)
              if (metadata) {
                nft.metadata = metadata
              } else {
                // Métadonnées par défaut
                nft.metadata = {
                  name: `Token #${i}`,
                  description: `NFT Token #${i} from the collection`,
                  image: tokenURI.startsWith('ipfs://') ? tokenURI : 'https://via.placeholder.com/400x400?text=NFT',
                  attributes: []
                }
              }
            } else {
              // Métadonnées par défaut si pas d'URI IPFS
              nft.metadata = {
                name: `Token #${i}`,
                description: `NFT Token #${i} from the collection`,
                image: 'https://via.placeholder.com/400x400?text=NFT',
                attributes: []
              }
            }

            nfts.push(nft)
            console.log('Added NFT:', nft)
            
          } catch (error) {
            console.error(`Error loading token ${i}:`, error)
          }
        }

        console.log('Loaded NFTs:', nfts)
        setAllNFTs(nfts)
        
      } catch (error) {
        console.error('Error loading NFTs:', error)
      } finally {
        setLoadingMetadata(false)
      }
    }

    loadAllNFTs()
  }, [totalSupply, contractAddress])

  // Filtrage et tri des NFTs
  const filteredAndSortedNFTs = useMemo(() => {
    let filtered = allNFTs

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
  }, [allNFTs, searchTerm, selectedRarity, sortBy, showOnlyOwned, address])

  // Extraire les raretés uniques pour les filtres
  const availableRarities = useMemo(() => {
    const rarities = new Set<string>()
    allNFTs.forEach(nft => {
      nft.metadata?.attributes?.forEach(attr => {
        if (attr.trait_type === 'Rarity') {
          rarities.add(attr.value)
        }
      })
    })
    return Array.from(rarities).sort()
  }, [allNFTs])

  const handleRefresh = useCallback(() => {
    refetchCollection()
    // Re-trigger l'effet pour recharger les NFTs
    setAllNFTs([])
  }, [refetchCollection])

  if (isLoadingCollection) {
    return <NFTGridSkeleton />
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Debug info */}
      <div className="text-sm text-muted-foreground">
        Debug: Total Supply: {totalSupply?.toString()}, Loaded NFTs: {allNFTs.length}, Loading: {loadingMetadata.toString()}
      </div>

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
                <div className="text-2xl font-bold">{allNFTs.length > 0 ? new Set(allNFTs.map(n => n.owner)).size : 0}</div>
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
          {loadingMetadata && ' (Loading metadata...)'}
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
      {loadingMetadata ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: Number(totalSupply) || 4 }).map((_, i) => (
            <NFTCardSkeleton key={`loading-${i}`} />
          ))}
        </div>
      ) : filteredAndSortedNFTs.length === 0 ? (
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
                : 'Loading NFTs or none minted yet...'
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