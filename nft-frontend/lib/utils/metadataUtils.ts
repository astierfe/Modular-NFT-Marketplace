// ./nft-frontend/lib/utils/metadataUtils.ts - VERSION COMPLÈTE CORRIGÉE
import { type Address } from 'viem'

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string
    display_type?: string
  }>
  external_url?: string
  animation_url?: string
}

export interface NFTWithMetadata {
  tokenId: number
  owner: string
  tokenURI: string
  royaltyRecipient: string
  royaltyPercentage: number
  metadata?: NFTMetadata
}

export interface ContractCallParams {
  contractAddress: Address
  tokenId: number
}

// Utilitaires pour fetch métadonnées IPFS
export const metadataUtils = {
  // Convertir IPFS URI vers HTTP gateway
  ipfsToHttp: (ipfsUri: string): string => {
    if (!ipfsUri.startsWith('ipfs://')) {
      return ipfsUri
    }
    const hash = ipfsUri.replace('ipfs://', '')
    return `https://ipfs.io/ipfs/${hash}`
  },

  // Fetch métadonnées depuis IPFS avec retry
  fetchMetadata: async (tokenURI: string, retries = 2): Promise<NFTMetadata | null> => {
    try {
      console.log('Fetching metadata from:', tokenURI)
      
      if (!tokenURI || !tokenURI.startsWith('ipfs://')) {
        console.error('Invalid IPFS URI:', tokenURI)
        return null
      }
      
      const httpUrl = metadataUtils.ipfsToHttp(tokenURI)
      console.log('HTTP URL:', httpUrl)
      
      const response = await fetch(httpUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const metadata = await response.json()
      console.log('Metadata loaded:', metadata)
      return metadata
    } catch (error) {
      console.error('Error fetching metadata:', error)
      
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`)
        return metadataUtils.fetchMetadata(tokenURI, retries - 1)
      }
      
      return null
    }
  },

  // Créer métadonnées par défaut
  createDefaultMetadata: (tokenId: number, tokenURI: string): NFTMetadata => ({
    name: `Token #${tokenId}`,
    description: `NFT Token #${tokenId} from the collection`,
    image: tokenURI.startsWith('ipfs://') ? tokenURI : 'https://via.placeholder.com/400x400?text=NFT',
    attributes: []
  }),

  // Décoder URI depuis réponse hex de contract call
  decodeTokenURI: (hexResponse: string): string => {
    try {
      if (!hexResponse || hexResponse === '0x') {
        return ''
      }

      const hexString = hexResponse.slice(2) // enlever 0x
      
      // Décoder la string ABI-encoded
      // Format: offset(32 bytes) + length(32 bytes) + data
      const lengthHex = hexString.slice(64, 128) // 2ème chunk = length
      const length = parseInt(lengthHex, 16)
      
      if (length === 0) {
        return ''
      }

      const dataHex = hexString.slice(128, 128 + (length * 2)) // data chunk
      let tokenURI = Buffer.from(dataHex, 'hex').toString('utf8')
      
      // Nettoyer l'URI
      tokenURI = tokenURI.replace(/\0/g, '').replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim()
      
      // Corriger les URIs malformés
      if (tokenURI.includes('ipfs://') && !tokenURI.startsWith('ipfs://')) {
        const ipfsMatch = tokenURI.match(/ipfs:\/\/[a-zA-Z0-9]+/)
        if (ipfsMatch) {
          tokenURI = ipfsMatch[0]
        }
      }
      
      return tokenURI
    } catch (error) {
      console.error('Error decoding URI:', error)
      return ''
    }
  },

  // ✨ NOUVEAU : Décoder royaltyInfo response
  decodeRoyaltyInfo: (hexResponse: string): { recipient: string, percentage: number } => {
    try {
      if (!hexResponse || hexResponse === '0x') {
        return { recipient: '0x0000000000000000000000000000000000000000', percentage: 0 }
      }

      const hexString = hexResponse.slice(2)
      
      // Format de retour: (address, uint256)
      // address = 32 bytes (20 bytes address padded à gauche)
      // uint256 = 32 bytes
      
      const recipientHex = hexString.slice(24, 64) // Extraire l'address (skip padding)
      const amountHex = hexString.slice(64, 128)    // Extraire le montant
      
      const recipient = '0x' + recipientHex
      const amount = parseInt(amountHex, 16)
      
      // Convertir amount (sur 10000) en pourcentage
      // Si royaltyInfo(tokenId, 10000) retourne 250, c'est 2.5%
      const percentage = amount / 100
      
      return { recipient, percentage }
    } catch (error) {
      console.error('Error decoding royalty info:', error)
      return { recipient: '0x0000000000000000000000000000000000000000', percentage: 0 }
    }
  },

  // Faire un appel RPC vers le contrat (version améliorée)
  contractCall: async (
    rpcUrl: string,
    contractAddress: Address,
    functionSignature: string,
    ...params: (number | string)[]
  ): Promise<string> => {
    // Encoder les paramètres
    let data = functionSignature
    for (const param of params) {
      if (typeof param === 'number') {
        data += param.toString(16).padStart(64, '0')
      } else if (typeof param === 'string') {
        data += param.replace('0x', '').padStart(64, '0')
      }
    }
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [{
          to: contractAddress,
          data
        }, 'latest'],
        id: 1
      })
    })
    
    const result = await response.json()
    if (result.error) {
      throw new Error(result.error.message || 'Contract call failed')
    }
    
    return result.result
  },

  // ✨ NOUVEAU : Récupérer les vraies royalties depuis le contrat
  getRoyaltyInfo: async (
    rpcUrl: string,
    contractAddress: Address,
    tokenId: number
  ): Promise<{ recipient: string, percentage: number }> => {
    try {
      console.log(`Fetching royalty info for token ${tokenId}`)
      
      // royaltyInfo(uint256 tokenId, uint256 salePrice) returns (address, uint256)
      // On utilise 10000 comme salePrice pour avoir les basis points directement
      const result = await metadataUtils.contractCall(
        rpcUrl,
        contractAddress,
        '0x2a55205a', // royaltyInfo(uint256,uint256)
        tokenId,
        10000
      )
      
      const royaltyInfo = metadataUtils.decodeRoyaltyInfo(result)
      console.log(`Royalty info for token ${tokenId}:`, royaltyInfo)
      
      return royaltyInfo
    } catch (error) {
      console.error(`Error fetching royalty info for token ${tokenId}:`, error)
      return { recipient: '0x0000000000000000000000000000000000000000', percentage: 0 }
    }
  },

  // Charger les informations d'un token spécifique (VERSION CORRIGÉE)
  loadTokenInfo: async (
    rpcUrl: string,
    contractAddress: Address,
    tokenId: number
  ): Promise<NFTWithMetadata | null> => {
    try {
      console.log('Loading token', tokenId)
      
      // Récupérer owner
      const ownerResult = await metadataUtils.contractCall(
        rpcUrl,
        contractAddress,
        '0x6352211e', // ownerOf(uint256)
        tokenId
      )
      
      if (!ownerResult || ownerResult === '0x') {
        console.log(`Token ${tokenId} does not exist`)
        return null
      }
      
      const owner = '0x' + ownerResult.slice(-40)
      
      // Récupérer tokenURI
      const uriResult = await metadataUtils.contractCall(
        rpcUrl,
        contractAddress,
        '0xc87b56dd', // tokenURI(uint256)
        tokenId
      )
      
      let tokenURI = ''
      if (uriResult && uriResult !== '0x') {
        tokenURI = metadataUtils.decodeTokenURI(uriResult)
      }
      
      if (!tokenURI) {
        tokenURI = `ipfs://placeholder-${tokenId}`
      }

      // ✨ CORRECTION: Récupérer les VRAIES royalties depuis le contrat
      const royaltyInfo = await metadataUtils.getRoyaltyInfo(rpcUrl, contractAddress, tokenId)

      const nft: NFTWithMetadata = {
        tokenId,
        owner,
        tokenURI,
        royaltyRecipient: royaltyInfo.recipient, // ✅ Vraie valeur du contrat
        royaltyPercentage: royaltyInfo.percentage, // ✅ Vraie valeur du contrat
      }

      // Charger métadonnées IPFS
      if (tokenURI.startsWith('ipfs://')) {
        const metadata = await metadataUtils.fetchMetadata(tokenURI)
        nft.metadata = metadata || metadataUtils.createDefaultMetadata(tokenId, tokenURI)
      } else {
        nft.metadata = metadataUtils.createDefaultMetadata(tokenId, tokenURI)
      }

      console.log('Loaded token info:', nft)
      return nft
      
    } catch (error) {
      console.error(`Error loading token ${tokenId}:`, error)
      return null
    }
  },

  // Charger tous les tokens d'une collection
  loadAllTokens: async (
    rpcUrl: string,
    contractAddress: Address,
    totalSupply: number
  ): Promise<NFTWithMetadata[]> => {
    console.log('Loading all tokens, total supply:', totalSupply)
    
    const nfts: NFTWithMetadata[] = []
    const batchSize = 5 // Traiter par lots pour éviter de surcharger
    
    for (let i = 0; i < totalSupply; i += batchSize) {
      const batch = []
      
      for (let j = i; j < Math.min(i + batchSize, totalSupply); j++) {
        const tokenId = j + 1 // Les tokens commencent à 1
        batch.push(metadataUtils.loadTokenInfo(rpcUrl, contractAddress, tokenId))
      }
      
      const results = await Promise.allSettled(batch)
      
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          nfts.push(result.value)
        }
      })
      
      // Petite pause entre les batches
      if (i + batchSize < totalSupply) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    console.log('Loaded all tokens:', nfts.length)
    return nfts.sort((a, b) => a.tokenId - b.tokenId)
  }
}