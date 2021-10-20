import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export interface IUserData {
  img_profile: string;
  name: string;
  username: string;
  website: string;
  bio: string;
}

interface IResult {
  loading: boolean;
  data: any;
}

const getUserData = publicKey => {
  const [result, setResult] = useState<IResult>({ loading: true, data: null });

  useEffect(() => {
    if (!result.data) {
      supabase
        .from('user_data')
        .select('*')
        .eq('wallet_address', publicKey)
        .limit(1)
        .then(res => setResult({ loading: false, data: res.data?.[0] }));
    }
  }, [result.data]);

  const refetch = () => setResult({ loading: true, data: null });

  return { ...result, refetch };
};

export default getUserData;
