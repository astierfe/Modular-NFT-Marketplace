// ./nft-frontend/components/sections/SelectImage.tsx - VERSION SIMPLIFIÉE POUR DEBUG
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { COLLECTION_IMAGES, getIPFSImageUrl, type CollectionImage } from '@/lib/data/collectionImages'
import { OptimizedIPFSImage } from '@/components/ui/OptimizedIPFSImage'

interface SelectImageProps {
  onImageSelect?: (metadataCID: string) => void
  className?: string
}

export function SelectImage({ onImageSelect, className = "" }: SelectImageProps) {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)

  const handleImageClick = (image: CollectionImage) => {
    console.log('Image cliquée:', image.name, 'CID Metadata:', image.metadataCID)
    
    setSelectedImageId(image.id)
    
    if (onImageSelect) {
      onImageSelect(image.metadataCID)
    }
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Select Your Image</h2>
          <p className="text-muted-foreground">
            Choose from your pre-uploaded Crypto Code Doodles collection ({COLLECTION_IMAGES.length} images)
          </p>
        </div>

        {/* DEBUG: Affichage de la liste */}
        <div className="mb-4 text-sm text-muted-foreground">
          Images chargées: {COLLECTION_IMAGES.map(img => img.name).join(', ')}
        </div>

        {/* Grille d'images simple */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTION_IMAGES.map((image) => (
            <Card 
              key={image.id}
              className={`
                overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1
                ${selectedImageId === image.id ? 'ring-2 ring-blue-500 shadow-lg' : ''}
              `}
              onClick={() => handleImageClick(image)}
            >
              <div className="aspect-square relative bg-muted">
                {/* Image avec fallback simple */}
                <Image
                  src={`https://ipfs.io/ipfs/${image.imageCID}`}
                  alt={image.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onLoad={() => console.log(`✅ Image chargée: ${image.name}`)}
                  onError={(e) => {
                    console.error(`❌ Erreur image ${image.name}:`, e)
                    // Essayer Pinata en fallback
                    const target = e.target as HTMLImageElement
                    if (!target.src.includes('gateway.pinata.cloud')) {
                      target.src = `https://gateway.pinata.cloud/ipfs/${image.imageCID}`
                    }
                  }}
                />
                
                {/* Badge rareté */}
                <div className="absolute top-2 left-2">
                  <Badge 
                    variant={image.attributes.rarity === 'Epic' ? 'default' : 'secondary'}
                    className={
                      image.attributes.rarity === 'Epic' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {image.attributes.rarity}
                  </Badge>
                </div>

                {/* Badge sélection */}
                {selectedImageId === image.id && (
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-blue-500 text-white">
                      ✓ Sélectionné
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info carte */}
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    {image.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {image.attributes.language}
                    </Badge>
                  </div>

                  <div className="pt-2 border-t text-xs text-muted-foreground font-mono">
                    CID: {image.imageCID.slice(0, 12)}...
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info sélection */}
        {selectedImageId && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200">
              ✅ Image sélectionnée : {COLLECTION_IMAGES.find(img => img.id === selectedImageId)?.name}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Sous-composant pour une carte image avec lazy loading
interface ImageCardProps {
  image: CollectionImage
  isSelected: boolean
  isAlreadyMinted: boolean
  shouldLoad: boolean
  priority?: boolean
  onClick: () => void
}

function ImageCard({ image, isSelected, isAlreadyMinted, shouldLoad, priority = false, onClick }: ImageCardProps) {
  return (
    <Card 
      className={`
        overflow-hidden cursor-pointer transition-all duration-200 
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-lg hover:-translate-y-1'}
        ${isAlreadyMinted ? 'opacity-50 cursor-not-allowed grayscale' : ''}
      `}
      onClick={onClick}
    >
      <div className="aspect-square relative">
        {/* Image IPFS optimisée avec lazy loading */}
        {shouldLoad ? (
          <OptimizedIPFSImage
            cid={image.imageCID}
            alt={image.name}
            priority={priority}
            onError={() => console.error('Erreur chargement:', image.name)}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center animate-pulse">
            <div className="text-2xl">⏳</div>
          </div>
        )}
        
        {/* Badge rareté */}
        <div className="absolute top-2 left-2">
          <Badge 
            variant={image.attributes.rarity === 'Epic' ? 'default' : 'secondary'}
            className={
              image.attributes.rarity === 'Epic' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }
          >
            {image.attributes.rarity}
          </Badge>
        </div>

        {/* Badge "Minté" si applicable */}
        {isAlreadyMinted && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive">
              🔒 Minté
            </Badge>
          </div>
        )}

        {/* Badge sélection */}
        {isSelected && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-blue-500 text-white">
              ✓ Sélectionné
            </Badge>
          </div>
        )}
      </div>

      {/* Info carte */}
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">
            {image.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {image.description}
          </p>

          {/* Attributs principaux */}
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {image.attributes.language}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {image.attributes.doodle}
            </Badge>
          </div>

          {/* CID affiché */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground font-mono">
              CID: {image.imageCID.slice(0, 12)}...
            </p>
            <p className="text-xs text-muted-foreground">
              Metadata: {image.metadataCID.slice(0, 12)}...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}