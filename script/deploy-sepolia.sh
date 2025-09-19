#!/bin/bash
# deploy-sepolia.sh

echo "🚀 Deploying to Sepolia..."

# Charger les variables Sepolia
set -a
source .env.sepolia
set +a

# Vérifier les variables critiques
if [ -z "$SEPOLIA_RPC_URL" ]; then
  echo "❌ SEPOLIA_RPC_URL not set"
  exit 1
fi

if [ -z "$PRIVATE_KEY" ]; then
  echo "❌ PRIVATE_KEY not set"
  exit 1
fi

echo "📍 Network: $NETWORK_NAME"
echo "🔗 RPC: $SEPOLIA_RPC_URL"
echo "👛 Deployer: $DEPLOYER_ADDRESS"
echo ""

# Déployer
forge script script/Deploy.s.sol:Deploy \
  --rpc-url "$SEPOLIA_RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --broadcast \
  --verify \
  --etherscan-api-key "$ETHERSCAN_API_KEY" \
  --legacy \
  -vvvv

echo "✅ Deployment complete!"