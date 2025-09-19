// app/page.tsx - VERSION REFACTORISÉE ET SIMPLIFIÉE
'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Palette } from 'lucide-react'

// Layout components
import { Header } from '@/components/layout/Header'
import { HeroSection } from '@/components/layout/HeroSection'
import { NavigationTabs } from '@/components/layout/NavigationTabs'

// Section components
import { NFTGrid } from '@/components/nft/NFTGrid'
import { MintSection } from '@/components/sections/MintSection'
import { AdminSection } from '@/components/sections/AdminSection'

// Hooks
import { useCollectionInfo, useCurrentUserIsOwner } from '@/hooks'
import { usePageNavigation } from '@/hooks/usePageNavigation'

export default function Home() {
  const { isConnected } = useAccount()
  const isOwner = useCurrentUserIsOwner()
  const { collectionInfo } = useCollectionInfo()
  
  // Navigation state
  const navigation = usePageNavigation(isOwner)
  
  // Fix hydration
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Protection contre hydration - affichage minimal pendant mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {!isConnected ? (
        // Mode non connecté : Hero Section
        <HeroSection collectionInfo={collectionInfo} />
      ) : (
        // Mode connecté : Navigation + Sections
        <>
          <NavigationTabs {...navigation} />
          
          {/* Rendu conditionnel des sections */}
          {navigation.activeSection === 'collection' && (
            <NFTGrid 
              showMintButton={collectionInfo?.mintingActive}
              onMintClick={navigation.goToMint}
              onNFTClick={(tokenId) => {
                console.log('NFT clicked:', tokenId)
                // TODO: Modal de détails ou navigation vers page détail
              }}
            />
          )}
          
          {navigation.activeSection === 'mint' && (
            <MintSection isOwner={isOwner} />
          )}
          
          {navigation.activeSection === 'admin' && isOwner && (
            <AdminSection />
          )}
        </>
      )}
      
      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <Palette className="h-6 w-6 text-primary" />
              <span className="font-semibold">NFT Collection Viewer</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground">Documentation</a>
              <a href="#" className="hover:text-foreground">GitHub</a>
              <a href="#" className="hover:text-foreground">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}