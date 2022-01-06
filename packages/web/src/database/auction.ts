import { useEffect, useState } from 'react';

import { ItemAuction, supabase } from '@oyster/common';
import moment from 'moment';
import { IGetDataDB } from './types';

export const getLiveDataAuction = () => {
  const [result, setResult] = useState<IGetDataDB>({
    loading: true,
    data: [],
  });
  useEffect(() => {
    supabase
      .from('auction_status')
      .select(
        `
    *,
    owner(img_profile,wallet_address,username),
    id_nft (
      *
    )
    `,
      )
      .gt('end_auction', moment().unix())
      .order('end_auction', { ascending: true })
      .then(dataAuction => {
        const listData: ItemAuction[] = [];
        if (dataAuction.body != null) {
          dataAuction.body.forEach(v => {
            listData.push(
              new ItemAuction(
                v.id,
                v.id_nft.name,
                v.id_nft.id,
                v.token_mint,
                v.price_floor,
                v.id_nft.original_file,
                v.id_nft.thumbnail,
                v.id_nft.media_type,
                v.start_auction,
                v.end_auction,
                v.highest_bid,
                v.price_tick,
                v.gap_time,
                v.tick_size_ending_phase,
                v.vault,
                v.id_nft.arweave_link,
                v.owner.wallet_address,
                v.winner,
                v.id_nft.mint_key,
                v.type_auction,
                v.owner.img_profile,
                v.owner.username,
              ),
            );
          });
          setResult({ loading: false, data: listData });
        }
      });
  }, []);

  const refetch = () => setResult({ loading: true, data: undefined });

  return { ...result, refetch };
};
