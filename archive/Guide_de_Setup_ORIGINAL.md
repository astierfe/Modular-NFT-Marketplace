# Guide de Setup - Développement NFT Marketplace Phase 1

## Étape 1 : Installation des Outils

### 1.1 Prérequis Système
```bash
# Vérifier Node.js (version 18+)
node --version

# Installer pnpm (gestionnaire de paquets recommandé)
npm install -g pnpm

# Installer Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 1.2 Vérification Foundry
```bash
# Vérifier les versions
forge --version
cast --version
anvil --version
```

**Versions attendues :**
- Forge: 1.3.5+
- Cast: 1.3.5+
- Anvil: 1.3.5+

## Étape 2 : Création du Projet

### 2.1 Initialisation
```bash
# Créer le répertoire projet
mkdir modular-nft-marketplace
cd modular-nft-marketplace

# Initialiser le projet Foundry (syntaxe Foundry 1.3.5+)
forge init --no-git .
```

### 2.2 Structure de Répertoires
```bash
# Créer l'arborescence complète
mkdir -p {script,test/{unit,integration,security,performance},docs,assets/{images,metadata},config,scripts}

# Structure finale attendue :
# .
# ├── src/                 # Smart contracts
# ├── test/               # Tests organisés
# │   ├── unit/           # Tests unitaires
# │   ├── integration/    # Tests d'intégration
# │   ├── security/       # Tests de sécurité
# │   └── performance/    # Tests de performance
# ├── script/             # Scripts de déploiement
# ├── assets/             # Assets NFT
# │   ├── images/         # Images optimisées
# │   └── metadata/       # Fichiers JSON
# ├── config/             # Configurations environnement
# ├── scripts/            # Scripts utilitaires
# └── docs/               # Documentation
```

## Étape 3 : Configuration Foundry

### 3.1 Fichier foundry.toml
```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.20"
optimizer = true
optimizer_runs = 200
via_ir = false

# Configuration des tests
[profile.default.fuzz]
runs = 1000

[profile.default.invariant]
runs = 256
depth = 15
fail_on_revert = false

# Configuration gas reporting
[profile.default]
gas_reports = ["*"]
gas_reports_ignore = ["test/**/*"]

# Configuration pour les différents environnements
[profile.local]
src = "src"
test = "test"
script = "script"

[profile.sepolia]
src = "src"
test = "test" 
script = "script"
eth_rpc_url = "${SEPOLIA_RPC_URL}"
etherscan_api_key = "${ETHERSCAN_API_KEY}"

[profile.mainnet]
src = "src"
test = "test"
script = "script"
eth_rpc_url = "${MAINNET_RPC_URL}"
etherscan_api_key = "${ETHERSCAN_API_KEY}"

# Configuration des remappings
remappings = [
    "@openzeppelin/=lib/openzeppelin-contracts/",
    "@forge-std/=lib/forge-std/src/",
]
```

## Étape 4 : Installation des Dépendances

### 4.1 OpenZeppelin Contracts
```bash
# Installer OpenZeppelin (version exacte selon spécifications)
forge install OpenZeppelin/openzeppelin-contracts@v4.9.3 --no-git

# Installer forge-std pour les tests
forge install foundry-rs/forge-std --no-git
```

### 4.2 Vérification des Installations
```bash
# Lister les dépendances installées
ls lib/

# Doit afficher :
# - forge-std
# - openzeppelin-contracts
```

## Étape 5 : Configuration Environnement

### 5.1 Fichier .env (Template)
```bash
# Créer les fichiers d'environnement
touch .env.local .env.sepolia .env.mainnet
```

### 5.2 .env.local (Développement Anvil)
```bash
# Network Configuration
RPC_URL=http://localhost:8545
CHAIN_ID=31337
GAS_PRICE=0
GAS_LIMIT=30000000

# Deployment
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
DEPLOYER_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Contract Parameters
COLLECTION_NAME="Dev NFT Collection"
COLLECTION_SYMBOL="DEVNFT"
MAX_SUPPLY=10000
MINT_PRICE=0
BASE_URI="http://localhost:8080/ipfs/"

# IPFS Configuration
IPFS_GATEWAY=http://localhost:8080
IPFS_API=http://localhost:5001
PINNING_ENABLED=false
```

### 5.3 .env.sepolia (Template pour Testnet)
```bash
# À compléter avec vos vraies clés
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
CHAIN_ID=11155111
PRIVATE_KEY=YOUR_SEPOLIA_PRIVATE_KEY
DEPLOYER_ADDRESS=YOUR_SEPOLIA_ADDRESS
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
PINATA_API_KEY=YOUR_PINATA_KEY
PINATA_SECRET=YOUR_PINATA_SECRET
```

## Étape 6 : Scripts Utilitaires

### 6.1 Script de Setup (scripts/setup.sh)
```bash
#!/bin/bash
# Script de setup automatique

echo "🚀 Setup Modular NFT Marketplace"

# Vérifier Foundry
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry n'est pas installé"
    exit 1
fi

# Compiler les contrats
echo "📦 Compilation des contrats..."
forge build

# Installer les dépendances si nécessaire
if [ ! -d "lib/openzeppelin-contracts" ]; then
    echo "📥 Installation OpenZeppelin..."
    forge install OpenZeppelin/openzeppelin-contracts@v4.9.3 --no-git
fi

if [ ! -d "lib/forge-std" ]; then
    echo "📥 Installation Forge-std..."
    forge install foundry-rs/forge-std --no-git
fi

# Créer les répertoires manquants
mkdir -p assets/{images,metadata} config docs

echo "✅ Setup terminé!"
echo "💡 Prochaine étape : Développer le smart contract ModularNFT"
```

### 6.2 Rendre le script exécutable
```bash
chmod +x scripts/setup.sh
```

## Étape 7 : Validation du Setup

### 7.1 Tests de Compilation
```bash
# Compiler le projet (doit réussir)
forge build

# Résultat attendu : compilation sans erreur
```

### 7.2 Test Anvil
```bash
# Démarrer Anvil en arrière-plan
anvil --accounts 10 --balance 1000 &

# Tester la connexion
cast client --rpc-url http://localhost:8545

# Arrêter Anvil
pkill anvil
```

## Étape 8 : Checklist de Validation

**Avant de passer au développement, vérifier :**

- [ ] ✅ Foundry installé et fonctionnel
- [ ] ✅ Projet initialisé avec la bonne structure
- [ ] ✅ OpenZeppelin 4.9.3 installé
- [ ] ✅ foundry.toml configuré avec Solidity 0.8.20
- [ ] ✅ Environnements .env créés
- [ ] ✅ Compilation réussie (forge build)
- [ ] ✅ Anvil démarre sans erreur
- [ ] ✅ Scripts utilitaires créés et exécutables

## Prochaine Étape

Une fois ce setup validé, nous passerons au développement du smart contract `ModularNFT.sol` avec toutes ses fonctionnalités selon les spécifications.

**Commande de validation finale :**
```bash
# Exécuter le script de setup
./scripts/setup.sh

# Si tout est OK, continuer vers le développement
echo "🎯 Prêt pour le développement du smart contract!"
```