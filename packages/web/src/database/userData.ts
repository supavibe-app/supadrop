import { useEffect, useState } from 'react';

import { supabase, UserData } from '@oyster/common';
import moment from 'moment';

interface IGetUserData {
  loading: boolean;
  data: UserData | undefined;
}
interface IGetUsernameByPublicKeys {
  loading: boolean;
  data: any;
}
interface IGetDataNFTByPublicKeys {
  loading: boolean;
  created: any;
  onSale: any;
}
interface IGetDataActiveBids {
  loading: boolean;
  data: any;
}

const getUserData = publicKey => {
  const [result, setResult] = useState<IGetUserData>({
    loading: true,
    data: undefined,
  });

  useEffect(() => {
    if (!result.data && publicKey) {
      supabase
        .from('user_data')
        .select('*')
        .or(`wallet_address.eq.${publicKey},username.eq.${publicKey}`)
        .limit(1)
        .then(res => setResult({ loading: false, data: res.data?.[0] }));
    }
  }, [result.data, publicKey]);

  const refetch = () => setResult({ loading: true, data: undefined });

  return { ...result, refetch };
};
export const getDataNFT = publicKey => {
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
export const getActiveBids = publicKey => {
  const [result, setResult] = useState<IGetDataActiveBids>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (publicKey) {
      supabase
        .from('action_bidding')
        .select(
          `
        *,
        auction_status (
          *,
          nft_data(*)
          ,winner(*)
          ,owner(*)
        ),
        user_data(*)
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
  }, [publicKey]);

  const refetch = () => setResult({ loading: true, data: [] });

  return { ...result, refetch };
};
export const getInfoEndedBidding = publicKey => {
  const [result, setResult] = useState<IGetDataActiveBids>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (publicKey) {
      supabase
        .from('action_bidding')
        .select(
          `
      *,
      id_auction (
        *,
        nft_data(name)
      )
      `,
        )
        .eq('wallet_address', publicKey)
        .eq('is_redeem', false)
        .lt('auction_status.end_auction', moment().unix())
        .then(action => {
          if (action.body != null) {
            if (action.body.length) {
              setResult({ loading: false, data: action.body });
            }
          }
        });
    }
  }, [publicKey]);

  const refetch = () => setResult({ loading: true, data: [] });

  return { ...result, refetch };
};

export const getOnSale = publicKey => {
  const [result, setResult] = useState<IGetDataActiveBids>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (publicKey) {
      supabase
        .from('auction_status')
        .select(
          `
        *,
        nft_data(*)
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
  }, [publicKey]);

  const refetch = () => setResult({ loading: true, data: [] });

  return { ...result, refetch };
};

export const getEndedOnSale = publicKey => {
  const [result, setResult] = useState<IGetDataActiveBids>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (publicKey) {
      supabase
        .from('auction_status')
        .select(
          `
        *,
        nft_data(*)
        `,
        )
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

  const refetch = () => setResult({ loading: true, data: [] });

  return { ...result, refetch };
};

export const getUsernameByPublicKeys = publicKeys => {
  const [result, setResult] = useState<IGetUsernameByPublicKeys>({
    loading: true,
    data: undefined,
  });

  useEffect(() => {
    if (
      (!result.data || Object.keys(result.data).length === 0) &&
      publicKeys.length
    ) {
      supabase
        .from('user_data')
        .select('*')
        .in('wallet_address', publicKeys)
        .then(res => {
          const dataResult = res.data || [];
          const resultObj = dataResult.reduce(
            (acc, curr) => ((acc[curr.wallet_address] = curr), acc),
            {},
          );
          const publicKeysObj = publicKeys.reduce(
            (acc, curr) => ((acc[curr] = null), acc),
            {},
          );

          setResult({ loading: false, data: resultObj || publicKeysObj });
        });
    }
  }, [result.data, publicKeys]);

  const refetch = () => setResult({ loading: true, data: undefined });

  return { ...result, refetch };
};

export default getUserData;
