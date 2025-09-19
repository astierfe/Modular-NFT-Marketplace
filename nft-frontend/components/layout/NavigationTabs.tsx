// ./nft-frontend/components/layout/NavigationTabs.tsx - Navigation pour utilisateurs connectés
'use client'

import { useState, useEffect } from 'react'
import { type PageSection, type NavigationActions, type NavigationState } from '@/hooks/usePageNavigation'

interface NavigationTabsProps extends NavigationState, NavigationActions {
  className?: string
}

export function NavigationTabs({ 
  activeSection, 
  canShowAdmin, 
  setActiveSection,
  className = "" 
}: NavigationTabsProps) {
  // Fix hydration
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Évite le mismatch hydration
  if (!mounted) return null

  const tabs = [
    {
      id: 'collection' as PageSection,
      label: 'Collection Explorer',
      description: 'Browse and explore NFTs'
    },
    {
      id: 'mint' as PageSection,
      label: 'Mint NFT',
      description: 'Create new NFTs'
    },
    ...(canShowAdmin ? [{
      id: 'admin' as PageSection,
      label: 'Admin Panel',
      description: 'Manage collection settings'
    }] : [])
  ]

  return (
    <div className={`sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
              title={tab.description}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}