// ./nft-frontend/components/sections/SelectImage.tsx - VERSION MODIFIÉE basée sur ton fichier réel
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { COLLECTION_IMAGES, type CollectionImage } from '@/lib/data/collectionImages'
import { OptimizedIPFSImage } from '@/components/ui/OptimizedIPFSImage'
import Image from 'next/image'

interface SelectImageProps {
  onImageSelect?: (metadataCID: string) => void
  className?: string
}

export function SelectImage({ onImageSelect, className = "" }: SelectImageProps) {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set())

  // Lazy loading : charger les images une par une avec délai
  useEffect(() => {
    const loadImagesSequentially = async () => {
      for (let i = 0; i < COLLECTION_IMAGES.length; i++) {
        // Délai progressif pour éviter le rate limiting
        await new Promise(resolve => setTimeout(resolve, i * 500))
        setImagesLoaded(prev => {
          const newSet = new Set(prev)
          newSet.add(COLLECTION_IMAGES[i].id)
          return newSet
        })
      }
    }
    
    loadImagesSequentially()
  }, [])

  // ✅ MODIFICATION : Logique pour déterminer si une image est déjà mintée
  const isImageAlreadyMinted = (imageId: number): boolean => {
    return imageId <= 3 // NFT 1, 2, 3 sont mintés, seul le 4 est disponible
  }

  // ✅ MODIFICATION : Toggle sélection + logique mint
  const handleImageClick = (image: CollectionImage) => {
    console.log('Image cliquée:', image.name, 'CID Metadata:', image.metadataCID)
    
    // Empêcher sélection si déjà minté
    if (isImageAlreadyMinted(image.id)) {
      console.log('❌ Cette image est déjà mintée, clic ignoré')
      return
    }
    
    // Toggle selection : si déjà sélectionnée, désélectionner
    if (selectedImageId === image.id) {
      console.log('🔄 Désélection de', image.name)
      setSelectedImageId(null)
      if (onImageSelect) {
        onImageSelect('') // CID vide pour désélectionner
      }
    } else {
      console.log('✅ Sélection de', image.name)
      setSelectedImageId(image.id)
      if (onImageSelect) {
        onImageSelect(image.metadataCID)
      }
    }
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Select Your Image</h2>
          <p className="text-muted-foreground">
            Choose from your pre-uploaded Crypto Code Doodles collection
          </p>
        </div>

        {/* Grille d'images responsive avec lazy loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTION_IMAGES.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              isSelected={selectedImageId === image.id}
              isAlreadyMinted={isImageAlreadyMinted(image.id)} // ✅ MODIFICATION
              shouldLoad={imagesLoaded.has(image.id)}
              priority={index === 0}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>

        {/* ✅ MODIFICATION : Info sélection améliorée */}
        <div className="mt-8">
          {selectedImageId ? (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200">
                ✅ Image sélectionnée : {COLLECTION_IMAGES.find(img => img.id === selectedImageId)?.name}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                Cliquez à nouveau pour désélectionner
              </p>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                💡 Sélectionnez le NFT #4 (seul disponible) pour remplir automatiquement les champs de mint
              </p>
            </div>
          )}
        </div>

        {/* Indicateur de chargement */}
        {imagesLoaded.size < COLLECTION_IMAGES.length && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Chargement des images... ({imagesLoaded.size}/{COLLECTION_IMAGES.length})
          </div>
        )}
      </div>
    </div>
  )
}

// ✅ MODIFICATION : ImageCard avec logique mint
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
        overflow-hidden transition-all duration-200 
        ${isAlreadyMinted 
          ? 'opacity-50 cursor-not-allowed grayscale' 
          : 'cursor-pointer hover:shadow-lg hover:-translate-y-1'
        }
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
      `}
      onClick={onClick}
    >
      <div className="aspect-square relative">
        {/* Image IPFS optimisée avec lazy loading */}

        <Image
          src={`https://ipfs.io/ipfs/${image.imageCID}`}
          alt={image.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={(e) => {
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

        {/* ✅ MODIFICATION : Badge "Minté" si déjà minté */}
        {isAlreadyMinted && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive">
              🔒 Minté
            </Badge>
          </div>
        )}

        {/* Badge sélection (seulement si pas minté) */}
        {isSelected && !isAlreadyMinted && (
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
          <h3 className={`font-semibold text-lg line-clamp-1 ${isAlreadyMinted ? 'text-muted-foreground' : ''}`}>
            {image.name}
            {isAlreadyMinted && <span className="ml-2 text-sm">(NFT #{image.id})</span>}
          </h3>
          
          <p className={`text-sm line-clamp-2 ${isAlreadyMinted ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
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
            {/* ✅ MODIFICATION : Badge indisponible */}
            {isAlreadyMinted && (
              <Badge variant="destructive" className="text-xs">
                Indisponible
              </Badge>
            )}
          </div>

          {/* CID affiché */}
          <div className={`pt-2 border-t ${isAlreadyMinted ? 'text-muted-foreground' : ''}`}>
            <p className="text-xs font-mono">
              CID: {image.imageCID.slice(0, 12)}...
            </p>
            <p className="text-xs">
              Metadata: {image.metadataCID.slice(0, 12)}...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}