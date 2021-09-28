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
  isLoadingMetaplex: false,
  isLoadingDatabase: false,
  liveDataAuctions: {},
  // @ts-ignore
  update: () => [AuctionData, BidderMetadata, BidderPot],
});

export function MetaProvider({ children = null as any }) {
  const connection = useConnection();
  const { isReady, storeAddress } = useStore();

  const [state, setState] = useState<MetaState>(getEmptyMetaState());
 const [liveDataAuctions,setDataAuction] = useState<{[key:string]:ItemAuction}>({})
  const [isLoadingMetaplex, setIsLoadingMetaplex] = useState(true);
  const [isLoadingDatabase, setIsLoadingDatabase] = useState(true);

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
        setIsLoadingMetaplex(false);
        setIsLoadingDatabase(false);
      }
      return;
    } else if (!state.store) {
      setIsLoadingMetaplex(true);
      setIsLoadingDatabase(true);
    }

    if (sessionStorage.getItem('testing')) {
      let sessionAuction = JSON.parse(sessionStorage.getItem('testing')||"") as ParsedAccount<AuctionData>

      console.log('session storage masih ada',sessionAuction);
    }else{
      console.log('sessiong storage gk ada');

    }

    //Todo handle not-started, starting, ended
    supabase.from('auction_status')
    .select(`
    *,
    nft_data (
      *
    )
    `)
    .then(dataAuction => {
      let listData : {[key:string]:ItemAuction} =  {}
      if (dataAuction.body != null) {
        dataAuction.body.forEach( v =>{
          listData[v.id] = new ItemAuction(v.id, v.nft_data.name,v.id_nft,v.token_mint,v.price_floor,v.nft_data.img_nft, v.start_auction, v.end_auction, v.highest_bid, v.price_tick, v.gap_time, v.tick_size_ending_phase, v.vault,v.nft_data.arweave_link)
        })
        
        setDataAuction(listData)
        setIsLoadingDatabase(false)
      }
    })

    console.log('-----> Query started', new Date());

    const nextState = !USE_SPEED_RUN
      ? await loadAccounts(connection)
      : await limitedLoadAccounts(connection);

    console.log('------->Query finished');

    setState(nextState);
    setIsLoadingMetaplex(false);

    console.log('------->set finished',new Date());

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
    if (isLoadingMetaplex) {
      return;
    }

    return subscribeAccountsChange(connection, () => state, setState);
  }, [connection, setState, isLoadingMetaplex]);

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
        isLoadingMetaplex,
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