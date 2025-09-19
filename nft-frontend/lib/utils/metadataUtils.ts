// ./nft-frontend/lib/utils/metadataUtils.ts - Utilitaires pour métadonnées et IPFS
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

  // Faire un appel RPC vers le contrat
  contractCall: async (
    rpcUrl: string,
    contractAddress: Address,
    functionSignature: string,
    tokenId: number
  ): Promise<string> => {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [{
          to: contractAddress,
          data: functionSignature + tokenId.toString(16).padStart(64, '0')
        }, 'latest'],
        id: 1
      })
    })
    
    const data = await response.json()
    if (data.error) {
      throw new Error(data.error.message || 'Contract call failed')
    }
    
    return data.result
  },

  // Charger les informations d'un token spécifique
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

      const nft: NFTWithMetadata = {
        tokenId,
        owner,
        tokenURI,
        royaltyRecipient: owner, // Simplification
        royaltyPercentage: 5, // Simplification
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