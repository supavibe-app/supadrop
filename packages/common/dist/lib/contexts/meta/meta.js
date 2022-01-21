"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMeta = exports.MetaProvider = void 0;
const react_1 = __importStar(require("react"));
const queryExtendedMetadata_1 = require("./queryExtendedMetadata");
const subscribeAccountsChange_1 = require("./subscribeAccountsChange");
const getEmptyMetaState_1 = require("./getEmptyMetaState");
const loadAccounts_1 = require("./loadAccounts");
const types_1 = require("./types");
const connection_1 = require("../connection");
const store_1 = require("../store");
const actions_1 = require("../../actions");
const _1 = require(".");
const __1 = require("../..");
const supabaseClient_1 = require("../../supabaseClient");
const moment_1 = __importDefault(require("moment"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const __2 = require("..");
const MetaContext = react_1.default.createContext({
    ...getEmptyMetaState_1.getEmptyMetaState(),
    isLoadingMetaplex: false,
    isLoadingDatabase: false,
    art: {},
    endingTime: 0,
    isBidPlaced: false,
    liveDataAuctions: [],
    endedAuctions: [],
    notifBidding: [],
    notifAuction: [],
    allDataAuctions: {},
    dataCollection: new types_1.Collection('', '', '', 0, 0, 0, 0, []),
    userData: new __2.UserData('', '', '', '', '', '', '', '', ''),
    // @ts-ignore
    update: () => [actions_1.AuctionData, actions_1.BidderMetadata, actions_1.BidderPot],
    // @ts-ignore
    updateLiveDataAuction: function () { },
    updateUserData: function () { },
    updateAllDataAuction: function () { },
    updateDetailAuction: function () { },
    updateNotifBidding: function () { },
    updateNotifAuction: function () { },
    updateArt: function () { },
});
function MetaProvider({ children = null }) {
    const connection = connection_1.useConnection();
    const { isReady, storeAddress } = store_1.useStore();
    const { publicKey } = wallet_adapter_react_1.useWallet();
    const [art, setArt] = react_1.useState({});
    const [dataCollection, setDataCollection] = react_1.useState(new types_1.Collection('', '', '', 0, 0, 0, 0, []));
    const [userData, setUserData] = react_1.useState(new __2.UserData('', '', '', '', '', '', '', '', ''));
    const [endingTime, setEndingTime] = react_1.useState(0);
    const [state, setState] = react_1.useState(getEmptyMetaState_1.getEmptyMetaState());
    const [liveDataAuctions, setLiveDataAuction] = react_1.useState([]);
    const [endedAuctions, setEndedAuctions] = react_1.useState([]);
    const [notifBidding, setNotifBidding] = react_1.useState([]);
    const [notifAuction, setNotifAuction] = react_1.useState([]);
    const [allDataAuctions, setAllDataAuction] = react_1.useState({});
    const [page, setPage] = react_1.useState(0);
    const [metadataLoaded, setMetadataLoaded] = react_1.useState(false);
    const [lastLength, setLastLength] = react_1.useState(0);
    const { userAccounts } = __1.useUserAccounts();
    const [isLoadingMetaplex, setIsLoadingMetaplex] = react_1.useState(true);
    const [isLoadingDatabase, setIsLoadingDatabase] = react_1.useState(true);
    const [isBidPlaced, setBidPlaced] = react_1.useState(false);
    const updateMints = react_1.useCallback(async (metadataByMint) => {
        try {
            const { metadata, mintToMetadata } = await queryExtendedMetadata_1.queryExtendedMetadata(connection, metadataByMint);
            setState(current => ({
                ...current,
                metadata,
                metadataByMint: mintToMetadata,
            }));
        }
        catch (er) {
            console.error(er);
        }
    }, [setState]);
    async function pullAllMetadata() {
        if (isLoadingMetaplex)
            return false;
        if (!storeAddress) {
            if (isReady) {
                setIsLoadingMetaplex(false);
            }
            return;
        }
        else if (!state.store) {
            setIsLoadingMetaplex(true);
        }
        setIsLoadingMetaplex(true);
        const nextState = await _1.pullStoreMetadata(connection, state);
        setIsLoadingMetaplex(false);
        setState(nextState);
        await updateMints(nextState.metadataByMint);
        return [];
    }
    async function pullBillingPage(auctionAddress) {
        if (isLoadingMetaplex)
            return false;
        if (!storeAddress) {
            if (isReady) {
                setIsLoadingMetaplex(false);
            }
            return;
        }
        else if (!state.store) {
            setIsLoadingMetaplex(true);
        }
        const nextState = await _1.pullAuctionSubaccounts(connection, auctionAddress, state);
        console.log('-----> Pulling all payout tickets');
        await _1.pullPayoutTickets(connection, nextState);
        setState(nextState);
        await updateMints(nextState.metadataByMint);
        return [];
    }
    async function pullAuctionPage(auctionAddress) {
        if (isLoadingMetaplex)
            return state;
        if (!storeAddress) {
            if (isReady) {
                setIsLoadingMetaplex(false);
            }
            return state;
        }
        else if (!state.store) {
            setIsLoadingMetaplex(true);
        }
        const nextState = await _1.pullAuctionSubaccounts(connection, auctionAddress, state);
        setState(nextState);
        await updateMints(nextState.metadataByMint);
        return nextState;
    }
    async function pullItemsPage(userTokenAccounts) {
        if (isLoadingMetaplex) {
            return;
        }
        if (!storeAddress) {
            return setIsLoadingMetaplex(false);
        }
        else if (!state.store) {
            setIsLoadingMetaplex(true);
        }
        const shouldEnableNftPacks = process.env.NEXT_ENABLE_NFT_PACKS === 'true';
        const packsState = shouldEnableNftPacks
            ? await loadAccounts_1.pullPacks(connection, state, publicKey)
            : state;
        await pullUserMetadata(userTokenAccounts, packsState);
    }
    async function pullUserMetadata(userTokenAccounts, tempState) {
        const nextState = await loadAccounts_1.pullYourMetadata(connection, userTokenAccounts, tempState || state);
        await updateMints(nextState.metadataByMint);
        setState(nextState);
    }
    async function pullAllSiteData() {
        if (isLoadingMetaplex)
            return state;
        if (!storeAddress) {
            if (isReady) {
                setIsLoadingMetaplex(false);
            }
            return state;
        }
        else if (!state.store) {
            setIsLoadingMetaplex(true);
        }
        console.log('------->Query started');
        const nextState = await loadAccounts_1.loadAccounts(connection);
        console.log('------->Query finished');
        setState(nextState);
        await updateMints(nextState.metadataByMint);
        return;
    }
    async function updateArt(nftData) {
        const data = {};
        nftData.forEach((item) => {
            data[item.id] = item;
        });
        setArt({ ...art, ...data });
    }
    async function updateLiveDataAuction() {
        supabaseClient_1.supabase
            .from('auction_status')
            .select(`
    *,
    owner(img_profile,wallet_address,username),
    id_nft (
      *
    )
    `)
            .gt('end_auction', moment_1.default().unix())
            .order('end_auction', { ascending: true })
            .then(dataAuction => {
            let listData = [];
            if (dataAuction.body != null && dataAuction.body.length > 0) {
                dataAuction.body.forEach(v => {
                    listData.push(new types_1.ItemAuction(v.id, v.id_nft.name, v.id_nft.id, v.token_mint, v.price_floor, v.id_nft.original_file, v.id_nft.thumbnail, v.id_nft.media_type, v.start_auction, v.end_auction, v.highest_bid, v.price_tick, v.gap_time, v.tick_size_ending_phase, v.vault, v.id_nft.arweave_link, v.owner.wallet_address, v.winner, v.id_nft.mint_key, v.type_auction, v.owner.img_profile, v.owner.username));
                });
                setEndingTime(dataAuction.body[dataAuction.body.length - 1].end_auction);
                setLiveDataAuction(listData);
            }
        });
    }
    async function getUserData(publicKey) {
        supabaseClient_1.supabase
            .from('user_data')
            .select('*')
            .eq(`wallet_address`, publicKey)
            .limit(1)
            .single()
            .then(res => {
            if (res.body) {
                const { bio, created_at, img_profile, name, twitter, updated_at, username, wallet_address, website, } = res.body;
                let data = new __2.UserData(bio, created_at, img_profile, name, twitter, updated_at, username, website, wallet_address);
                setUserData(data);
            }
        });
    }
    async function updateUserData(data) {
        setUserData(data);
    }
    async function updateEndedAuction() {
        supabaseClient_1.supabase
            .from('auction_status')
            .select(`
    *,
    owner(img_profile,wallet_address,username),
    id_nft (
      *
    )
    `)
            .lt('end_auction', moment_1.default().unix())
            .eq('type_auction', false)
            .order('end_auction', { ascending: false })
            .then(dataAuction => {
            let listData = [];
            if (dataAuction.body != null && dataAuction.body.length > 0) {
                dataAuction.body.forEach(v => {
                    listData.push(new types_1.ItemAuction(v.id, v.id_nft.name, v.id_nft.id, v.token_mint, v.price_floor, v.id_nft.original_file, v.id_nft.thumbnail, v.id_nft.media_type, v.start_auction, v.end_auction, v.highest_bid, v.price_tick, v.gap_time, v.tick_size_ending_phase, v.vault, v.id_nft.arweave_link, v.owner.wallet_address, v.winner, v.id_nft.mint_key, v.type_auction, v.owner.img_profile, v.owner.username));
                });
                setEndedAuctions(listData);
            }
        });
    }
    async function getNotifBidding(publicKey) {
        supabaseClient_1.supabase
            .from('action_bidding')
            .select(`*,
      id_auction (*)
  `)
            .eq('wallet_address', publicKey)
            .eq('is_redeem', false)
            .then(action => {
            if (action.body != null) {
                if (action.body.length) {
                    const data = action.body.filter(val => val.id_auction.end_auction < moment_1.default().unix());
                    setNotifBidding(data);
                }
            }
        });
    }
    // if type_auction is true, it's an instant sale -> isLiveMarket
    // if type_auction is false, it's an auction -> end auction less than current time
    async function getNotifAuction(publicKey) {
        supabaseClient_1.supabase
            .from('auction_status')
            .select()
            .eq('owner', publicKey)
            .eq('is_redeem', false)
            .eq('isLiveMarket', false)
            .lt(`end_auction`, moment_1.default().unix())
            .then(data => {
            if (data.body) {
                setNotifAuction(data.body);
            }
        });
    }
    async function updateNotifBidding(id) {
        const data = [];
        notifBidding.forEach(v => {
            if (v.id !== id) {
                data.push(v);
            }
        });
        setNotifBidding(data);
    }
    async function updateNotifAuction(id) {
        const data = [];
        notifAuction.forEach(v => {
            if (v.id !== id) {
                data.push(v);
            }
        });
        setNotifAuction(data);
    }
    async function updateDetailAuction(idAuction) {
        supabaseClient_1.supabase
            .from('auction_status')
            .select(`
    *,
    id_nft (
      *
    )
    `)
            .eq('id', idAuction)
            .single()
            .then(dataAuction => {
            if (dataAuction.body != null && dataAuction.body.length > 0) {
                let detailAuction = new types_1.ItemAuction(dataAuction.body.id, dataAuction.body.id_nft.name, dataAuction.body.id_nft.id, dataAuction.body.token_mint, dataAuction.body.price_floor, dataAuction.body.id_nft.original_file, dataAuction.body.id_nft.thumbnail, dataAuction.body.id_nft.media_type, dataAuction.body.start_auction, dataAuction.body.end_auction, dataAuction.body.highest_bid, dataAuction.body.price_tick, dataAuction.body.gap_time, dataAuction.body.tick_size_ending_phase, dataAuction.body.vault, dataAuction.body.id_nft.arweave_link, dataAuction.body.owner, dataAuction.body.winner, dataAuction.body.id_nft.mint_key, dataAuction.body.type_auction);
                if (detailAuction.endAt > moment_1.default().unix()) {
                    const dataUpdate = [];
                    liveDataAuctions.forEach(v => {
                        if (v.id === idAuction) {
                            dataUpdate.push(detailAuction);
                        }
                        else {
                            dataUpdate.push(v);
                        }
                    });
                    setLiveDataAuction(dataUpdate);
                }
                setAllDataAuction({ ...allDataAuctions, detailAuction });
                setIsLoadingDatabase(false);
            }
        });
    }
    async function updateAllDataAuction() {
        setIsLoadingDatabase(true);
        supabaseClient_1.supabase
            .from('auction_status')
            .select(`
    *,
    id_nft (
      *
    )
    `)
            .then(dataAuction => {
            let listData = {};
            if (dataAuction.body != null && dataAuction.body.length > 0) {
                dataAuction.body.forEach(v => {
                    listData[v.id] = new types_1.ItemAuction(v.id, v.id_nft.name, v.id_nft.id, v.token_mint, v.price_floor, v.id_nft.original_file, v.id_nft.thumbnail, v.id_nft.media_type, v.start_auction, v.end_auction, v.highest_bid, v.price_tick, v.gap_time, v.tick_size_ending_phase, v.vault, v.id_nft.arweave_link, v.owner, v.winner, v.id_nft.mint_key, v.type_auction);
                });
                setAllDataAuction(listData);
                setIsLoadingDatabase(false);
            }
        });
    }
    async function getDataCollection() {
        supabaseClient_1.supabase
            .from('collections')
            .select(`*`)
            .eq('id', 1)
            .then(data => {
            if (data.body != null) {
                const { id, name, description, supply, price, sold, start_publish, sample_images, } = data.body[0];
                let collection = new types_1.Collection(id, name, description, supply, price, sold, start_publish, sample_images);
                setDataCollection(collection);
            }
        });
    }
    async function update(auctionAddress, bidderAddress, userTokenAccounts) {
        if (!storeAddress) {
            if (isReady) {
                //@ts-ignore
                window.loadingData = false;
                setIsLoadingMetaplex(false);
            }
            return;
        }
        else if (!state.store) {
            //@ts-ignore
            window.loadingData = true;
            setIsLoadingMetaplex(true);
        }
        console.log('-----> Query started', new Date());
        Promise.all([
            updateLiveDataAuction(),
            updateAllDataAuction(),
            updateEndedAuction(),
            getDataCollection(),
        ]);
        let nextState = await _1.pullPage(connection, page, state);
        if (nextState.storeIndexer.length) {
            if (loadAccounts_1.USE_SPEED_RUN) {
                nextState = await loadAccounts_1.limitedLoadAccounts(connection);
                console.log('------->Query finished', new Date());
                setState(nextState);
                //@ts-ignore
                window.loadingData = false;
                setIsLoadingMetaplex(false);
            }
            else {
                console.log('------->Pagination detected, pulling page', page);
                // Ensures we get the latest so beat race conditions and avoid double pulls.
                let currMetadataLoaded = false;
                setMetadataLoaded(loaded => {
                    currMetadataLoaded = loaded;
                    return loaded;
                });
                if (userTokenAccounts &&
                    userTokenAccounts.length &&
                    !currMetadataLoaded) {
                    console.log('--------->User metadata loading now.');
                    setMetadataLoaded(true);
                    nextState = await loadAccounts_1.pullYourMetadata(connection, userTokenAccounts, nextState);
                }
                const auction = window.location.href.match(/auction\/(\w+)/);
                const billing = window.location.href.match(/auction\/(\w+)\/settle/);
                if (auction && page == 0) {
                    console.log('---------->Loading auction page on initial load, pulling sub accounts');
                    nextState = await _1.pullAuctionSubaccounts(connection, auction[1], nextState);
                    if (billing) {
                        console.log('-----> Pulling all payout tickets');
                        await _1.pullPayoutTickets(connection, nextState);
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
        }
        else {
            console.log('------->No pagination detected');
            nextState = !loadAccounts_1.USE_SPEED_RUN
                ? await loadAccounts_1.loadAccounts(connection)
                : await loadAccounts_1.limitedLoadAccounts(connection);
            console.log('------->Query finished', new Date());
            setState(nextState);
            //@ts-ignore
            window.loadingData = false;
            setIsLoadingMetaplex(false);
        }
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
    react_1.useEffect(() => {
        //@ts-ignore
        if (window.loadingData) {
            console.log('currently another update is running, so queue for 3s...');
            const interval = setInterval(() => {
                //@ts-ignore
                if (window.loadingData) {
                    console.log('not running queued update right now, still loading');
                }
                else {
                    console.log('running queued update');
                    update(undefined, undefined, userAccounts);
                    clearInterval(interval);
                }
            }, 3000);
        }
        else {
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
    react_1.useEffect(() => {
        if (isLoadingMetaplex) {
            return;
        }
        return subscribeAccountsChange_1.subscribeAccountsChange(connection, () => state, setState);
    }, [connection, setState, isLoadingMetaplex, state]);
    react_1.useEffect(() => {
        if (publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58()) {
            getNotifAuction(publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58());
            getNotifBidding(publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58());
            getUserData(publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58());
        }
    }, [publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58()]);
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
    return (react_1.default.createElement(MetaContext.Provider, { value: {
            ...state,
            // @ts-ignore
            update,
            pullAuctionPage,
            pullAllMetadata,
            pullBillingPage,
            pullAllSiteData,
            isLoadingMetaplex,
            isLoadingDatabase,
            dataCollection,
            endingTime,
            liveDataAuctions,
            endedAuctions,
            notifBidding,
            notifAuction,
            updateUserData,
            userData,
            allDataAuctions,
            updateLiveDataAuction,
            updateAllDataAuction,
            updateDetailAuction,
            updateNotifAuction,
            updateNotifBidding,
            isBidPlaced,
            setBidPlaced,
            art,
            updateArt,
            pullItemsPage,
        } }, children));
}
exports.MetaProvider = MetaProvider;
const useMeta = () => {
    const context = react_1.useContext(MetaContext);
    return context;
};
exports.useMeta = useMeta;
//# sourceMappingURL=meta.js.map