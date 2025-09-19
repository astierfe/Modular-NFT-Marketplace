// ./nft-frontend/components/layout/HeroSection.tsx - Landing page pour utilisateurs non connectés
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Palette, 
  Wallet, 
  Shield, 
  Globe, 
  Users,
  ExternalLink
} from 'lucide-react'
import { type CollectionInfo } from '@/hooks'

interface HeroSectionProps {
  collectionInfo?: CollectionInfo | null
  className?: string
}

export function HeroSection({ collectionInfo, className = "" }: HeroSectionProps) {
  // Fix hydration
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 ${className}`}>
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            Web3 NFT Collection
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {collectionInfo?.name || 'NFT Collection Viewer'}
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore, mint, and manage your NFT collection on Ethereum. Built with modern Web3 technologies 
            for the best user experience.
          </p>
          
          {/* Call to action - FIX HYDRATION */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!mounted ? (
              <Button size="lg" disabled className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3">
                <Wallet className="mr-2 h-5 w-5" />
                Loading...
              </Button>
            ) : (
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet to Start
              </Button>
            )}
            
            <Button variant="outline" size="lg" className="px-8 py-3">
              <Globe className="mr-2 h-5 w-5" />
              View on OpenSea
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Unique Digital Art</CardTitle>
              <CardDescription>
                Each NFT is a unique piece of digital art with verified ownership and provenance on the blockchain.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Secure & Decentralized</CardTitle>
              <CardDescription>
                Built on Ethereum with smart contracts audited for security. Your NFTs are truly owned by you.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Join a growing community of collectors and creators. Trade, showcase, and discover amazing NFTs.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Stats */}
        {collectionInfo && (
          <div className="mt-16 p-8 rounded-2xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {collectionInfo.totalSupply}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Total Minted</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {collectionInfo.maxSupply}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Max Supply</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {collectionInfo.mintPrice} ETH
                </div>
                <div className="text-gray-600 dark:text-gray-400">Mint Price</div>
              </div>
              <div>
                <div className={`text-3xl font-bold ${collectionInfo.mintingActive ? 'text-green-600' : 'text-red-600'}`}>
                  {collectionInfo.mintingActive ? 'LIVE' : 'CLOSED'}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Minting Status</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}