/// <reference types="node" />
import { AccountInfo } from '@solana/web3.js';
import { Dispatch, SetStateAction } from 'react';
import { TokenAccount } from '../..';
import { AuctionData, AuctionDataExtended, BidderMetadata, BidderPot, Edition, MasterEditionV1, MasterEditionV2, Metadata, SafetyDepositBox, Vault } from '../../actions';
import { AuctionCache, AuctionManagerV1, AuctionManagerV2, BidRedemptionTicket, BidRedemptionTicketV2, PayoutTicket, PrizeTrackingTicket, SafetyDepositConfig, Store, StoreIndexer, WhitelistedCreator } from '../../models/metaplex';
import { PackCard } from '../../models/packs/accounts/PackCard';
import { PackSet } from '../../models/packs/accounts/PackSet';
import { PackVoucher } from '../../models/packs/accounts/PackVoucher';
import { ProvingProcess } from '../../models/packs/accounts/ProvingProcess';
import { PublicKeyStringAndAccount, StringPublicKey } from '../../utils';
import { ParsedAccount, UserData } from '../accounts/types';
export interface MetaState {
    metadata: ParsedAccount<Metadata>[];
    metadataByMint: Record<string, ParsedAccount<Metadata>>;
    metadataByMetadata: Record<string, ParsedAccount<Metadata>>;
    metadataByAuction: Record<string, ParsedAccount<Metadata>[]>;
    metadataByMasterEdition: Record<string, ParsedAccount<Metadata>>;
    editions: Record<string, ParsedAccount<Edition>>;
    masterEditions: Record<string, ParsedAccount<MasterEditionV1 | MasterEditionV2>>;
    masterEditionsByPrintingMint: Record<string, ParsedAccount<MasterEditionV1>>;
    masterEditionsByOneTimeAuthMint: Record<string, ParsedAccount<MasterEditionV1>>;
    prizeTrackingTickets: Record<string, ParsedAccount<PrizeTrackingTicket>>;
    auctionManagersByAuction: Record<string, ParsedAccount<AuctionManagerV1 | AuctionManagerV2>>;
    safetyDepositConfigsByAuctionManagerAndIndex: Record<string, ParsedAccount<SafetyDepositConfig>>;
    bidRedemptionV2sByAuctionManagerAndWinningIndex: Record<string, ParsedAccount<BidRedemptionTicketV2>>;
    auctions: Record<string, ParsedAccount<AuctionData>>;
    auctionDataExtended: Record<string, ParsedAccount<AuctionDataExtended>>;
    vaults: Record<string, ParsedAccount<Vault>>;
    store: ParsedAccount<Store> | null;
    bidderMetadataByAuctionAndBidder: Record<string, ParsedAccount<BidderMetadata>>;
    safetyDepositBoxesByVaultAndIndex: Record<string, ParsedAccount<SafetyDepositBox>>;
    bidderPotsByAuctionAndBidder: Record<string, ParsedAccount<BidderPot>>;
    bidRedemptions: Record<string, ParsedAccount<BidRedemptionTicket>>;
    whitelistedCreatorsByCreator: Record<string, ParsedAccount<WhitelistedCreator>>;
    payoutTickets: Record<string, ParsedAccount<PayoutTicket>>;
    auctionCaches: Record<string, ParsedAccount<AuctionCache>>;
    storeIndexer: ParsedAccount<StoreIndexer>[];
    packs: Record<string, ParsedAccount<PackSet>>;
    packCards: Record<string, ParsedAccount<PackCard>>;
    packCardsByPackSet: Record<string, ParsedAccount<PackCard>[]>;
    vouchers: Record<string, ParsedAccount<PackVoucher>>;
    provingProcesses: Record<string, ParsedAccount<ProvingProcess>>;
}
export interface MetaContextState extends MetaState {
    art: any;
    isLoadingMetaplex: boolean;
    isLoadingDatabase: boolean;
    dataCollection: Collection;
    userData: UserData;
    endingTime: number;
    liveDataAuctions: ItemAuction[];
    endedAuctions: ItemAuction[];
    notifBidding: any[];
    notifAuction: any[];
    allDataAuctions: {
        [key: string]: ItemAuction;
    };
    update: (auctionAddress?: any, bidderAddress?: any) => [
        ParsedAccount<AuctionData>,
        ParsedAccount<BidderPot>,
        ParsedAccount<BidderMetadata>
    ];
    pullAuctionPage: (auctionAddress: StringPublicKey) => Promise<MetaState>;
    pullBillingPage: (auctionAddress: StringPublicKey) => void;
    updateLiveDataAuction: () => void;
    updateAllDataAuction: () => void;
    updateUserData: (data: UserData) => void;
    updateDetailAuction: (idAuction: string) => void;
    updateNotifBidding: (publicKey: string) => void;
    updateNotifAuction: (publicKey: string) => void;
    updateArt: (nftData: any) => void;
    pullAllSiteData: () => void;
    pullAllMetadata: () => void;
    isBidPlaced: boolean;
    setBidPlaced: Dispatch<SetStateAction<boolean>>;
    pullItemsPage: (userTokenAccounts: TokenAccount[]) => Promise<void>;
}
export declare type AccountAndPubkey = {
    pubkey: string;
    account: AccountInfo<Buffer>;
};
export declare class Collection {
    id: string;
    name: string;
    description: string;
    supply: number;
    price: number;
    sold: number;
    start_publish: number;
    images: string[];
    constructor(id: string, name: string, description: string, supply: number, price: number, sold: number, start_publish: number, images: string[]);
}
export declare type UpdateStateValueFunc<T = void> = (prop: keyof MetaState, key: string, value: ParsedAccount<any>) => T;
export declare type ProcessAccountsFunc = (account: PublicKeyStringAndAccount<Buffer>, setter: UpdateStateValueFunc) => void;
export declare type CheckAccountFunc = (account: AccountInfo<Buffer>) => boolean;
export declare class ItemAuction {
    id: string;
    name: string;
    id_nft: string;
    token_mint: string;
    price_floor: number;
    original_file: string;
    thumbnail: string;
    media_type: string;
    startAt: number;
    endAt: number;
    highestBid: number;
    price_tick: number;
    gapTime: number;
    tickExtend: number;
    vault: string;
    arweave_link: string;
    owner: string;
    winner: string;
    mint_key: string;
    isInstantSale: boolean;
    ownerImg?: string;
    ownerUsername?: string;
    constructor(id: string, name: string, id_nft: string, token_mint: string, price_floor: number, original_file: string, thumbnail: string, media_type: string, startAt: number, endAt: number, highestBid: number, price_tick: number, gapTime: number, tickExtend: number, vault: string, arweave_link: string, owner: string, winner: string, mint_key: string, isInstantSale: boolean, ownerImg?: string, ownerUsername?: string);
}
export declare class NFTData {
    id: string;
    name: string;
    description: string;
    creator: string;
    holder: string;
    royalty: number;
    imgNFT: string;
    arweave_link: string;
    mediaType: string;
    winner: string;
    mint_key: string;
    isInstantSale: boolean;
    constructor(id: string, name: string, description: string, creator: string, holder: string, royalty: number, imgNFT: string, arweave_link: string, mediaType: string, winner: string, mint_key: string, isInstantSale: boolean);
}
export declare type UnPromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;
//# sourceMappingURL=types.d.ts.map