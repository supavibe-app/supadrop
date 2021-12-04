import { Attribute } from '.';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient;
export declare const supabaseUpdateBid: (idAuction?: string | undefined, walletAddress?: string | undefined, bidAmount?: number | undefined) => void;
export declare const supabaseAddNewUser: (walletAddress?: string | undefined) => void;
export declare const supabaseAddNewNFT: (id: string, original_file?: string | undefined, name?: string | undefined, description?: string | undefined, attribute?: Attribute[] | undefined, royalty?: number | undefined, arweave_link?: string | undefined, mint_key?: string | undefined, creator?: string | undefined, mediaType?: string | undefined, thumbnail?: string | undefined) => void;
export declare const supabaseUpdateNFTHolder: (idNFT: string, walletAddress?: string | undefined, soldFor?: number | undefined) => void;
export declare const supabaseGetAllOwnedNFT: (idNFT: string, walletAddress?: string | undefined) => void;
export declare const supabaseUpdateStatusInstantSale: (idAuction?: string | undefined) => void;
export declare const supabaseUpdateIsRedeem: (idAuction?: string | undefined, walletAddress?: string | undefined) => void;
export declare const supabaseUpdateIsRedeemAuctionStatus: (idAuction?: string | undefined) => void;
export declare const supabaseUpdateHighestBid: (idAuction: string, bid: number, walletAddress: string) => void;
export declare const supabaseUpdateWinnerAuction: (idAuction?: string | undefined, walletAddress?: string | undefined) => void;
//# sourceMappingURL=supabaseClient.d.ts.map