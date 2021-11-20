import { createClient } from '@supabase/supabase-js';
import { Attribute } from '.';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseUpdateBid = (
  idAuction?: string,
  walletAddress?: string,
  bidAmount?: number,
) => {
  supabase
    .from('action_bidding')
    .select('*')
    .eq('id', `${idAuction}_${walletAddress}`)
    .then(data => {
      if (!data.body) return;
      if (data.body?.length > 0) {
        supabase
          .from('action_bidding')
          .update({ price_bid: bidAmount })
          .eq('id', `${idAuction}_${walletAddress}`)
          .then(() => {
            supabaseUpdateHighestBid(
              idAuction || '',
              bidAmount || 0,
              walletAddress || '',
            );
          });
      } else {
        supabase
          .from('action_bidding')
          .insert([
            {
              id: `${idAuction}_${walletAddress}`,
              wallet_address: walletAddress,
              id_auction: idAuction,
              price_bid: bidAmount,
            },
          ])
          .then(() => {
            supabaseUpdateHighestBid(
              idAuction || '',
              bidAmount || 0,
              walletAddress || '',
            );
          });
      }
    });
};

export const supabaseAddNewUser = (walletAddress?: string) => {
  supabase
    .from('user_data')
    .select('*')
    .eq('wallet_address', walletAddress)
    .then(data => {
      if (data.body && data.body.length === 0) {
        supabase
          .from('user_data')
          .insert([{ wallet_address: walletAddress }])
          .then();
      }
    });
};

export const supabaseAddNewNFT = (
  id: string,
  img_nft: string,
  name: string,
  description: string,
  attribute: Attribute[],
  royalty: number,
  arweave_link: string,
  mint_key: string,
  creator: string,
) => {
  supabase
    .from('nft_data')
    .insert([
      {
        id,
        img_nft,
        name,
        description,
        attribute,
        royalty,
        arweave_link,
        mint_key,
        creator,
        holder: creator,
        max_supply: 1,
      },
    ])
    .then();
};

export const supabaseUpdateNFTHolder = (
  idNFT: string,
  walletAddress?: string,
) => {
  supabase
    .from('nft_data')
    .update({ holder: walletAddress })
    .eq('id', idNFT)
    .then(result => {
      console.log('res', result);
    });
};

export const supabaseUpdateStatusInstantSale = (idAuction?: string) => {
  supabase
    .from('auction_status')
    .update({ isLiveMarket: false, is_redeem: true })
    .eq('id', idAuction)
    .then();
};
export const supabaseUpdateIsRedeem = (
  idAuction?: string,
  walletAddress?: string,
) => {
  supabase
    .from('action_bidding')
    .update({ is_redeem: true })
    .eq('id', `${idAuction}_${walletAddress}`)
    .then();
};
export const supabaseUpdateIsRedeemAuctionStatus = (idAuction?: string) => {
  supabase
    .from('auction_status')
    .update({ is_redeem: true })
    .eq('id', idAuction)
    .then();
};

export const supabaseUpdateHighestBid = (
  idAuction: string,
  bid: number,
  walletAddress: string,
) => {
  supabase
    .from('auction_status')
    .select('highest_bid')
    .eq('id', idAuction)
    .single()
    .then(data => {
      if (data.body && data.body.highest_bid < bid) {
        supabase
          .from('auction_status')
          .update({ highest_bid: bid, winner: walletAddress })
          .eq('id', idAuction)
          .then();
      }
    });
};

export const supabaseUpdateWinnerAuction = (
  idAuction?: string,
  walletAddress?: string,
) => {
  supabase
    .from('auction_status')
    .update({ winner: walletAddress })
    .eq('id', idAuction)
    .then(result => {
      console.log('res', result);
    });
};
