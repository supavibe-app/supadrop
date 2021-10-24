import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

import { UserData } from '@oyster/common';

interface IResult {
  loading: boolean;
  data: UserData | undefined;
}

const getUserData = publicKey => {
  const [result, setResult] = useState<IResult>({
    loading: true,
    data: undefined,
  });

  useEffect(() => {
    console.log(publicKey);
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

export default getUserData;
