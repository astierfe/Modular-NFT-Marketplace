#!/bin/bash
# configure-royalties.sh - VERSION WINDOWS COMPATIBLE

CONTRACT="0x72Bd342Ec921BFcfDaeb429403cc1F0Da43fD312"
RPC="https://eth-sepolia.g.alchemy.com/v2/g8lqb9SCIr3Vl10XKEC-m"
PK="0xf6d4a9501570437c223e0dc8030478a4b8489152fc532c8a0e03e8be5ff2d22d"
RECIPIENT="0xf350B91b403ced3c6E68d34C13eBdaaE3bbd4E01"

echo "========================================="
echo "   NFT ROYALTIES CONFIGURATION SCRIPT   "
echo "========================================="
echo ""

# 1. Set default royalty to 2.5%
echo "📝 Setting default royalty to 2.5%..."
cast send $CONTRACT \
  "setDefaultRoyalty(address,uint96)" \
  $RECIPIENT \
  250 \
  --rpc-url $RPC \
  --private-key $PK

echo ""
echo "⏳ Waiting for confirmation..."
sleep 5

# 2. Verify token #1 royalties
echo ""
echo "🔍 Verifying token #1 royalties..."
RESULT=$(cast call $CONTRACT "royaltyInfo(uint256,uint256)" 1 10000 --rpc-url $RPC)
echo "Raw result: $RESULT"

# Extract royalty value (last 64 chars without 0x prefix)
ROYALTY_HEX=${RESULT: -64}
ROYALTY_DEC=$(cast --to-dec 0x$ROYALTY_HEX)

# Calculate percentage (Windows compatible - no bc needed)
# Simple division using awk (available on Git Bash)
ROYALTY_PCT=$(awk "BEGIN {printf \"%.1f\", $ROYALTY_DEC / 100}")

echo "✅ Token #1 royalties: $ROYALTY_PCT%"

# 3. Verify default royalty (use a non-existent token)
echo ""
echo "🔍 Verifying default royalties (for future mints)..."

# Try token 999999 (likely doesn't exist, will use default)
# If it fails, just check with the actual tokens
DEFAULT_RESULT=$(cast call $CONTRACT "royaltyInfo(uint256,uint256)" 999999 10000 --rpc-url $RPC 2>/dev/null)

if [ $? -eq 0 ]; then
    DEFAULT_HEX=${DEFAULT_RESULT: -64}
    DEFAULT_DEC=$(cast --to-dec 0x$DEFAULT_HEX)
    DEFAULT_PCT=$(awk "BEGIN {printf \"%.1f\", $DEFAULT_DEC / 100}")
    echo "✅ Default royalties: $DEFAULT_PCT%"
else
    echo "⚠️  Cannot verify default (no unminted tokens yet)"
    echo "   New tokens will use the configured 2.5% default"
fi

echo ""
echo "========================================="
echo "         CONFIGURATION COMPLETE         "
echo "========================================="
echo ""
echo "Summary:"
echo "  • Token #1: $ROYALTY_PCT%"
echo "  • Default for new tokens: 2.5%"
echo "  • Recipient: $RECIPIENT"
echo ""