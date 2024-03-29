import React, { useCallback, useContext, useEffect, useState } from 'react';
import { queryExtendedMetadata } from './queryExtendedMetadata';
import { subscribeAccountsChange } from './subscribeAccountsChange';
import { getEmptyMetaState } from './getEmptyMetaState';
import {
  limitedLoadAccounts,
  loadAccounts,
  pullPacks,
  pullYourMetadata,
  USE_SPEED_RUN,
} from './loadAccounts';
import { MetaContextState, MetaState, ItemAuction, Collection } from './types';
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
import { supabase } from '../../supabaseClient';
import moment from 'moment';
import { useWallet } from '@solana/wallet-adapter-react';
import { UserData } from '../';
const MetaContext = React.createContext<MetaContextState>({
  ...getEmptyMetaState(),
  isLoadingMetaplex: false,
  isLoadingDatabase: false,
  isLoadingAllMetadata: false,
  counterPullAllMetadata: 0,
  art: {},
  users: {},
  endingTime: 0,
  isBidPlaced: false,
  notifBidding: [],
  notifAuction: [],
  allDataAuctions: {},
  dataCollection: new Collection('', '', '', 0, 0, 0, 0, []),
  userData: new UserData('', '', '', '', '', '', '', '', ''),
  // @ts-ignore
  update: () => [AuctionData, BidderMetadata, BidderPot],
  // @ts-ignore
  updateUserData: function () {},
  updateDetailAuction: function () {},
  updateNotifBidding: function () {},
  updateNotifAuction: function () {},
  updateArt: function () {},
  updateUsers: function () {},
  updateAllNotification: function () {},
});

