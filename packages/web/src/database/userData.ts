import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

import { UserData } from '@oyster/common';

interface IGetUserData {
  loading: boolean;
  data: UserData | undefined;
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

interface IGetUsernameByPublicKeys {
  loading: boolean;
  data: any;
}

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
