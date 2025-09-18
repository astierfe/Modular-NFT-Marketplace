// components/nft/NFTCard.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { ExternalLink, User, Crown, Palette, Eye } from 'lucide-react'

interface NFTAttribute {
  trait_type: string
  value: string
  display_type?: string
}

interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes?: NFTAttribute[]
  external_url?: string
  background_color?: string
  animation_url?: string
}

interface NFTCardProps {
  tokenId: number
  owner: string
  tokenURI: string
  royaltyRecipient: string
  royaltyPercentage: number
  metadata?: NFTMetadata
  isOwned?: boolean
  onClick?: () => void
  className?: string
}

// Composant pour optimiser le chargement des images IPFS
function IPFSImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  // Convertir IPFS URI vers HTTP gateway
  const getIPFSUrl = (uri: string) => {
    if (uri.startsWith('ipfs://')) {
      const hash = uri.replace('ipfs://', '')
      return `https://ipfs.io/ipfs/${hash}`
    }
    return uri
  }

  // Gateways de fallback IPFS
  const ipfsGateways = [
    'https://ipfs.io/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
  ]

  const [currentGateway, setCurrentGateway] = useState(0)
  const imageUrl = getIPFSUrl(src)

  const handleImageError = () => {
    if (currentGateway < ipfsGateways.length - 1) {
      // Essayer le gateway suivant
      const hash = src.replace('ipfs://', '')
      const nextUrl = ipfsGateways[currentGateway + 1] + hash
      setCurrentGateway(prev => prev + 1)
    } else {
      setImageError(true)
    }
    setImageLoading(false)
  }

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center">
          <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Image not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <Skeleton className="absolute inset-0 z-10" />
      )}
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover transition-opacity duration-300"
        onLoad={() => setImageLoading(false)}
        onError={handleImageError}
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
    </div>
  )
}

// Badge pour les attributs rares
function RarityBadge({ attribute }: { attribute: NFTAttribute }) {
  const getRarityColor = (traitType: string, value: string) => {
    // Logique de rareté basée sur les attributs
    if (traitType === 'Rarity') {
      switch (value.toLowerCase()) {
        case 'legendary':
          return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
        case 'epic':
          return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
        case 'rare':
          return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
        case 'common':
          return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        default:
          return 'bg-secondary text-secondary-foreground'
      }
    }
    return 'bg-secondary text-secondary-foreground'
  }

  return (
    <Badge 
      className={`${getRarityColor(attribute.trait_type, attribute.value)} text-xs font-medium`}
      variant="secondary"
    >
      {attribute.value}
    </Badge>
  )
}

export function NFTCard({ 
  tokenId, 
  owner, 
  tokenURI, 
  royaltyRecipient, 
  royaltyPercentage, 
  metadata,
  isOwned = false,
  onClick,
  className = ""
}: NFTCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Fonction pour raccourcir les adresses
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Extraire l'attribut de rareté principal
  const rarityAttribute = metadata?.attributes?.find(attr => 
    attr.trait_type.toLowerCase() === 'rarity'
  )

  // Compter les attributs
  const attributeCount = metadata?.attributes?.length || 0

  return (
    <Card 
      className={`group overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="relative">
        {/* Image du NFT */}
        <div className="aspect-square relative overflow-hidden">
          {metadata?.image ? (
            <IPFSImage 
              src={metadata.image} 
              alt={metadata.name || `NFT #${tokenId}`}
              className="w-full h-full"
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
          
          {/* Overlay avec actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (metadata?.image) {
                    // Convertir IPFS vers gateway HTTP et ouvrir
                    const imageUrl = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                    window.open(imageUrl, '_blank')
                  }
                }}
                className="rounded-full bg-white/90 p-2 text-black hover:bg-white transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Badge Token ID */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/50 text-white font-mono text-xs">
              #{tokenId}
            </Badge>
          </div>

          {/* Badge "Owned" */}
          {isOwned && (
            <div className="absolute top-2 left-16">
              <Badge className="bg-green-500 text-white text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Owned
              </Badge>
            </div>
          )}

          {/* Badge de rareté */}
          {rarityAttribute && (
            <div className="absolute bottom-2 left-2">
              <RarityBadge attribute={rarityAttribute} />
            </div>
          )}
        </div>

        {/* Informations du NFT */}
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Nom et description */}
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">
                {metadata?.name || `NFT #${tokenId}`}
              </h3>
              {metadata?.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {metadata.description}
                </p>
              )}
            </div>

            {/* Attributs principaux */}
            {metadata?.attributes && metadata.attributes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {metadata.attributes.slice(0, 3).map((attr, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {attr.trait_type}: {attr.value}
                  </Badge>
                ))}
                {metadata.attributes.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{metadata.attributes.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Informations de propriété */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Owner:</span>
                <code className="font-mono text-xs">
                  {truncateAddress(owner)}
                </code>
              </div>
              
              {/* Royalties info */}
              {royaltyPercentage > 0 && (
                <div className="text-xs text-muted-foreground">
                  {royaltyPercentage}% royalty
                </div>
              )}
            </div>

            {/* Détails étendus */}
            {showDetails && (
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Token URI:</span>
                    <p className="font-mono truncate">{tokenURI}</p>
                  </div>
                  {royaltyRecipient && (
                    <div>
                      <span className="text-muted-foreground">Royalties:</span>
                      <p className="font-mono truncate">
                        {truncateAddress(royaltyRecipient)} ({royaltyPercentage}%)
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Tous les attributs */}
                {metadata?.attributes && metadata.attributes.length > 3 && (
                  <div>
                    <span className="text-muted-foreground">All Attributes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {metadata.attributes.slice(3).map((attr, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {attr.trait_type}: {attr.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lien externe */}
                {metadata?.external_url && (
                  <a
                    href={metadata.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>View External</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

// Composant pour NFT Card avec skeleton loader
export function NFTCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}