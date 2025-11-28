# Modular NFT Marketplace

## Type de projet
Plateforme Web3 complète de collection NFT avec smart contract Solidity et interface Next.js.

## Technologies utilisées

### Blockchain et Smart Contracts
- Solidity 0.8.20
- Foundry (framework de développement et tests)
- OpenZeppelin Contracts (ERC-721, ERC-2981, Ownable, ReentrancyGuard)
- Support multi-réseaux : Anvil local, Sepolia testnet, Ethereum mainnet

### Frontend
- Next.js 15 avec App Router
- TypeScript
- Wagmi v2 (bibliothèque React Hooks pour Ethereum)
- RainbowKit (interface de connexion wallet)
- TanStack React Query
- Tailwind CSS avec mode dark/light
- Radix UI (composants accessibles)
- Viem (interaction blockchain)

### Infrastructure
- IPFS via Pinata Gateway (stockage décentralisé des métadonnées et images)
- Alchemy SDK (indexation et requêtes blockchain)
- EmailJS (système de contact)

## Fonctionnalités principales

### Smart Contract ModularNFT.sol
- Standard ERC-721 avec extensions Enumerable et URIStorage
- Système de royalties EIP-2981 pour les ventes secondaires
- Mint public et mint owner avec prix configurable
- Batch minting pour déploiement de collections
- Gestion de supply maximale modifiable
- Protection ReentrancyGuard contre les attaques
- Système de withdrawal sécurisé
- Fonctions d'administration réservées au propriétaire

### Interface utilisateur
- Connexion multi-wallets via RainbowKit
- Affichage de la collection NFT avec filtres et tri
- Interface de minting public
- Panel d'administration complet (réservé au owner du contrat)
- Synchronisation temps réel avec l'état du contrat
- Statistiques de collection en direct
- Design responsive adaptatif

## Caractéristiques techniques

### Sécurité
- Protection contre les attaques de réentrance
- Validation complète des paramètres d'entrée
- Gestion d'erreurs explicites avec custom errors
- Contrôle d'accès strict sur les fonctions administratives
- Aucune manipulation de clés privées côté frontend

### Performance
- Déploiement du contrat : environ 2.8M gas
- Mint simple : environ 140k gas
- Batch mint (5 NFTs) : environ 450k gas
- Optimisation SSR Next.js avec guards de montage
- Gestion efficace de l'état Web3
- Système de fallback pour les gateways IPFS

### Tests et qualité
- Suite de tests Foundry complète
- Couverture de code avec forge coverage
- Rapports de consommation gas
- Vérification des contrats sur Etherscan
- Type-checking TypeScript strict

## Déploiement
Contrat déployé et vérifié sur Sepolia testnet à l'adresse 0x72Bd342Ec921BFcfDaeb429403cc1F0Da43fD312.
Collection de 1000 NFTs maximum avec prix de mint de 0.01 ETH.
Métadonnées et images stockées sur IPFS via Pinata.

## Compétences démontrées
- Développement de smart contracts Solidity avec standards ERC
- Architecture de DApp Web3 complète
- Intégration blockchain avec frameworks modernes
- Gestion de stockage décentralisé IPFS
- Sécurisation de contrats intelligents
- Tests et déploiement sur réseaux Ethereum
- Design d'interfaces Web3 responsive
- Optimisation gas et performance
