// ./nft-frontend/components/sections/SelectImage.tsx
'use client'
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { COLLECTION_IMAGES, type CollectionImage } from '@/lib/data/collectionImages'
import { type NFTWithMetadata } from '@/lib/utils/metadataUtils'
import Image from 'next/image'

interface SelectImageProps {
  mintedNFTs: NFTWithMetadata[]
  isLoading?: boolean
  onImageSelect?: (metadataCID: string) => void
  className?: string
}

function extractCIDFromTokenURI(tokenURI: string): string {
  if (!tokenURI) return ''
  if (tokenURI.startsWith('ipfs://')) {
    return tokenURI.replace('ipfs://', '')
  }
  const ipfsMatch = tokenURI.match(/ipfs\/([a-zA-Z0-9]+)/)
  return ipfsMatch ? ipfsMatch[1] : ''
}

export function SelectImage({ 
  mintedNFTs, 
  isLoading = false, 
  onImageSelect, 
  className = "" 
}: SelectImageProps) {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set())

  const mintedCIDs = useMemo(() => {
    return new Set(
      mintedNFTs
        .map(nft => extractCIDFromTokenURI(nft.tokenURI))
        .filter(cid => cid)
    )
  }, [mintedNFTs])

  const isImageAlreadyMinted = (image: CollectionImage): boolean => {
    return mintedCIDs.has(image.metadataCID)
  }

  useEffect(() => {
    const loadImagesSequentially = async () => {
      for (let i = 0; i < COLLECTION_IMAGES.length; i++) {
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

  const handleImageClick = (image: CollectionImage) => {
    console.log('Image cliquée:', image.name, 'CID Metadata:', image.metadataCID)
    
    if (isImageAlreadyMinted(image)) {
      console.log('⛔ Cette image est déjà mintée, clic ignoré')
      return
    }
    
    if (selectedImageId === image.id) {
      console.log('🔄 Désélection de', image.name)
      setSelectedImageId(null)
      if (onImageSelect) {
        onImageSelect('')
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
    <div className={className}>
      <div className="w-full space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Choose from your pre-uploaded Crypto Code Doodles collection
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            📊 {mintedNFTs.length}/{COLLECTION_IMAGES.length} already minted
          </p>
        </div>

        {/* SCROLLABLE CONTAINER - 4 images max visible (2 rows × 2 cols) */}
        <div className="h-[640px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COLLECTION_IMAGES.map((image, index) => (
              <ImageCard 
                key={image.id} 
                image={image} 
                isSelected={selectedImageId === image.id} 
                isAlreadyMinted={isImageAlreadyMinted(image)} 
                shouldLoad={imagesLoaded.has(image.id)} 
                priority={index === 0} 
                onClick={() => handleImageClick(image)} 
              />
            ))}
          </div>
        </div>

        {/* STATUS MESSAGES */}
        <div>
          {isLoading && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200">
                🔄 Chargement des NFTs mintés...
              </p>
            </div>
          )}

          {!isLoading && selectedImageId ? (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200">
                ✅ Image sélectionnée : {COLLECTION_IMAGES.find(img => img.id === selectedImageId)?.name}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                Cliquez à nouveau pour désélectionner
              </p>
            </div>
          ) : !isLoading && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                💡 Sélectionnez une image disponible pour remplir automatiquement les champs de mint
              </p>
            </div>
          )}
        </div>

        {imagesLoaded.size < COLLECTION_IMAGES.length && (
          <div className="text-center text-sm text-muted-foreground">
            Chargement des images... ({imagesLoaded.size}/{COLLECTION_IMAGES.length})
          </div>
        )}
      </div>
    </div>
  )
}

interface ImageCardProps {
  image: CollectionImage
  isSelected: boolean
  isAlreadyMinted: boolean
  shouldLoad: boolean
  priority?: boolean
  onClick: () => void
}

function ImageCard({ 
  image, 
  isSelected, 
  isAlreadyMinted, 
  shouldLoad, 
  priority = false, 
  onClick 
}: ImageCardProps) {
  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 ${
        isAlreadyMinted 
          ? 'opacity-50 cursor-not-allowed grayscale' 
          : 'cursor-pointer hover:shadow-lg hover:-translate-y-1'
      } ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}`} 
      onClick={onClick}
    >
      <div className="aspect-square relative">
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

        {isAlreadyMinted && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive">🔒 Minté</Badge>
          </div>
        )}

        {isSelected && !isAlreadyMinted && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-blue-500 text-white">✓ Sélectionné</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className={`font-semibold text-lg line-clamp-1 ${
            isAlreadyMinted ? 'text-muted-foreground' : ''
          }`}>
            {image.name}
            {isAlreadyMinted && <span className="ml-2 text-sm">(Minté)</span>}
          </h3>
          
          <p className={`text-sm line-clamp-2 ${
            isAlreadyMinted ? 'text-muted-foreground' : 'text-muted-foreground'
          }`}>
            {image.description}
          </p>

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {image.attributes.language}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {image.attributes.doodle}
            </Badge>
            {isAlreadyMinted && (
              <Badge variant="destructive" className="text-xs">
                Indisponible
              </Badge>
            )}
          </div>

          <div className={`pt-2 border-t ${
            isAlreadyMinted ? 'text-muted-foreground' : ''
          }`}>
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