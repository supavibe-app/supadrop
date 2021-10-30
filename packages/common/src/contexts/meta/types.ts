import { AccountInfo } from '@solana/web3.js';
import { Dispatch, SetStateAction } from 'react';
import {
  AuctionData,
  AuctionDataExtended,
  BidderMetadata,
  BidderPot,
  Edition,
  MasterEditionV1,
  MasterEditionV2,
  Metadata,
  SafetyDepositBox,
  Vault,
} from '../../actions';
import {
  AuctionCache,
  AuctionManagerV1,
  AuctionManagerV2,
  BidRedemptionTicket,
  BidRedemptionTicketV2,
  PayoutTicket,
  PrizeTrackingTicket,
  SafetyDepositConfig,
  Store,
  StoreIndexer,
  WhitelistedCreator,
} from '../../models/metaplex';
import { PublicKeyStringAndAccount, StringPublicKey } from '../../utils';
import { ParsedAccount } from '../accounts/types';

export interface MetaState {
  metadata: ParsedAccount<Metadata>[];
  metadataByMint: Record<string, ParsedAccount<Metadata>>;
  metadataByMetadata: Record<string, ParsedAccount<Metadata>>;

  metadataByAuction: Record<string, ParsedAccount<Metadata>[]>;
  metadataByMasterEdition: Record<string, ParsedAccount<Metadata>>;
  editions: Record<string, ParsedAccount<Edition>>;
  masterEditions: Record<
    string,
    ParsedAccount<MasterEditionV1 | MasterEditionV2>
  >;
  masterEditionsByPrintingMint: Record<string, ParsedAccount<MasterEditionV1>>;
  masterEditionsByOneTimeAuthMint: Record<
    string,
    ParsedAccount<MasterEditionV1>
  >;
  prizeTrackingTickets: Record<string, ParsedAccount<PrizeTrackingTicket>>;
  auctionManagersByAuction: Record<
    string,
    ParsedAccount<AuctionManagerV1 | AuctionManagerV2>
  >;
  safetyDepositConfigsByAuctionManagerAndIndex: Record<
    string,
    ParsedAccount<SafetyDepositConfig>
  >;
  bidRedemptionV2sByAuctionManagerAndWinningIndex: Record<
    string,
    ParsedAccount<BidRedemptionTicketV2>
  >;
  auctions: Record<string, ParsedAccount<AuctionData>>;
  auctionDataExtended: Record<string, ParsedAccount<AuctionDataExtended>>;
  vaults: Record<string, ParsedAccount<Vault>>;
  store: ParsedAccount<Store> | null;
  bidderMetadataByAuctionAndBidder: Record<
    string,
    ParsedAccount<BidderMetadata>
  >;
  safetyDepositBoxesByVaultAndIndex: Record<
    string,
    ParsedAccount<SafetyDepositBox>
  >;
  bidderPotsByAuctionAndBidder: Record<string, ParsedAccount<BidderPot>>;
  bidRedemptions: Record<string, ParsedAccount<BidRedemptionTicket>>;
  whitelistedCreatorsByCreator: Record<
    string,
    ParsedAccount<WhitelistedCreator>
  >;
  payoutTickets: Record<string, ParsedAccount<PayoutTicket>>;
  auctionCaches: Record<string, ParsedAccount<AuctionCache>>;
  storeIndexer: ParsedAccount<StoreIndexer>[];
}

export interface MetaContextState extends MetaState {
  isLoadingMetaplex: boolean;
  isLoadingDatabase: boolean;
  liveDataAuctions: { [key: string]: ItemAuction };
  update: (
    auctionAddress?: any,
    bidderAddress?: any,
  ) => [
    ParsedAccount<AuctionData>,
    ParsedAccount<BidderPot>,
    ParsedAccount<BidderMetadata>,
  ];
  pullAuctionPage: (auctionAddress: StringPublicKey) => Promise<MetaState>;
  pullBillingPage: (auctionAddress: StringPublicKey) => void;
  updateLiveDataAuction: () => void;
  pullAllSiteData: () => void;
  pullAllMetadata: () => void;

  isBidPlaced: boolean;
  setBidPlaced: Dispatch<SetStateAction<boolean>>;
}

export type AccountAndPubkey = {
  pubkey: string;
  account: AccountInfo<Buffer>;
};

export type UpdateStateValueFunc<T = void> = (
  prop: keyof MetaState,
  key: string,
  value: ParsedAccount<any>,
) => T;

export type ProcessAccountsFunc = (
  account: PublicKeyStringAndAccount<Buffer>,
  setter: UpdateStateValueFunc,
) => void;

export type CheckAccountFunc = (account: AccountInfo<Buffer>) => boolean;

export class ItemAuction {
  id: string;
  name: string;
  id_nft: string;
  token_mint: string;
  price_floor: number;
  img_nft: string;
  startAt: number;
  endAt: number;
  highestBid: number;
  price_tick: number;
  gapTime: number;
  tickExtend: number;
  vault: string;
  arweave_link: string;
  owner: string;
  mint_key: string;
  isInstantSale: boolean;

  constructor(
    id: string,
    name: string,
    id_nft: string,
    token_mint: string,
    price_floor: number,
    img_nft: string,
    startAt: number,
    endAt: number,
    highestBid: number,
    price_tick: number,
    gapTime: number,
    tickExtend: number,
    vault: string,
    arweave_link: string,
    owner: string,
    mint_key: string,
    isInstantSale: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.id_nft = id_nft;
    this.token_mint = token_mint;
    this.price_floor = price_floor;
    this.img_nft = img_nft;
    this.startAt = startAt;
    this.endAt = endAt;
    this.highestBid = highestBid;
    this.price_tick = price_tick;
    this.gapTime = gapTime;
    this.tickExtend = tickExtend;
    this.vault = vault;
    this.arweave_link = arweave_link;
    this.owner = owner;
    this.mint_key = mint_key;
    this.isInstantSale = isInstantSale;
  }
}
export type UnPromise<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;
