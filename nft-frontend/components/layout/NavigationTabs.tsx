'use client'

import { useState, useEffect } from 'react'

type PageSection = 'collection' | 'mint' | 'admin'

interface NavigationTabsProps {
  activeSection: PageSection
  canShowAdmin: boolean
  setActiveSection: (section: PageSection) => void
  className?: string
}

export function NavigationTabs({ 
  activeSection, 
  canShowAdmin, 
  setActiveSection,
  className = "" 
}: NavigationTabsProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // DEBUG
  useEffect(() => {
    console.log('NavigationTabs Debug:', { activeSection, canShowAdmin, mounted })
  }, [activeSection, canShowAdmin, mounted])

  if (!mounted) return null

  const tabs = [
    { id: 'collection' as PageSection, label: 'Collection' },
    { id: 'mint' as PageSection, label: 'Mint NFT' },
    ...(canShowAdmin ? [{ id: 'admin' as PageSection, label: 'Admin' }] : [])
  ]

  console.log('NavigationTabs: Rendering tabs:', tabs.map(t => t.id))

  return (
    <div className={`sticky top-16 z-40 bg-background/95 backdrop-blur border-b ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}