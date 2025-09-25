// ./nft-frontend/components/sections/MintSection.tsx - Interface de minting
'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Zap } from 'lucide-react'
import { useMintingInterface } from '@/hooks/useMintingInterface'
import { SelectImage } from '@/components/sections/SelectImage'


interface MintSectionProps {
  isOwner: boolean
  className?: string
}

export function MintSection({ isOwner, className = "" }: MintSectionProps) {
  const {
    formState,
    status,
    collectionInfo,
    setPublicTokenURI,
    setOwnerRecipient,
    setOwnerTokenURI,
    handlePublicMint,
    handleOwnerMint,
  } = useMintingInterface(isOwner)

 
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Mint Your NFT</h2>
          <p className="text-muted-foreground">
            Create your unique digital collectible on the Ethereum blockchain.
          </p>
        </div>

        {/* Messages d'état */}
        {(status.publicMintSuccess || status.ownerMintSuccess) && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-200">
              ✅ NFT minted successfully! Refreshing collection data...
            </p>
          </div>
        )}

        {(status.publicMintError || status.ownerMintError) && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200">
              ❌ Error: {status.publicMintError || status.ownerMintError}
            </p>
          </div>
        )}

        {/* Section de sélection d'image */}
        <SelectImage 
          onImageSelect={(metadataCID) => {
            console.log('✅ Image sélectionnée, CID:', metadataCID)
            setPublicTokenURI(`ipfs://${metadataCID}`)
            setOwnerTokenURI(`ipfs://${metadataCID}`)
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
              Minting Interface
            </CardTitle>
            <CardDescription>
              {status.canPublicMint 
                ? `Minting is currently active. Price: ${collectionInfo?.mintPrice} ETH`
                : 'Minting is currently disabled by the collection owner.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status.canPublicMint ? (
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
                      <div className="font-semibold">{collectionInfo?.mintPrice} ETH</div>
                      <div className="text-sm text-muted-foreground">
                        {collectionInfo ? collectionInfo.maxSupply - collectionInfo.totalSupply : 0} remaining
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Token URI (IPFS)</label>
                      <input
                        type="text"
                        placeholder="ipfs://QmYourMetadataHash..."
                        value={formState.publicTokenURI}
                        onChange={(e) => setPublicTokenURI(e.target.value)}
                        className="w-full p-3 border rounded-md bg-background"
                        disabled={status.publicMinting}
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
                        !status.canPublicMint || 
                        !formState.publicTokenURI || 
                        status.publicMinting
                      }
                    >
                      {status.publicMinting 
                        ? 'Processing...' 
                        : `Mint NFT for ${collectionInfo?.mintPrice} ETH`
                      }
                    </Button>
                  </div>
                </div>

                {/* Owner Mint Interface (si owner) */}
                {status.canOwnerMint && (
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
                            placeholder="0x..."
                            value={formState.ownerRecipient}
                            onChange={(e) => setOwnerRecipient(e.target.value)}
                            className="w-full p-3 border rounded-md bg-background"
                            disabled={status.ownerMinting}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Token URI</label>
                          <input
                            type="text"
                            placeholder="ipfs://QmHash..."
                            value={formState.ownerTokenURI}
                            onChange={(e) => setOwnerTokenURI(e.target.value)}
                            className="w-full p-3 border rounded-md bg-background"
                            disabled={status.ownerMinting}
                          />
                        </div>
                      </div>

                      <Button 
                        size="lg" 
                        variant="secondary"
                        className="w-full"
                        onClick={handleOwnerMint}
                        disabled={
                          !formState.ownerRecipient || 
                          !formState.ownerTokenURI || 
                          status.ownerMinting
                        }
                      >
                        {status.ownerMinting 
                          ? 'Processing...' 
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