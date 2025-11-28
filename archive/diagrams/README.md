# Archived PlantUML Diagrams

This directory contains the original PlantUML diagrams created during Modular NFT development. All diagrams have been converted to Mermaid format for the new documentation structure but are preserved here in their original form.

## Purpose

These PlantUML diagrams represent high-quality architectural documentation with detailed French annotations. They are archived rather than deleted to:

1. **Preserve Quality**: Sophisticated diagrams with advanced PlantUML features
2. **Enable Regeneration**: Can be re-rendered with PlantUML tools if needed
3. **Alternative Format**: PlantUML offers features not available in Mermaid
4. **Historical Reference**: Original design thinking and architectural decisions
5. **Git History**: Complete project documentation evolution

## Archived Diagrams

### sequence.puml
**Original Purpose**: NFT loading sequence after wallet connection
**French Title**: "Flux de chargement des NFTs après connexion wallet"
**Lines**: 88
**Created**: September 2024

**Converted To**:
- **DIAGRAM 3**: NFT Minting Flow - `docs/nft-assets/NFT_ASSET_PIPELINE.md`
- **DIAGRAM 4**: NFT Loading Flow - `docs/architecture/FRONTEND_ARCHITECTURE.md`

**Key Content**:
- Wallet connection flow (RainbowKit → wagmi → RPC)
- Collection info retrieval (useCollectionInfo hook)
- Individual NFT loading loop (ownerOf, tokenURI, royaltyInfo)
- IPFS metadata fetching with retry logic
- NFTCard rendering and display

---

### components.puml
**Original Purpose**: Component architecture and hooks layer
**French Title**: "Architecture des composants et hooks - Chargement NFT"
**Lines**: 95
**Created**: September 2024

**Converted To**:
- **DIAGRAM 2**: Detailed Architecture - `docs/architecture/TECHNICAL_ARCHITECTURE.md`

**Key Content**:
- Web3 infrastructure layer (WagmiProvider, RainbowKit, React Query)
- Contract layer (ModularNFT.sol with ERC-721 + EIP-2981 standards)
- Custom hooks layer (useCollectionInfo, useUserNFTs, useTokenInfo, useIsOwner)
- Component layer (page.tsx, NFTGrid, NFTCard, AdminSection)
- External services (IPFS/Pinata, RPC/Alchemy, Anvil local blockchain)

---

### activity.puml
**Original Purpose**: Business logic and user interaction flow
**French Title**: "Logique métier - Processus de chargement des NFTs"
**Lines**: 124
**Created**: September 2024

**Converted To**:
- **DIAGRAM 5**: User Interaction Flowchart - `docs/guides/GETTING_STARTED.md`

**Key Content**:
- User wallet connection decision tree
- Collection loading process with error handling
- NFT iteration and metadata fetching
- Filtering and sorting logic
- Display state management
- User interaction branches (click card, apply filters, refresh data)

---

### marketplace-architecture.puml
**Original Purpose**: Full system architecture including external marketplace
**French Title**: "Marketplace NFT - Architecture Système"
**Lines**: 156
**Created**: September 2024

**Converted To**:
- **DIAGRAM 1**: System Overview - `docs/architecture/SYSTEM_OVERVIEW.md` + `README.md`

**Key Content**:
- Actor roles (Creator, Trader/Buyer, Seller)
- Frontend applications (Modular NFT DApp, External Marketplace DApp)
- Blockchain layer (ModularNFT Contract, Marketplace Contract)
- Storage layer (IPFS decentralized storage)
- Web3 infrastructure (Wallets, RPC providers)
- Flow annotations:
  - "Flux de création" (Creation Flow): Mint → IPFS → On-chain
  - "Flux de listing" (Listing Flow): Approve → List → Event
  - "Flux d'achat" (Purchase Flow): Buy → Transfer → Royalty → Funds distribution

## Conversion to Mermaid

### Why Convert to Mermaid?

**Advantages of Mermaid**:
- ✅ **GitHub Native**: Renders directly in GitHub markdown (no external tools)
- ✅ **Maintenance**: Easier inline editing within documentation files
- ✅ **Consistency**: Single diagramming standard across entire project
- ✅ **Accessibility**: No PlantUML CLI or plugins required
- ✅ **Version Control**: Text-based, clear diffs in git

