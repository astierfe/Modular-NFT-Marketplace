# Archived Documentation

This directory contains original documentation files preserved for historical reference during the documentation restructuring (2025).

## Purpose

During the documentation reorganization, we transitioned to an English-only, recruiter-optimized documentation structure. All original French documentation and PlantUML diagrams have been preserved here to maintain project history and enable future reference.

## Contents

### Original Markdown Files

- **readme_modularNFT_ORIGINAL.md** (French, 88 lines)
  - Original portfolio summary created September 2024
  - French description of project features and technologies
  - Content translated and incorporated into:
    - `docs/architecture/SYSTEM_OVERVIEW.md`
    - `docs/architecture/TECHNICAL_ARCHITECTURE.md`
    - `docs/smart-contracts/MODULAR_NFT.md`
    - `docs/smart-contracts/SECURITY.md`

- **Guide_de_Setup_ORIGINAL.md** (French, 273 lines)
  - Original Phase 1 development setup guide
  - Foundry configuration walkthrough
  - Environment setup templates
  - Content translated and split into:
    - `docs/guides/GETTING_STARTED.md`
    - `docs/guides/LOCAL_DEVELOPMENT.md`
    - `docs/deployment/NETWORK_CONFIGURATION.md`

### PlantUML Diagrams

See [diagrams/README.md](diagrams/README.md) for complete PlantUML diagram archive and conversion details.

## Why Archived Instead of Deleted?

These files were preserved for multiple reasons:

1. **Historical Record**: Original architectural thinking and design decisions
2. **Git History**: Complete project evolution with no lost commits
3. **Language Diversity**: Potential future French documentation branch
4. **Quality**: High-quality technical content worth preserving
5. **Reference**: Detailed examples and explanations for complex topics

## Original Content Disposition

| Original File | Content Migrated To |
|---------------|---------------------|
| readme_modularNFT_ORIGINAL.md | `docs/architecture/`, `docs/smart-contracts/` |
| Guide_de_Setup_ORIGINAL.md | `docs/guides/`, `docs/deployment/` |
| diagrams/*.puml | Converted to Mermaid in `docs/` |

## Why Restructure?

The documentation was restructured to address several critical issues:

1. **Contract Address Mismatch**: README.md referenced an outdated contract address
2. **Broken Links**: Documentation referenced non-existent files
3. **Language Inconsistency**: Mixed French/English created confusion
4. **Redundancy**: High overlap between 3 separate markdown files
5. **Organization**: Flat structure made navigation difficult

## New Documentation Structure

For current documentation, see:

- **Main README**: [`../README.md`](../README.md) - Recruiter-optimized project overview
- **Documentation Hub**: [`../docs/README.md`](../docs/README.md) - Complete documentation index
- **Architecture**: [`../docs/architecture/`](../docs/architecture/) - System and technical architecture
- **Guides**: [`../docs/guides/`](../docs/guides/) - Getting started and development guides
- **Smart Contracts**: [`../docs/smart-contracts/`](../docs/smart-contracts/) - Contract documentation
- **Deployment**: [`../docs/deployment/`](../docs/deployment/) - Deployment and configuration
- **NFT Assets**: [`../docs/nft-assets/`](../docs/nft-assets/) - Asset creation pipeline
- **Marketplace**: [`../docs/marketplace/`](../docs/marketplace/) - External marketplace integration

## Restoration

If you need to access original French documentation:

1. Files preserved exactly as last committed (no modifications)
2. Full git history available for evolution tracking
3. Can create French branch from these files if needed
4. PlantUML diagrams can be re-rendered (see `diagrams/README.md`)

## Date Archived

**2025** - Documentation Restructuring Phase 1

## Questions?

For questions about archived content or restructuring decisions:
- See the comprehensive plan: [`../.claude/plans/parallel-fluttering-storm.md`](../.claude/plans/parallel-fluttering-storm.md)
- Review current documentation: [`../docs/README.md`](../docs/README.md)
- Check git history: `git log --follow <filename>`
