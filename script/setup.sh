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