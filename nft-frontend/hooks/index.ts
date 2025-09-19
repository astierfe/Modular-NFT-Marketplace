// ./nft-frontend/hooks/index.ts - Export centralisé de tous les hooks refactorisés
export {
  useCollectionInfo,
  useCollectionStats,
  useTotalSupplyWatcher,
  useIsOwner
} from './useCollectionData'

export {
  useUserNFTs,
  useTokenInfo
} from './useUserNFTs'

export {
  usePublicMint,
  useOwnerMint
} from '../hooks/useMinting'

export {
  useAdminFunctions
} from '../hooks/useAdmin'

export {
  useFormatAddress,
  useGlobalRefresh,
  useCurrentUserIsOwner
} from './useUtils'

// Types réexportés
export type {
  MintParams,
  CollectionInfo,
  TokenInfo,
  CollectionStats
} from '@/lib/types/contractTypes'

export { contractUtils } from '@/lib/types/contractTypes'