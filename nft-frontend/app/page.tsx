// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Header } from '@/components/layout/Header'
import { NFTGrid } from '@/components/nft/NFTGrid'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Palette, 
  Wallet, 
  Zap, 
  Shield, 
  Globe, 
  Users,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import { useCollectionInfo, useIsOwner, useAdminFunctions, usePublicMint, useOwnerMint } from '@/hooks/useModularNFT'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { isOwner } = useIsOwner()
  const { collectionInfo } = useCollectionInfo()
  const [activeSection, setActiveSection] = useState<'collection' | 'mint' | 'admin'>('collection')

  // Section Hero pour les utilisateurs non connectés
  const HeroSection = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
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
          
          {/* Call to action */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet to Start
            </Button>
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

  // Navigation pour utilisateurs connectés
  const NavigationTabs = () => (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveSection('collection')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeSection === 'collection'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            Collection Explorer
          </button>
          <button
            onClick={() => setActiveSection('mint')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeSection === 'mint'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            Mint NFT
          </button>
          {isOwner && (
            <button
              onClick={() => setActiveSection('admin')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'admin'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              Admin Panel
            </button>
          )}
        </div>
      </div>
    </div>
  )

  // Section Collection
  const CollectionSection = () => (
    <div className="container mx-auto px-4 py-8">
      <NFTGrid 
        showMintButton={collectionInfo?.mintingActive}
        onMintClick={() => setActiveSection('mint')}
        onNFTClick={(tokenId) => {
          console.log('NFT clicked:', tokenId)
          // TODO: Ouvrir modal de détails ou naviguer vers page détail
        }}
      />
    </div>
  )

  // Section Mint CORRIGÉE avec les onClick
  const MintSection = () => {
    // États locaux pour les formulaires
    const [publicTokenURI, setPublicTokenURI] = useState('')
    const [ownerRecipient, setOwnerRecipient] = useState(address || '')
    const [ownerTokenURI, setOwnerTokenURI] = useState('')
    
    // Hooks de minting
    const { 
      mint: publicMint, 
      isPending: isPublicMintPending, 
      isConfirming: isPublicMintConfirming,
      isConfirmed: isPublicMintConfirmed,
      error: publicMintError 
    } = usePublicMint()
    
    const { 
      mint: ownerMint, 
      isPending: isOwnerMintPending,
      isConfirming: isOwnerMintConfirming, 
      isConfirmed: isOwnerMintConfirmed,
      error: ownerMintError 
    } = useOwnerMint()

    // Handlers pour les boutons
    const handlePublicMint = () => {
      if (!publicTokenURI) {
        alert('Please enter a token URI')
        return
      }
      if (!collectionInfo?.mintPrice) {
        alert('Mint price not available')
        return
      }
      publicMint(publicTokenURI, collectionInfo.mintPrice)
    }

    const handleOwnerMint = () => {
      if (!ownerRecipient) {
        alert('Please enter a recipient address')
        return
      }
      if (!ownerTokenURI) {
        alert('Please enter a token URI')
        return
      }
      ownerMint(ownerRecipient as `0x${string}`, ownerTokenURI)
    }

    // Auto-reset après confirmation
    useEffect(() => {
      if (isPublicMintConfirmed) {
        setPublicTokenURI('')
      }
    }, [isPublicMintConfirmed])

    useEffect(() => {
      if (isOwnerMintConfirmed) {
        setOwnerRecipient(address || '')
        setOwnerTokenURI('')
      }
    }, [isOwnerMintConfirmed, address])

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Mint Your NFT</h2>
            <p className="text-muted-foreground">
              Create your unique digital collectible on the Ethereum blockchain.
            </p>
          </div>

          {/* Messages d'état */}
          {(isPublicMintConfirmed || isOwnerMintConfirmed) && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200">
                ✅ NFT minted successfully!
              </p>
            </div>
          )}

          {(publicMintError || ownerMintError) && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200">
                ❌ Error: {(publicMintError || ownerMintError)?.message}
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                Minting Interface
              </CardTitle>
              <CardDescription>
                {collectionInfo?.mintingActive 
                  ? `Minting is currently active. Price: ${collectionInfo.mintPrice} ETH`
                  : 'Minting is currently disabled by the collection owner.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {collectionInfo?.mintingActive ? (
                <>
                  {/* Public Mint Interface */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-semibold">Public Mint</h4>
                        <p className="text-sm text-muted-foreground">
                          Mint with your own metadata
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{collectionInfo.mintPrice} ETH</div>
                        <div className="text-sm text-muted-foreground">
                          {collectionInfo.maxSupply - collectionInfo.totalSupply} remaining
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Token URI (IPFS)</label>
                        <input
                          type="text"
                          placeholder="ipfs://QmYourMetadataHash..."
                          value={publicTokenURI}
                          onChange={(e) => setPublicTokenURI(e.target.value)}
                          className="w-full p-3 border rounded-md bg-background"
                          disabled={isPublicMintPending || isPublicMintConfirming}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter the IPFS hash of your NFT metadata JSON file
                        </p>
                      </div>

                      <Button 
                        size="lg" 
                        className="w-full"
                        onClick={handlePublicMint}
                        disabled={
                          !collectionInfo.mintingActive || 
                          !publicTokenURI || 
                          isPublicMintPending || 
                          isPublicMintConfirming
                        }
                      >
                        {isPublicMintPending 
                          ? 'Preparing Transaction...' 
                          : isPublicMintConfirming 
                            ? 'Confirming...' 
                            : `Mint NFT for ${collectionInfo.mintPrice} ETH`
                        }
                      </Button>
                    </div>
                  </div>

                  {/* Owner Mint Interface (si owner) */}
                  {isOwner && (
                    <div className="border-t pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <div>
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                              Owner Mint (Free)
                            </h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              As the contract owner, you can mint for free
                            </p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Owner Only
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Recipient Address</label>
                            <input
                              type="text"
                              placeholder={address || "0x..."}
                              value={ownerRecipient}
                              onChange={(e) => setOwnerRecipient(e.target.value)}
                              className="w-full p-3 border rounded-md bg-background"
                              disabled={isOwnerMintPending || isOwnerMintConfirming}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Token URI</label>
                            <input
                              type="text"
                              placeholder="ipfs://QmHash..."
                              value={ownerTokenURI}
                              onChange={(e) => setOwnerTokenURI(e.target.value)}
                              className="w-full p-3 border rounded-md bg-background"
                              disabled={isOwnerMintPending || isOwnerMintConfirming}
                            />
                          </div>
                        </div>

                        <Button 
                          size="lg" 
                          variant="secondary"
                          className="w-full"
                          onClick={handleOwnerMint}
                          disabled={
                            !ownerRecipient || 
                            !ownerTokenURI || 
                            isOwnerMintPending || 
                            isOwnerMintConfirming
                          }
                        >
                          {isOwnerMintPending 
                            ? 'Preparing Transaction...' 
                            : isOwnerMintConfirming 
                              ? 'Confirming...' 
                              : 'Owner Mint (Free)'
                          }
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Minting Disabled</h3>
                  <p className="text-muted-foreground">
                    The collection owner has disabled public minting. 
                    {isOwner && ' You can enable it in the Admin Panel.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Section Admin complète avec hooks connectés
  const AdminSection = () => {
    if (!isOwner) return null

    // Import des hooks admin
    const { 
      setMintingActive, 
      setMintPrice, 
      setMaxSupply, 
      setDefaultRoyalty,
      withdraw,
      isPending, 
      isConfirming, 
      isConfirmed,
      error 
    } = useAdminFunctions()

    // États locaux pour les formulaires
    const [newMintPrice, setNewMintPrice] = useState('')
    const [newMaxSupply, setNewMaxSupply] = useState('')
    const [newRoyaltyPercentage, setNewRoyaltyPercentage] = useState('')
    const [newRoyaltyRecipient, setNewRoyaltyRecipient] = useState('')

    // Handler pour le toggle minting
    const handleToggleMinting = () => {
      if (collectionInfo) {
        setMintingActive(!collectionInfo.mintingActive)
      }
    }

    // Handler pour mettre à jour le prix
    const handleUpdatePrice = () => {
      if (newMintPrice) {
        setMintPrice(newMintPrice)
        setNewMintPrice('')
      }
    }

    // Handler pour mettre à jour max supply
    const handleUpdateMaxSupply = () => {
      if (newMaxSupply) {
        setMaxSupply(parseInt(newMaxSupply))
        setNewMaxSupply('')
      }
    }

    // Handler pour mettre à jour royalties
    const handleUpdateRoyalty = () => {
      if (newRoyaltyRecipient && newRoyaltyPercentage && address) {
        setDefaultRoyalty(
          newRoyaltyRecipient as `0x${string}`, 
          parseFloat(newRoyaltyPercentage)
        )
        setNewRoyaltyPercentage('')
        setNewRoyaltyRecipient('')
      }
    }

    // Handler pour withdraw
    const handleWithdraw = () => {
      withdraw()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Admin Panel</h2>
            <p className="text-muted-foreground">
              Manage your NFT collection settings and configuration.
            </p>
          </div>

          {/* Messages d'état */}
          {isPending && (
            <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200">Transaction en cours...</p>
            </div>
          )}

          {isConfirming && (
            <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200">Attente de confirmation...</p>
            </div>
          )}

          {isConfirmed && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200">Transaction confirmée !</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200">
                Erreur : {error.message || 'Transaction échouée'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Collection Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Collection Settings</CardTitle>
                <CardDescription>
                  Basic configuration for your NFT collection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Mint Price (ETH)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="0.001"
                      value={newMintPrice}
                      onChange={(e) => setNewMintPrice(e.target.value)}
                      placeholder={collectionInfo?.mintPrice}
                      className="flex-1 p-3 border rounded-md bg-background"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleUpdatePrice}
                      disabled={isPending || !newMintPrice}
                    >
                      Update
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Max Supply</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={newMaxSupply}
                      onChange={(e) => setNewMaxSupply(e.target.value)}
                      placeholder={collectionInfo?.maxSupply.toString()}
                      className="flex-1 p-3 border rounded-md bg-background"
                    />
                    <Button 
                      variant="outline"
                      onClick={handleUpdateMaxSupply}
                      disabled={isPending || !newMaxSupply}
                    >
                      Reduce
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Can only be reduced, not increased
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Public Minting</div>
                    <div className="text-sm text-muted-foreground">
                      Allow public minting of NFTs
                    </div>
                  </div>
                  <Button 
                    variant={collectionInfo?.mintingActive ? "destructive" : "default"}
                    size="sm"
                    onClick={handleToggleMinting}
                    disabled={isPending}
                  >
                    {isPending 
                      ? 'Processing...' 
                      : collectionInfo?.mintingActive 
                        ? 'Disable' 
                        : 'Enable'
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Royalties Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Royalties Settings</CardTitle>
                <CardDescription>
                  Configure royalty payments for secondary sales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Default Royalty (%)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={newRoyaltyPercentage}
                      onChange={(e) => setNewRoyaltyPercentage(e.target.value)}
                      placeholder="5.0"
                      className="flex-1 p-3 border rounded-md bg-background"
                    />
                    <Button 
                      variant="outline"
                      onClick={handleUpdateRoyalty}
                      disabled={isPending || !newRoyaltyPercentage || !newRoyaltyRecipient}
                    >
                      Update
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum 10% royalty allowed
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Royalty Recipient</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newRoyaltyRecipient}
                      onChange={(e) => setNewRoyaltyRecipient(e.target.value)}
                      placeholder={address || "0x..."}
                      className="flex-1 p-3 border rounded-md bg-background"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Management */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Management</CardTitle>
                <CardDescription>
                  Manage contract funds and earnings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Contract Balance</span>
                    <span className="text-xl font-bold">0.0 ETH</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Available for withdrawal
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleWithdraw}
                  disabled={isPending}
                >
                  {isPending ? 'Processing...' : 'Withdraw Funds'}
                </Button>

                <div className="text-center">
                  <Button variant="destructive" size="sm" disabled>
                    Emergency Withdraw
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use only in emergencies
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* IPFS Settings */}
            <Card>
              <CardHeader>
                <CardTitle>IPFS Settings</CardTitle>
                <CardDescription>
                  Configure metadata and image hosting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Base URI</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder={collectionInfo?.baseURI}
                      className="flex-1 p-3 border rounded-md bg-background"
                      disabled
                    />
                    <Button variant="outline" disabled>
                      Update
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    Test IPFS Gateway
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">
                    Gateway Status: 🟢 Online
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {!isConnected ? (
        <HeroSection />
      ) : (
        <>
          <NavigationTabs />
          
          {activeSection === 'collection' && <CollectionSection />}
          {activeSection === 'mint' && <MintSection />}
          {activeSection === 'admin' && <AdminSection />}
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