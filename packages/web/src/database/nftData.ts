import { useEffect, useState } from 'react';

import { supabase } from '@oyster/common';
import { IGetDataDB, IGetDataNFTByPublicKeys } from './types';

export const getCollectedNFT = walletAddress => {
  const [result, setResult] = useState<IGetDataDB>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (walletAddress) {
      supabase
        .from('nft_data')
        .select('*')
        .eq('holder', walletAddress)
        .eq('on_sale', false)
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
        .select()
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

export const getCreatedDataNFTOnSale = publicKey => {
  const [result, setResult] = useState<IGetDataNFTByPublicKeys>({
    loading: true,
    created: undefined,
    onSale: undefined,
  });

  useEffect(() => {
    if (!result.created && publicKey) {
      Promise.all([
        supabase
          .from('nft_data')
          .select('*')
          .like('creators', `%"${publicKey}"%`),
        supabase
          .from('user_data')
          .select('*')
          .or(`wallet_address.eq.${publicKey},username.eq.${publicKey}`)
          .limit(1),
      ])
        .then(([created, onSale]) => {
          console.log(created);

          setResult({
            loading: false,
            created: created.data,
            onSale: onSale.data,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [result.created, publicKey, result.onSale]);

  const refetch = () =>
    setResult({ loading: true, created: undefined, onSale: undefined });

  return { ...result, refetch };
};
