// ./nft-frontend/lib/data/collectionImages.ts
// Collection d'images pré-définies avec CIDs IPFS pour le mint - CRYPTO CODE DOODLES

export interface CollectionImage {
  id: number
  name: string
  description: string
  imageCID: string // CID de l'image sur IPFS
  metadataCID: string // CID du fichier JSON metadata sur IPFS
  attributes: {
    rarity: 'Common' | 'Epic'
    background: string
    doodle: string
    language: string
    bonus: string
  }
  category: string
}

// Liste statique des 4 images disponibles pour le mint - VOS VRAIES DONNÉES
export const COLLECTION_IMAGES: CollectionImage[] = [
  {
    id: 1,
    name: "The Red Line #1",
    description: "A common NFT from the personal collection, created to demonstrate the Modular NFT Marketplace.",
    imageCID: "bafybeifqclln4pgq5izttyn5bcannbv27bnzmof77d2qig5bx6dipfwbwm",
    metadataCID: "bafkreic7mnzj4lr7wmnk2lgerjmfiw5xqpzbgz6qgmqncpnkefgmqbtva4", // À remplacer par ton CID Pinata
    attributes: {
      rarity: 'Common',
      background: 'Green Terminal',
      doodle: 'Console.log',
      language: 'JavaScript',
      bonus: 'Apprentice'
    },
    category: 'Digital Art'
  },
  {
    id: 2,
    name: "The Shadow of Code #2",
    description: "A common NFT from the personal collection, created to demonstrate the Modular NFT Marketplace.",
    imageCID: "bafybeiel5apc3piquu3i3fdpsyyl3vr7y3dw6vkexrvqbqtj65nrn2r4cy",
    metadataCID: "bafkreigbmvl6qvazgjgw2f63hopoea7odzrckx7cmjsicnlmk3yovfbwlm", // À remplacer par ton CID Pinata
    attributes: {
      rarity: 'Common',
      background: 'Green Terminal',
      doodle: 'Infinite Loop',
      language: 'Python',
      bonus: 'Apprentice'
    },
    category: 'Digital Art'
  },
  {
    id: 3,
    name: "The Forgotten Proof #1",
    description: "An epic NFT from the personal collection, created to demonstrate the Modular NFT Marketplace.",
    imageCID: "bafybeied5b3j3wt6w4xjs5q5hrcm4iv6z67gxkofhwt55zcbow3jwnta6q",
    metadataCID: "bafkreicstb72gwb6jqevyq76a4hfp3ve4dxvgq4j2jvqduf7q57coyfypa", // À remplacer par ton CID Pinata
    attributes: {
      rarity: 'Epic',
      background: 'Code Galaxy',
      doodle: 'Infinite Loop',
      language: 'Solidity',
      bonus: 'Gas Master'
    },
    category: 'Digital Art'
  },
  {
    id: 4,
    name: "The Mainnet Ghost #2",
    description: "An epic NFT from the personal collection, created to demonstrate the Modular NFT Marketplace.",
    imageCID: "bafybeifykjrheygrk4dgxsrjshbtvkkl5rywaxqkl62w4wlmoe6xrsraha",
    metadataCID: "bafkreigqtj2n2ryupg4fks6nupooeqcysnpqjojgamdlengccnsadbwndu", // À remplacer par ton CID Pinata
    attributes: {
      rarity: 'Epic',
      background: 'Code Galaxy',
      doodle: 'Error 404',
      language: 'Solidity',
      bonus: 'Gas Master'
    },
    category: 'Digital Art'
  }
]

// Fonction helper pour récupérer une image par ID
export const getImageById = (id: number): CollectionImage | undefined => {
  return COLLECTION_IMAGES.find(image => image.id === id)
}

// Fonction helper pour récupérer les images par rareté
export const getImagesByRarity = (rarity: CollectionImage['attributes']['rarity']): CollectionImage[] => {
  return COLLECTION_IMAGES.filter(image => image.attributes.rarity === rarity)
}

// Fonction helper pour récupérer toutes les raretés disponibles
export const getAvailableRarities = (): string[] => {
  return Array.from(new Set(COLLECTION_IMAGES.map(img => img.attributes.rarity)))
}

// Fonction helper pour récupérer toutes les catégories
export const getAvailableCategories = (): string[] => {
  return Array.from(new Set(COLLECTION_IMAGES.map(img => img.category)))
}

// Fonction helper pour générer l'URL IPFS complète
export const getIPFSImageUrl = (imageCID: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${imageCID}`
}

export const getIPFSMetadataUrl = (metadataCID: string): string => {
  return `ipfs://${metadataCID}`
}