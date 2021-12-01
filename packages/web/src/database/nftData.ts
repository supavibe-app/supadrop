import { useEffect, useState } from 'react';

import { supabase } from '@oyster/common';
import { IGetDataDB } from './types';
import moment from 'moment';

export const getCollectedNFT = walletAddress => {
  const [result, setResult] = useState<IGetDataDB>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (walletAddress) {
      supabase
        .from('nft_data')
        .select('*,id_auction(*)')
        .eq('holder', walletAddress)
        .not('creator', 'eq', walletAddress)
        .order('updated_at', { ascending: false })
        .then(res => {
          if (!res.error) {
            setResult({ loading: false, data: res.body });
          }
        });
    }
  }, [walletAddress]);

  const refetch = () => setResult({ loading: true, data: [] });

  return { ...result, refetch };
};

export const getCreatedDataNFT = walletAddress => {
  const [result, setResult] = useState<IGetDataDB>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (walletAddress) {
      supabase
        .from('nft_data')
        .select('*,id_auction(*)')
        .eq('creator', walletAddress)
        .order('created_at', { ascending: false })
        .then(res => {
          if (!res.error) {
            setResult({ loading: false, data: res.body });
          }
        });
    }
  }, [walletAddress]);

  const refetch = () => setResult({ loading: true, data: [] });

  return { ...result, refetch };
};
export const getOnSaleDataNFT = walletAddress => {
  const [result, setResult] = useState<IGetDataDB>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (walletAddress) {
      supabase
        .from('auction_status')
        .select('*')
        .eq('owner', walletAddress)
        .or(`isLiveMarket.eq.true,end_auction.gt.${moment().unix()}`)
        .order('end_auction', { ascending: false })
        .then(res => {
          if (!res.error) {
            setResult({ loading: false, data: res.body });
          }
        });
    }
  }, [walletAddress]);

  const refetch = () => setResult({ loading: true, data: [] });

  return { ...result, refetch };
};
