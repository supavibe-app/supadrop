import React, { useCallback, useContext, useEffect, useState } from 'react';
import { queryExtendedMetadata } from './queryExtendedMetadata';
import { subscribeAccountsChange } from './subscribeAccountsChange';
import { getEmptyMetaState } from './getEmptyMetaState';
import {
  limitedLoadAccounts,
  loadAccounts,
  USE_SPEED_RUN,
} from './loadAccounts';
import { MetaContextState, MetaState, ItemAuction } from './types';
import { useConnection } from '../connection';
import { useStore } from '../store';
import { AuctionData, BidderMetadata, BidderPot } from '../../actions';

import {supabase} from '../../supabaseClient'
import { ParsedAccount } from '..';

const MetaContext = React.createContext<MetaContextState>({
  ...getEmptyMetaState(),
  isLoading: false,
  // @ts-ignore
  update: () => [AuctionData, BidderMetadata, BidderPot],
});

export function MetaProvider({ children = null as any }) {
  const connection = useConnection();
  const { isReady, storeAddress } = useStore();

  const [state, setState] = useState<MetaState>(getEmptyMetaState());
 const [liveDataAuctions,setDataAuction] = useState<{[key:string]:ItemAuction}>({})
  const [isLoading, setIsLoading] = useState(true);

  const updateMints = useCallback(
    async metadataByMint => {
      try {
        const { metadata, mintToMetadata } = await queryExtendedMetadata(
          connection,
          metadataByMint,
        );
        setState(current => ({
          ...current,
          metadata,
          metadataByMint: mintToMetadata,
        }));
      } catch (er) {
        console.error(er);
      }
    },
    [setState],
  );

  async function update(auctionAddress?: any, bidderAddress?: any) {
    if (!storeAddress) {
      if (isReady) {
        setIsLoading(false);
      }
      return;
    } else if (!state.store) {
      setIsLoading(true);
    }

    if (sessionStorage.getItem('testing')) {
            let sessionAuction = JSON.parse(sessionStorage.getItem('testing')||"") as ParsedAccount<AuctionData>

            console.log('session storage masih ada',sessionAuction);
          }else{
            console.log('sessiong storage gk ada');

          }

    console.log('-----> Query started');

    const nextState = !USE_SPEED_RUN
      ? await loadAccounts(connection)
      : await limitedLoadAccounts(connection);

    console.log('------->Query finished');

    setState(nextState);

//TODO query end date
      supabase.from('auction_status')
        .select(`
        *,
        nft_data (
          *
        )
        `)
        .then(dataAuction=>{
          let listData : {[key:string]:ItemAuction} =  {}
          if (dataAuction.body != null) {
            dataAuction.body.forEach(v=>{
              listData[v.id] =new ItemAuction(v.id,v.id_nft,v.token_mint,v.price_floor,v.nft_data.img_nft)
            })
            setDataAuction(listData)

          }

    setIsLoading(false);
    console.log('------->set finished');

    await updateMints(nextState.metadataByMint);

    if (auctionAddress && bidderAddress) {
      const auctionBidderKey = auctionAddress + '-' + bidderAddress;
      return [
        nextState.auctions[auctionAddress],
        nextState.bidderPotsByAuctionAndBidder[auctionBidderKey],
        nextState.bidderMetadataByAuctionAndBidder[auctionBidderKey],
      ];
    }
  }

  useEffect(() => {
    update();
  }, [connection, setState, updateMints, storeAddress, isReady]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    return subscribeAccountsChange(connection, () => state, setState);
  }, [connection, setState, isLoading]);

  // TODO: fetch names dynamically
  // TODO: get names for creators
  // useEffect(() => {
  //   (async () => {
  //     const twitterHandles = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
  //      filters: [
  //        {
  //           dataSize: TWITTER_ACCOUNT_LENGTH,
  //        },
  //        {
  //          memcmp: {
  //           offset: VERIFICATION_AUTHORITY_OFFSET,
  //           bytes: TWITTER_VERIFICATION_AUTHORITY.toBase58()
  //          }
  //        }
  //      ]
  //     });

  //     const handles = twitterHandles.map(t => {
  //       const owner = new PublicKey(t.account.data.slice(32, 64));
  //       const name = t.account.data.slice(96, 114).toString();
  //     });

  //     console.log(handles);

  //   })();
  // }, [whitelistedCreatorsByCreator]);

  return (
    <MetaContext.Provider
      value={{
        ...state,
        // @ts-ignore
        update,
        isLoading,
        liveDataAuctions
      }}
    >
      {children}
    </MetaContext.Provider>
  );
}

export const useMeta = () => {
  const context = useContext(MetaContext);
  return context;
};
