// lib/types/contractTypes.ts - Types centralisés et corrigés
import { type Address } from 'viem'

// Types corrects pour wagmi v2
export interface MintParams {
  to: `0x${string}`
  tokenURI: string
  royaltyRecipient: `0x${string}`
  royaltyPercentage: bigint  // ← BIGINT corrigé
}

export interface CollectionInfo {
  name: string
  symbol: string
  totalSupply: number
  maxSupply: number
  mintPrice: string
  mintPriceWei: bigint
  mintingActive: boolean
  baseURI: string
  progress: number
}

export interface TokenInfo {
  tokenId: number
  owner: Address
  tokenURI: string
  royaltyRecipient: Address
  royaltyPercentage: number
}

export interface CollectionStats {
  totalSupply: number
  maxSupply: number
  remaining: number
  progress: number
  mintPrice: string
  soldOut: boolean
  mintingActive: boolean
}

// Utilitaires de conversion
export const contractUtils = {
  // Convertir percentage en basis points bigint
  percentageToBasisPoints: (percentage: number): bigint => {
    return BigInt(Math.floor(percentage * 100))
  },
  
  // Convertir basis points vers percentage
  basisPointsToPercentage: (basisPoints: bigint): number => {
    return Number(basisPoints) / 100
  },
  
  // Valider adresse format strict
  validateAddress: (address: string): `0x${string}` => {
    if (!address.startsWith('0x') || address.length !== 42) {
      throw new Error('Invalid address format')
    }
    return address as `0x${string}`
  },
  
  // Créer MintParams avec types corrects
  createMintParams: (
    to: string,
    tokenURI: string,
    royaltyRecipient?: string,
    royaltyPercentage?: number
  ): MintParams => {
    return {
      to: contractUtils.validateAddress(to),
      tokenURI,
      royaltyRecipient: contractUtils.validateAddress(royaltyRecipient || to),
      royaltyPercentage: royaltyPercentage 
        ? contractUtils.percentageToBasisPoints(royaltyPercentage)
        : BigInt(0)
    }
  }
}