// ./nft-frontend/hooks/usePageNavigation.ts - Hook pour navigation entre sections
'use client'

import { useState, useCallback } from 'react'

export type PageSection = 'collection' | 'mint' | 'admin'

export interface NavigationState {
  activeSection: PageSection
  canShowAdmin: boolean
}

export interface NavigationActions {
  setActiveSection: (section: PageSection) => void
  goToCollection: () => void
  goToMint: () => void
  goToAdmin: () => void
}

export function usePageNavigation(isOwner: boolean = false) {
  const [activeSection, setActiveSection] = useState<PageSection>('collection')

  const actions: NavigationActions = {
    setActiveSection: useCallback((section: PageSection) => {
      // Empêcher l'accès admin si pas owner
      if (section === 'admin' && !isOwner) {
        console.warn('Access to admin section denied: user is not owner')
        return
      }
      setActiveSection(section)
    }, [isOwner]),

    goToCollection: useCallback(() => {
      setActiveSection('collection')
    }, []),

    goToMint: useCallback(() => {
      setActiveSection('mint')
    }, []),

    goToAdmin: useCallback(() => {
      if (isOwner) {
        setActiveSection('admin')
      }
    }, [isOwner]),
  }

  const state: NavigationState = {
    activeSection,
    canShowAdmin: isOwner,
  }

  return {
    ...state,
    ...actions,
  }
}