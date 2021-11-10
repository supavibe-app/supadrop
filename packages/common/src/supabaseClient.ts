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
          .then();
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
          .then(data => {
            console.log('masuk buy now', data);
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
        max_supply: 1,
      },
    ])
    .then();
};

export const supabaseUpdateStatusInstantSale = (idAuction?: string) => {
  supabase
    .from('auction_status')
    .update({ isLiveMarket: false })
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
    .then(data => {
      console.log('masuk kesini', data, `${idAuction}_${walletAddress}`);
    });
};