**Trade-offs**:
- ❌ Some advanced PlantUML features not available in Mermaid
- ❌ Mermaid syntax less flexible for complex layouts
- ❌ Lost some visual styling options from PlantUML themes

### Translation Decisions

**Language**: All French annotations translated to English for consistency

**French → English Mappings**:
- "Créateur NFT" → "NFT Creator"
- "Trader/Acheteur" → "Trader/Buyer"
- "Vendeur NFT" → "NFT Seller"
- "Flux de création" → "Creation Flow"
- "Flux de listing" → "Listing Flow"
- "Flux d'achat" → "Purchase Flow"
- "Métadonnées" → "Metadata"
- "Stockage décentralisé" → "Decentralized Storage"
- "Contrat intelligent" → "Smart Contract"

**Simplification**: Complex PlantUML features simplified to Mermaid equivalents while preserving core information

## Rendering Original Diagrams

### Using PlantUML CLI

```bash
# Install PlantUML (requires Java)
# macOS
brew install plantuml

# Linux
apt-get install plantuml

# Windows: download from https://plantuml.com/download

# Render single diagram to PNG
plantuml sequence.puml

# Render all diagrams
plantuml *.puml

# Output to specific directory
plantuml -o renders/ *.puml

# Export as SVG (scalable)
plantuml -tsvg sequence.puml
```

### Using Online PlantUML Renderer

1. Visit: http://www.plantuml.com/plantuml/uml/
2. Copy content from `.puml` file
3. Paste into text area
4. View rendered diagram
5. Download as PNG/SVG

### Using VS Code Extension

1. Install "PlantUML" extension by jebbs
2. Open `.puml` file in VS Code
3. Press `Alt+D` to preview diagram
4. Right-click diagram → "Export Current Diagram"
5. Choose format (PNG, SVG, EPS, PDF)

## Mermaid Equivalents

For comparison with new Mermaid diagrams:

| PlantUML File | Mermaid Location | Mermaid Type | Key Changes |
|---------------|------------------|--------------|-------------|
| sequence.puml (minting) | `docs/nft-assets/NFT_ASSET_PIPELINE.md` | sequenceDiagram | Added Nano Banana stage, simplified retry logic |
| sequence.puml (loading) | `docs/architecture/FRONTEND_ARCHITECTURE.md` | sequenceDiagram | Simplified to key interactions, removed verbose error handling |
| components.puml | `docs/architecture/TECHNICAL_ARCHITECTURE.md` | graph TB | Added layer grouping, clearer component hierarchy |
| activity.puml | `docs/guides/GETTING_STARTED.md` | flowchart TD | Simplified to main user paths, removed edge cases |
| marketplace-architecture.puml | `docs/architecture/SYSTEM_OVERVIEW.md` | graph TB | C4-style context diagram, emphasis on external integrations |

## Additional Diagrams Created

These diagrams were **newly created** in Mermaid (not converted from PlantUML):

- **DIAGRAM 6**: Smart Contract State Machine - `docs/smart-contracts/MODULAR_NFT.md`
  - Type: stateDiagram-v2
  - Shows: Contract lifecycle states (Deployed → Minting → MaxSupply)

- **DIAGRAM 7**: Deployment Pipeline - `docs/deployment/DEPLOYMENT_GUIDE.md`
  - Type: flowchart TD
  - Shows: Complete deployment workflow (Compile → Deploy → Verify → Test)

## Preservation Recommendation

**⚠️ DO NOT DELETE THESE FILES**

Reasons to preserve:
- Represent significant documentation effort (~8 hours of work)
- PlantUML may be preferred for future complex diagrams
- Serves as backup if Mermaid conversions need revision
- Valuable for understanding project evolution
- Can generate high-quality PDF documentation from PlantUML

## Future Use

If PlantUML diagrams need to be regenerated or new ones created:

1. Use archived files as templates for style consistency
2. Maintain English language (aligned with current docs)
3. Follow same theme if possible (`!theme mars` was used originally)
4. Export renders to optional `renders/` directory
5. Document in this README with new diagram descriptions

## Questions?

For questions about these archived diagrams or conversion decisions:
- Review the restructuring plan: `../.claude/plans/parallel-fluttering-storm.md`
- See current diagram index: `../docs/architecture/DIAGRAMS.md` (when created)
- Check conversion methodology in Mermaid diagram source files
