// ./nft-frontend/components/sections/AdminSection.tsx - Panel d'administration
'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAdminInterface } from '@/hooks/useAdminInterface'

interface AdminSectionProps {
  className?: string
}

export function AdminSection({ className = "" }: AdminSectionProps) {
  const {
    formState,
    status,
    collectionInfo,
    validation,
    setNewMintPrice,
    setNewMaxSupply,
    setNewRoyaltyPercentage,
    setNewRoyaltyRecipient,
    handleToggleMinting,
    handleUpdatePrice,
    handleUpdateMaxSupply,
    handleUpdateRoyalty,
    handleWithdraw,
  } = useAdminInterface()

  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Admin Panel</h2>
          <p className="text-muted-foreground">
            Manage your NFT collection settings and configuration.
          </p>
        </div>

        {/* Messages d'état */}
        {status.isProcessing && (
          <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200">Transaction en cours...</p>
          </div>
        )}

        {status.isConfirming && (
          <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-yellow-800 dark:text-yellow-200">Attente de confirmation...</p>
          </div>
        )}

        {status.isSuccess && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-200">Transaction confirmée ! Interface mise à jour...</p>
          </div>
        )}

        {status.error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200">
              Erreur : {status.error}
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
                    value={formState.newMintPrice}
                    onChange={(e) => setNewMintPrice(e.target.value)}
                    placeholder={collectionInfo?.mintPrice}
                    className="flex-1 p-3 border rounded-md bg-background"
                    disabled={status.isProcessing}
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleUpdatePrice}
                    disabled={!validation.canUpdatePrice}
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
                    value={formState.newMaxSupply}
                    onChange={(e) => setNewMaxSupply(e.target.value)}
                    placeholder={collectionInfo?.maxSupply.toString()}
                    className="flex-1 p-3 border rounded-md bg-background"
                    disabled={status.isProcessing}
                  />
                  <Button 
                    variant="outline"
                    onClick={handleUpdateMaxSupply}
                    disabled={!validation.canUpdateMaxSupply}
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
                  disabled={!status.canToggleMinting || status.isProcessing}
                >
                  {status.isProcessing 
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
                    value={formState.newRoyaltyPercentage}
                    onChange={(e) => setNewRoyaltyPercentage(e.target.value)}
                    placeholder="5.0"
                    className="flex-1 p-3 border rounded-md bg-background"
                    disabled={status.isProcessing}
                  />
                  <Button 
                    variant="outline"
                    onClick={handleUpdateRoyalty}
                    disabled={!validation.canUpdateRoyalty}
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
                    value={formState.newRoyaltyRecipient}
                    onChange={(e) => setNewRoyaltyRecipient(e.target.value)}
                    placeholder="0x..."
                    className="flex-1 p-3 border rounded-md bg-background"
                    disabled={status.isProcessing}
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
                disabled={status.isProcessing}
              >
                {status.isProcessing ? 'Processing...' : 'Withdraw Funds'}
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