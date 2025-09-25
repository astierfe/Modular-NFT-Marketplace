// ./nft-frontend/components/ui/OptimizedIPFSImage.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface OptimizedIPFSImageProps {
  cid: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  onError?: () => void
}

// Gateways IPFS multiples en fallback
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/',
]

export function OptimizedIPFSImage({ 
  cid, 
  alt, 
  className, 
  sizes = "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
  onError 
}: OptimizedIPFSImageProps) {
  const [currentGatewayIndex, setCurrentGatewayIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // URL avec gateway actuel
  const imageUrl = IPFS_GATEWAYS[currentGatewayIndex] + cid

  const handleImageError = () => {
    console.error(`Erreur gateway ${IPFS_GATEWAYS[currentGatewayIndex]} pour CID: ${cid}`)
    
    // Essayer le gateway suivant
    if (currentGatewayIndex < IPFS_GATEWAYS.length - 1) {
      console.log(`Tentative gateway suivant: ${IPFS_GATEWAYS[currentGatewayIndex + 1]}`)
      setCurrentGatewayIndex(prev => prev + 1)
      setIsLoading(true)
    } else {
      // Tous les gateways ont échoué
      console.error(`Tous les gateways ont échoué pour CID: ${cid}`)
      setImageError(true)
      setIsLoading(false)
      onError?.()
    }
  }

  const handleImageLoad = () => {
    setIsLoading(false)
    console.log(`✅ Image chargée via ${IPFS_GATEWAYS[currentGatewayIndex]}: ${cid}`)
  }

  // Reset si le CID change
  useEffect(() => {
    setCurrentGatewayIndex(0)
    setImageError(false)
    setIsLoading(true)
  }, [cid])

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center p-4">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-xs text-muted-foreground">Image indisponible</p>
          <p className="text-xs text-muted-foreground font-mono">{cid.slice(0, 12)}...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
          <div className="text-2xl">⏳</div>
        </div>
      )}
      
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  )
}