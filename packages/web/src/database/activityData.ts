import { useEffect, useState } from 'react';

import { supabase } from '@oyster/common';
import moment from 'moment';
import { IGetDataDB } from './types';

export const getActiveBids = publicKey => {
  const [result, setResult] = useState<IGetDataDB>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (publicKey && result.loading) {
      supabase
        .from('action_bidding')
        .select(
          `
        *,
        id_auction (
          *,
          id_nft(*)
        )
        `,
        )
        .eq('wallet_address', publicKey)
        .eq('is_redeem', false)
        .then(data => {
          if (data.body) {
            setResult({ loading: false, data: data.body });
          }
        });
    }
  }, [publicKey, result.loading]);

  const refetch = () => setResult({ loading: true, data: result.data });

  return { ...result, refetch, setResult };
};
export const getOnSale = publicKey => {
  const [result, setResult] = useState<IGetDataDB>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (publicKey && result.loading) {
      supabase
        .from('auction_status')
        .select(
          `
        *,
        id_nft(*)
        `,
        )
        .eq('owner', publicKey)
        .eq('is_redeem', false)
        .then(data => {
          if (data.body) {
            setResult({ loading: false, data: data.body });
          }
        });
    }
  }, [publicKey, result.loading]);

  const refetch = () => setResult({ loading: true, data: result.data });

  return { ...result, refetch, setResult };
};

export const getInfoEndedBidding = publicKey => {
  const [result, setResult] = useState<IGetDataDB>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (publicKey) {
      supabase
        .from('action_bidding')
        .select(
          `*,
          id_auction (*)
      `,
        )
        .eq('wallet_address', publicKey)
        .eq('is_redeem', false)
        .then(action => {
          if (action.body != null) {
            if (action.body.length) {
              const data = action.body.filter(
                val => val.id_auction.end_auction < moment().unix(),
              );
              setResult({ loading: false, data });
            }
          }
        });
    }
  }, [publicKey]);

  const refetch = () => setResult({ loading: true, data: undefined });

  return { ...result, refetch };
};

export const getAuctionIsRedeemData = (publicKey, idAuction) => {
  const [result, setResult] = useState<IGetDataDB>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (publicKey) {
      supabase
        .from('action_bidding')
        .select()
        .eq('wallet_address', publicKey)
        .eq('id_auction', idAuction)
        .eq('is_redeem', true)
        .limit(1)
        .then(result => {
          if (result.body != null) {
            if (result.body.length) {
              // console.log('isRedeem', result.body)
              const data = result.body;
              setResult({ loading: false, data });
            }
          }
        });
    }
  }, [publicKey]);

  const refetch = () => setResult({ loading: true, data: undefined });

  return { ...result, refetch };
};

export const getEndedOnSale = publicKey => {
  const [result, setResult] = useState<IGetDataDB>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (publicKey) {
      supabase
        .from('auction_status')
        .select()
        .eq('owner', publicKey)
        .eq('is_redeem', false)
        .lte('end_auction', moment().unix())
        .then(data => {
          if (data.body) {
            setResult({ loading: false, data: data.body });
          }
        });
    }
  }, [publicKey]);

  const refetch = () => setResult({ loading: true, data: undefined });

  return { ...result, refetch };
};
