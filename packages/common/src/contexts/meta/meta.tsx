import React, { useCallback, useContext, useEffect, useState } from 'react';
import { queryExtendedMetadata } from './queryExtendedMetadata';
import { subscribeAccountsChange } from './subscribeAccountsChange';
import { getEmptyMetaState } from './getEmptyMetaState';
import {
  limitedLoadAccounts,
  loadAccounts,
  pullYourMetadata,
  USE_SPEED_RUN,
} from './loadAccounts';
import { MetaContextState, MetaState, ItemAuction } from './types';
import { useConnection } from '../connection';
import { useStore } from '../store';
import { AuctionData, BidderMetadata, BidderPot } from '../../actions';
import {
  pullAuctionSubaccounts,
  pullPage,
  pullPayoutTickets,
  pullStoreMetadata,
} from '.';
import { StringPublicKey, TokenAccount, useUserAccounts } from '../..';
import {supabase} from '../../supabaseClient'

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
  const [page, setPage] = useState(0);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [lastLength, setLastLength] = useState(0);
  const { userAccounts } = useUserAccounts();

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
  async function pullAllMetadata() {
    if (isLoadingMetaplex) return false;
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
    setIsLoadingMetaplex(true);
    const nextState = await pullStoreMetadata(connection, state);
    setIsLoadingMetaplex(false);
    setState(nextState);
    await updateMints(nextState.metadataByMint);
    return [];
  }

  async function pullBillingPage(auctionAddress: StringPublicKey) {
    if (isLoadingMetaplex) return false;
    if (!storeAddress) {
      if (isReady) {
        setIsLoadingMetaplex(false);
      }
      return;
    } else if (!state.store) {
      setIsLoadingMetaplex(true);
    }
    const nextState = await pullAuctionSubaccounts(
      connection,
      auctionAddress,
      state,
    );

    console.log('-----> Pulling all payout tickets');
    await pullPayoutTickets(connection, nextState);

    setState(nextState);
    await updateMints(nextState.metadataByMint);
    return [];
  }

  async function pullAuctionPage(auctionAddress: StringPublicKey) {
    if (isLoadingMetaplex) return state;
    if (!storeAddress) {
      if (isReady) {
        setIsLoadingMetaplex(false);
      }
      return state;
    } else if (!state.store) {
      setIsLoadingMetaplex(true);
    }
    const nextState = await pullAuctionSubaccounts(
      connection,
      auctionAddress,
      state,
    );
    setState(nextState);
    await updateMints(nextState.metadataByMint);
    return nextState;
  }

  async function pullAllSiteData() {
    if (isLoadingMetaplex) return state;
    if (!storeAddress) {
      if (isReady) {
        setIsLoadingMetaplex(false);
      }
      return state;
    } else if (!state.store) {
      setIsLoadingMetaplex(true);
    }
    console.log('------->Query started');

    const nextState = await loadAccounts(connection);

    console.log('------->Query finished');

    setState(nextState);
    await updateMints(nextState.metadataByMint);
    return;
  }

  async function update(
    auctionAddress?: any,
    bidderAddress?: any,
    userTokenAccounts?: TokenAccount[],
  ) {
    if (!storeAddress) {
      if (isReady) {
        //@ts-ignore
        window.loadingData = false;
        setIsLoadingMetaplex(false);
      }
      return;
    } else if (!state.store) {
      //@ts-ignore
      window.loadingData = true;
      setIsLoadingMetaplex(true);
    }

    console.log('-----> Query started', new Date());

    let nextState = await pullPage(connection, page, state);

    if (nextState.storeIndexer.length) {
      if (USE_SPEED_RUN) {
        nextState = await limitedLoadAccounts(connection);

        console.log('------->Query finished', new Date());

        setState(nextState);

        //@ts-ignore
        window.loadingData = false;
        setIsLoadingMetaplex(false);
      } else {
        console.log('------->Pagination detected, pulling page', page);

        // Ensures we get the latest so beat race conditions and avoid double pulls.
        let currMetadataLoaded = false;
        setMetadataLoaded(loaded => {
          currMetadataLoaded = loaded;
          return loaded;
        });
        if (
          userTokenAccounts &&
          userTokenAccounts.length &&
          !currMetadataLoaded
        ) {
          console.log('--------->User metadata loading now.');

          setMetadataLoaded(true);
          nextState = await pullYourMetadata(
            connection,
            userTokenAccounts,
            nextState,
          );
        }

        const auction = window.location.href.match(/#\/auction\/(\w+)/);
        const billing = window.location.href.match(
          /#\/auction\/(\w+)\/billing/,
        );
        if (auction && page == 0) {
          console.log(
            '---------->Loading auction page on initial load, pulling sub accounts',
          );

          nextState = await pullAuctionSubaccounts(
            connection,
            auction[1],
            nextState,
          );

          if (billing) {
            console.log('-----> Pulling all payout tickets');
            await pullPayoutTickets(connection, nextState);
          }
        }

        let currLastLength;
        setLastLength(last => {
          currLastLength = last;
          return last;
        });
        if (nextState.storeIndexer.length != currLastLength) {
          setPage(page => page + 1);
        }
        setLastLength(nextState.storeIndexer.length);

        //@ts-ignore
        window.loadingData = false;
        setIsLoadingMetaplex(false);
        setState(nextState);
      }
    } else {
      console.log('------->No pagination detected');
      nextState = !USE_SPEED_RUN
        ? await loadAccounts(connection)
        : await limitedLoadAccounts(connection);

      console.log('------->Query finished', new Date());

      setState(nextState);

      //@ts-ignore
      window.loadingData = false;
      setIsLoadingMetaplex(false);
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
          listData[v.id] = new ItemAuction(v.id, v.nft_data.name,v.id_nft,v.token_mint,v.price_floor,v.nft_data.img_nft, v.start_auction, v.end_auction, v.highest_bid, v.price_tick, v.gap_time, v.tick_size_ending_phase, v.vault,v.nft_data.arweave_link,v.owner,v.nft_data.mint_key, v.type_auction)
        })
        
        setDataAuction(listData)
        setIsLoadingDatabase(false)
      }
    })

    console.log('------->set finished', new Date());

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
    //@ts-ignore
    if (window.loadingData) {
      console.log('currently another update is running, so queue for 3s...');
      const interval = setInterval(() => {
        //@ts-ignore
        if (window.loadingData) {
          console.log('not running queued update right now, still loading');
        } else {
          console.log('running queued update');
          update(undefined, undefined, userAccounts);
          clearInterval(interval);
        }
      }, 3000);
    } else {
      console.log('no update is running, updating.');
      update(undefined, undefined, userAccounts);
    }
  }, [
    connection,
    setState,
    updateMints,
    storeAddress,
    isReady,
    page,
    userAccounts.length > 0,
  ]);

  useEffect(() => {
    if (isLoadingMetaplex) {
      return;
    }

    return subscribeAccountsChange(connection, () => state, setState);
  }, [connection, setState, isLoadingMetaplex, state]);

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
        pullAuctionPage,
        pullAllMetadata,
        pullBillingPage,
        pullAllSiteData,
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