export function MetaProvider({ children = null as any }) {
  const connection = useConnection();
  const wallet = useWallet();
  const { isReady, storeAddress } = useStore();
  const { publicKey } = useWallet();
  const [art, setArt] = useState<any>({});
  const [users, setUsers] = useState<any>({});
  const [counterPullAllMetadata, setCounterPullAllMetadata] = useState(0);
  const [dataCollection, setDataCollection] = useState<Collection>(
    new Collection('', '', '', 0, 0, 0, 0, []),
  );
  const [userData, setUserData] = useState<UserData>(
    new UserData('', '', '', '', '', '', '', '', ''),
  );
  const [endingTime, setEndingTime] = useState(0);
  const [state, setState] = useState<MetaState>(getEmptyMetaState());
  const [notifBidding, setNotifBidding] = useState<any[]>([]);
  const [notifAuction, setNotifAuction] = useState<any[]>([]);
  const [allDataAuctions, setAllDataAuction] = useState<{
    [key: string]: ItemAuction;
  }>({});
  const [page, setPage] = useState(0);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [lastLength, setLastLength] = useState(0);
  const { userAccounts } = useUserAccounts();

  const [isLoadingMetaplex, setIsLoadingMetaplex] = useState(true);
  const [isLoadingDatabase, setIsLoadingDatabase] = useState(true);
  const [isLoadingAllMetadata, setIsLoadingAllMetadata] = useState(false);
  const [isBidPlaced, setBidPlaced] = useState(false);

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
  // get data from supabase

  async function getUserData(publicKey: string) {
    supabase
      .from('user_data')
      .select('*')
      .eq(`wallet_address`, publicKey)
      .limit(1)
      .single()
      .then(res => {
        if (res.body) {
          const {
            bio,
            created_at,
            img_profile,
            name,
            twitter,
            updated_at,
            username,
            wallet_address,
            website,
          } = res.body;
          let data = new UserData(
            bio,
            created_at,
            img_profile,
            name,
            twitter,
            updated_at,
            username,
            website,
            wallet_address,
          );

          setUserData(data);
        }
      });
  }
  async function updateUserData(data: UserData) {
    setUserData(data);
  }

  async function getNotifBidding(publicKey: string) {
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
            setNotifBidding(data);
          }
        }
      });
  }
  async function updateAllNotification(publicKey: string) {
    getNotifAuction(publicKey);
    getNotifBidding(publicKey);
  }
  //TODO for now is not problem because data user still small (need improvement)
  async function getAllDataUser() {
    supabase
      .from('user_data')
      .select()
      .then(userData => {
        if (userData.body) {
          updateUsers(userData.body);
        }
      });
  }
  // if type_auction is true, it's an instant sale -> isLiveMarket
  // if type_auction is false, it's an auction -> end auction less than current time
  async function getNotifAuction(publicKey: string) {
    supabase
      .from('auction_status')
      .select()
      .eq('owner', publicKey)
      .eq('is_redeem', false)
      .eq('isLiveMarket', false)
      .lt(`end_auction`, moment().unix())
      .then(data => {
        if (data.body) {
          setNotifAuction(data.body);
        }
      });
  }
  async function updateNotifBidding(id: string) {
    const data: any[] = [];
    notifBidding.forEach(v => {
      if (v.id !== id) {
        data.push(v);
      }
    });
    setNotifBidding(data);
  }
  async function updateNotifAuction(id: string) {
    const data: any[] = [];
    notifAuction.forEach(v => {
      if (v.id !== id) {
        data.push(v);
      }
    });
    setNotifAuction(data);
  }
  async function updateDetailAuction(idAuction: string) {
    supabase
      .from('auction_status')
      .select(
        `
    *,
    id_nft (
      *
    )
    `,
      )
      .eq('id', idAuction)
      .single()
      .then(dataAuction => {
        if (dataAuction.body != null && dataAuction.body.length > 0) {
          let detailAuction = new ItemAuction(
            dataAuction.body.id,
            dataAuction.body.id_nft.name,
            dataAuction.body.id_nft.id,
            dataAuction.body.token_mint,
            dataAuction.body.price_floor,
            dataAuction.body.id_nft.original_file,
            dataAuction.body.id_nft.thumbnail,
            dataAuction.body.id_nft.media_type,
            dataAuction.body.start_auction,
            dataAuction.body.end_auction,
            dataAuction.body.highest_bid,
            dataAuction.body.price_tick,
            dataAuction.body.gap_time,
            dataAuction.body.tick_size_ending_phase,
            dataAuction.body.vault,
            dataAuction.body.id_nft.arweave_link,
            dataAuction.body.owner,
            dataAuction.body.winner,
            dataAuction.body.id_nft.mint_key,
            dataAuction.body.type_auction,
            dataAuction.body.id_nft.royalty,
          );

          setAllDataAuction({ ...allDataAuctions, detailAuction });
          setIsLoadingDatabase(false);
        }
      });
  }

  async function updateAllDataAuction() {
    setIsLoadingDatabase(true);
    supabase
      .from('auction_status')
      .select(
        `
    *,
    id_nft (
      *
    )
    `,
      )
      .then(dataAuction => {
        let listData: { [key: string]: ItemAuction } = {};
        if (dataAuction.body != null && dataAuction.body.length > 0) {
          dataAuction.body.forEach(v => {
            listData[v.id] = new ItemAuction(
              v.id,
              v.id_nft.name,
              v.id_nft.id,
              v.token_mint,
              v.price_floor,
              v.id_nft.original_file,
              v.id_nft.thumbnail,
              v.id_nft.media_type,
              v.start_auction,
              v.end_auction,
              v.highest_bid,
              v.price_tick,
              v.gap_time,
              v.tick_size_ending_phase,
              v.vault,
              v.id_nft.arweave_link,
              v.owner,
              v.winner,
              v.id_nft.mint_key,
              v.type_auction,
              v.id_nft.royalty,
            );
          });

          setAllDataAuction(listData);
          setIsLoadingDatabase(false);
        }
      });
  }
  async function getDataCollection() {
    supabase
      .from('collections')
      .select(`*`)
      .eq('id', 1)
      .then(data => {
        if (data.body != null) {
          const {
            id,
            name,
            description,
            supply,
            price,
            sold,
            start_publish,
            sample_images,
          } = data.body[0];
          let collection = new Collection(
            id,
            name,
            description,
            supply,
            price,
            sold,
            start_publish,
            sample_images,
          );
          setDataCollection(collection);
        }
      });
  }
  // --------------
  async function pullAllMetadata() {
    if (isLoadingMetaplex) return false;
    if (!storeAddress) {
      if (isReady) {
        setIsLoadingMetaplex(false);
      }
      return;
    } else if (!state.store) {
      setIsLoadingMetaplex(true);
    }

    setIsLoadingAllMetadata(true);
    console.log(
      '🚀 ~ file: meta.tsx ~ line 350 ~ pullAllMetadata ~ start',
      new Date(),
    );
    setIsLoadingMetaplex(true);
    const nextState = await pullStoreMetadata(connection, state);

    setIsLoadingMetaplex(false);
    setState(nextState);
    await updateMints(nextState.metadataByMint);
    setIsLoadingAllMetadata(false);
    setCounterPullAllMetadata(counterPullAllMetadata + 1);
    console.log(
      '🚀 ~ file: meta.tsx ~ line 359 ~ pullAllMetadata ~ finish',
      new Date(),
    );
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
  async function pullItemsPage(
    userTokenAccounts: TokenAccount[],
  ): Promise<void> {
    if (isLoadingMetaplex) {
      return;
    }
    if (!storeAddress) {
      return setIsLoadingMetaplex(false);
    } else if (!state.store) {
      setIsLoadingMetaplex(true);
    }

    const shouldEnableNftPacks = process.env.NEXT_ENABLE_NFT_PACKS === 'true';
    const packsState = shouldEnableNftPacks
      ? await pullPacks(connection, state, publicKey)
      : state;

    await pullUserMetadata(userTokenAccounts, packsState);
  }
  async function pullUserMetadata(
    userTokenAccounts: TokenAccount[],
    tempState?: MetaState,
  ): Promise<void> {
    const nextState = await pullYourMetadata(
      connection,
      userTokenAccounts,
      tempState || state,
    );
    await updateMints(nextState.metadataByMint);

    setState(nextState);
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
  async function updateArt(nftData: any) {
    const data: any = {};
    nftData.forEach((item: any) => {
      data[item.id] = item;
    });
    setArt({ ...art, ...data });
  }

  async function updateUsers(userData: any) {
    const data: any = {};
    userData.forEach((item: any) => {
      data[item.wallet_address] = item;
    });
    setUsers({ ...users, ...data });
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

    Promise.all([
      getAllDataUser(),
      updateAllDataAuction(),
      getDataCollection(),
    ]);

    const shouldFetchNftPacks = process.env.NEXT_ENABLE_NFT_PACKS === 'true';

    let nextState = await pullPage(
      connection,
      page,
      state,
      wallet?.publicKey,
      shouldFetchNftPacks,
    );
    console.log('-----> Query started', new Date());

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

        const auction = window.location.href.match(/auction\/(\w+)/);
        const billing = window.location.href.match(/auction\/(\w+)\/settle/);

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

        if (currLastLength && nextState.storeIndexer.length > currLastLength) {
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

    console.log('------->set finished', new Date());

    await updateMints(nextState.metadataByMint);

    if (auctionAddress && bidderAddress) {
      nextState = await pullAuctionSubaccounts(
        connection,
        auctionAddress,
        nextState,
      );
      setState(nextState);

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

  useEffect(() => {
    if (publicKey?.toBase58()) {
      getNotifAuction(publicKey?.toBase58());
      getNotifBidding(publicKey?.toBase58());
      getUserData(publicKey?.toBase58());
    }
  }, [publicKey?.toBase58()]);

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
        isLoadingDatabase,
        isLoadingAllMetadata,
        dataCollection,
        endingTime,
        notifBidding,
        notifAuction,
        updateUserData,
        userData,
        allDataAuctions,
        updateDetailAuction,
        updateNotifAuction,
        updateNotifBidding,
        isBidPlaced,
        setBidPlaced,
        art,
        updateArt,
        users,
        updateUsers,
        pullItemsPage,
        updateAllNotification,
        counterPullAllMetadata,
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
