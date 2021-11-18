import { Attribute } from '.';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient;
export declare const supabaseUpdateBid: (idAuction?: string | undefined, walletAddress?: string | undefined, bidAmount?: number | undefined) => void;
export declare const supabaseAddNewUser: (walletAddress?: string | undefined) => void;
export declare const supabaseAddNewNFT: (id: string, img_nft: string, name: string, description: string, attribute: Attribute[], royalty: number, arweave_link: string, mint_key: string, creator: string) => void;
export declare const supabaseUpdateStatusInstantSale: (idAuction?: string | undefined) => void;
export declare const supabaseUpdateIsRedeem: (idAuction?: string | undefined, walletAddress?: string | undefined) => void;
export declare const supabaseUpdateIsRedeemAuctionStatus: (idAuction?: string | undefined) => void;
export declare const supabaseUpdateHighestBid: (idAuction: string, bid: number, walletAddress: string) => void;
//# sourceMappingURL=supabaseClient.d.ts.map