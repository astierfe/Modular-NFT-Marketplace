'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { useCollectionInfo } from '@/hooks'
import { useState, useEffect } from 'react'
import {
  Menu,
  X,
  Settings,
  Palette,
  ExternalLink,
  MessageCircle,
} from 'lucide-react'
import { useCurrentUserIsOwner } from '@/hooks'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const isOwner = useCurrentUserIsOwner()
  const { collectionInfo } = useCollectionInfo()
  const chainId = useChainId()

  useEffect(() => {
    setMounted(true)
  }, [])

  const getNetworkInfo = (chainId: number) => {
    switch (chainId) {
      case 31337:
        return { name: 'Anvil', color: 'bg-gray-500', explorer: null }
      case 11155111:
        return {
          name: 'Sepolia',
          color: 'bg-blue-500',
          explorer: 'https://sepolia.etherscan.io',
        }
      case 1:
        return {
          name: 'Mainnet',
          color: 'bg-green-500',
          explorer: 'https://etherscan.io',
        }
      default:
        return { name: 'Unknown', color: 'bg-red-500', explorer: null }
    }
  }

  const networkInfo = getNetworkInfo(chainId)


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {collectionInfo?.name || 'NFT Collection'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {collectionInfo?.symbol || 'LOADING...'}
                </p>
              </div>
            </div>

            {collectionInfo && (
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">
                    {collectionInfo.totalSupply}
                  </span>
                  <span className="text-muted-foreground">
                    / {collectionInfo.maxSupply}
                  </span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">Floor:</span>
                  <span className="font-medium">
                    {collectionInfo.mintPrice} ETH
                  </span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center space-x-1">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      collectionInfo.mintingActive
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <span className="text-muted-foreground">
                    {collectionInfo.mintingActive
                      ? 'Minting Active'
                      : 'Minting Closed'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <nav className="hidden md:flex items-center space-x-6">

            {mounted && networkInfo.explorer && (
              <a
                href={networkInfo.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open Etherscan</span>
              </a>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {mounted ? (
              <div className="hidden sm:flex items-center space-x-2 rounded-md border px-3 py-1.5 text-sm">
                <div className={`h-2 w-2 rounded-full ${networkInfo.color}`} />
                <span>{networkInfo.name}</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 rounded-md border px-3 py-1.5 text-sm">
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
                <span>Loading...</span>
              </div>
            )}

            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted
                const connected = ready && account && chain
                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          >
                            Connect Wallet
                          </button>
                        )
                      }
                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                          >
                            Wrong network
                          </button>
                        )
                      }
                      return (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                              <span className="hidden sm:block">
                                {account.displayName}
                              </span>
                              <span className="sm:hidden">
                                {account.address?.slice(0, 6)}...
                              </span>
                            </div>
                          </button>
                          {isOwner && (
                            <div className="flex items-center space-x-1 rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              <Settings className="h-3 w-3" />
                              <span className="hidden sm:block">Owner</span>
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                )
              }}
            </ConnectButton.Custom>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {collectionInfo && (
                <div className="border-b border-border pb-3 mb-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Supply: </span>
                      <span className="font-medium">
                        {collectionInfo.totalSupply}/{collectionInfo.maxSupply}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price: </span>
                      <span className="font-medium">
                        {collectionInfo.mintPrice} ETH
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Network: </span>
                      <span className="font-medium">{networkInfo.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status: </span>
                      <span
                        className={`font-medium ${
                          collectionInfo.mintingActive
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {collectionInfo.mintingActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            
              {mounted && networkInfo.explorer && (
                <a
                  href={networkInfo.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Etherscan</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}