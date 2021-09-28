"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMetadata = exports.metadataByMintUpdater = exports.processingAccounts = exports.makeSetter = exports.loadAccounts = exports.limitedLoadAccounts = exports.USE_SPEED_RUN = void 0;
const ids_1 = require("../../utils/ids");
const models_1 = require("../../models");
const actions_1 = require("../../actions");
const lodash_1 = require("lodash");
const web3_js_1 = require("@solana/web3.js");
const isMetadataPartOfStore_1 = require("./isMetadataPartOfStore");
const processAuctions_1 = require("./processAuctions");
const processMetaplexAccounts_1 = require("./processMetaplexAccounts");
const processMetaData_1 = require("./processMetaData");
const processVaultData_1 = require("./processVaultData");
const getEmptyMetaState_1 = require("./getEmptyMetaState");
const getMultipleAccounts_1 = require("../accounts/getMultipleAccounts");
const web3_1 = require("./web3");
const createPipelineExecutor_1 = require("../../utils/createPipelineExecutor");
exports.USE_SPEED_RUN = false;
const WHITELISTED_METADATA = ['98vYFjBYS9TguUMWQRPjy2SZuxKuUMcqR4vnQiLjZbte'];
const WHITELISTED_AUCTION = ['D8wMB5iLZnsV7XQjpwqXaDynUtFuDs7cRXvEGNj1NF1e'];
const AUCTION_TO_METADATA = {
    D8wMB5iLZnsV7XQjpwqXaDynUtFuDs7cRXvEGNj1NF1e: [
        '98vYFjBYS9TguUMWQRPjy2SZuxKuUMcqR4vnQiLjZbte',
    ],
};
const AUCTION_TO_VAULT = {
    D8wMB5iLZnsV7XQjpwqXaDynUtFuDs7cRXvEGNj1NF1e: '3wHCBd3fYRPWjd5GqzrXanLJUKRyU3nECKbTPKfVwcFX',
};
const WHITELISTED_AUCTION_MANAGER = [
    '3HD2C8oCL8dpqbXo8hq3CMw6tRSZDZJGajLxnrZ3ZkYx',
];
const WHITELISTED_VAULT = ['3wHCBd3fYRPWjd5GqzrXanLJUKRyU3nECKbTPKfVwcFX'];
const limitedLoadAccounts = async (connection) => {
    const tempCache = getEmptyMetaState_1.getEmptyMetaState();
    const updateTemp = exports.makeSetter(tempCache);
    const forEach = (fn) => async (accounts) => {
        for (const account of accounts) {
            await fn(account, updateTemp);
        }
    };
    const pullMetadata = async (metadata) => {
        const mdKey = new web3_js_1.PublicKey(metadata);
        const md = await connection.getAccountInfo(mdKey);
        const mdObject = actions_1.decodeMetadata(Buffer.from((md === null || md === void 0 ? void 0 : md.data) || new Uint8Array([])));
        const editionKey = await actions_1.getEdition(mdObject.mint);
        const editionData = await connection.getAccountInfo(new web3_js_1.PublicKey(editionKey));
        if (md) {
            //@ts-ignore
            md.owner = md.owner.toBase58();
            processMetaData_1.processMetaData({
                pubkey: metadata,
                account: md,
            }, updateTemp);
            if (editionData) {
                //@ts-ignore
                editionData.owner = editionData.owner.toBase58();
                processMetaData_1.processMetaData({
                    pubkey: editionKey,
                    account: editionData,
                }, updateTemp);
            }
        }
    };
    const pullAuction = async (auction) => {
        const auctionExtendedKey = await actions_1.getAuctionExtended({
            auctionProgramId: ids_1.AUCTION_ID,
            resource: AUCTION_TO_VAULT[auction],
        });
        const auctionData = await getMultipleAccounts_1.getMultipleAccounts(connection, [auction, auctionExtendedKey], 'single');
        if (auctionData) {
            auctionData.keys.map((pubkey, i) => {
                processAuctions_1.processAuctions({
                    pubkey,
                    account: auctionData.array[i],
                }, updateTemp);
            });
        }
    };
    const pullAuctionManager = async (auctionManager) => {
        const auctionManagerKey = new web3_js_1.PublicKey(auctionManager);
        const auctionManagerData = await connection.getAccountInfo(auctionManagerKey);
        if (auctionManagerData) {
            //@ts-ignore
            auctionManagerData.owner = auctionManagerData.owner.toBase58();
            processMetaplexAccounts_1.processMetaplexAccounts({
                pubkey: auctionManager,
                account: auctionManagerData,
            }, updateTemp);
        }
    };
    const pullVault = async (vault) => {
        const vaultKey = new web3_js_1.PublicKey(vault);
        const vaultData = await connection.getAccountInfo(vaultKey);
        if (vaultData) {
            //@ts-ignore
            vaultData.owner = vaultData.owner.toBase58();
            processVaultData_1.processVaultData({
                pubkey: vault,
                account: vaultData,
            }, updateTemp);
        }
    };
    const promises = [
        ...WHITELISTED_METADATA.map(md => pullMetadata(md)),
        ...WHITELISTED_AUCTION.map(a => pullAuction(a)),
        ...WHITELISTED_AUCTION_MANAGER.map(a => pullAuctionManager(a)),
        ...WHITELISTED_VAULT.map(a => pullVault(a)),
        // bidder metadata pull
        ...WHITELISTED_AUCTION.map(a => web3_1.getProgramAccounts(connection, ids_1.AUCTION_ID, {
            filters: [
                {
                    memcmp: {
                        offset: 32,
                        bytes: a,
                    },
                },
            ],
        }).then(forEach(processAuctions_1.processAuctions))),
        // bidder pot pull
        ...WHITELISTED_AUCTION.map(a => web3_1.getProgramAccounts(connection, ids_1.AUCTION_ID, {
            filters: [
                {
                    memcmp: {
                        offset: 64,
                        bytes: a,
                    },
                },
            ],
        }).then(forEach(processAuctions_1.processAuctions))),
        // safety deposit pull
        ...WHITELISTED_VAULT.map(v => web3_1.getProgramAccounts(connection, ids_1.VAULT_ID, {
            filters: [
                {
                    memcmp: {
                        offset: 1,
                        bytes: v,
                    },
                },
            ],
        }).then(forEach(processVaultData_1.processVaultData))),
        // bid redemptions
        ...WHITELISTED_AUCTION_MANAGER.map(a => web3_1.getProgramAccounts(connection, ids_1.METAPLEX_ID, {
            filters: [
                {
                    memcmp: {
                        offset: 9,
                        bytes: a,
                    },
                },
            ],
        }).then(forEach(processMetaplexAccounts_1.processMetaplexAccounts))),
        // safety deposit configs
        ...WHITELISTED_AUCTION_MANAGER.map(a => web3_1.getProgramAccounts(connection, ids_1.METAPLEX_ID, {
            filters: [
                {
                    memcmp: {
                        offset: 1,
                        bytes: a,
                    },
                },
            ],
        }).then(forEach(processMetaplexAccounts_1.processMetaplexAccounts))),
        // prize tracking tickets
        ...Object.keys(AUCTION_TO_METADATA)
            .map(key => AUCTION_TO_METADATA[key]
            .map(md => web3_1.getProgramAccounts(connection, ids_1.METAPLEX_ID, {
            filters: [
                {
                    memcmp: {
                        offset: 1,
                        bytes: md,
                    },
                },
            ],
        }).then(forEach(processMetaplexAccounts_1.processMetaplexAccounts)))
            .flat())
            .flat(),
        // whitelisted creators
        web3_1.getProgramAccounts(connection, ids_1.METAPLEX_ID, {
            filters: [
                {
                    dataSize: models_1.MAX_WHITELISTED_CREATOR_SIZE,
                },
            ],
        }).then(forEach(processMetaplexAccounts_1.processMetaplexAccounts)),
    ];
    await Promise.all(promises);
    await postProcessMetadata(tempCache);
    return tempCache;
};
exports.limitedLoadAccounts = limitedLoadAccounts;
const loadAccounts = async (connection) => {
    const state = getEmptyMetaState_1.getEmptyMetaState();
    const updateState = exports.makeSetter(state);
    const forEachAccount = exports.processingAccounts(updateState);
    const loadVaults = () => web3_1.getProgramAccounts(connection, ids_1.VAULT_ID).then(forEachAccount(processVaultData_1.processVaultData));
    const loadAuctions = () => web3_1.getProgramAccounts(connection, ids_1.AUCTION_ID).then(forEachAccount(processAuctions_1.processAuctions));
    const loadMetaplex = () => web3_1.getProgramAccounts(connection, ids_1.METAPLEX_ID).then(forEachAccount(processMetaplexAccounts_1.processMetaplexAccounts));
    const loadCreators = () => web3_1.getProgramAccounts(connection, ids_1.METAPLEX_ID, {
        filters: [
            {
                dataSize: models_1.MAX_WHITELISTED_CREATOR_SIZE,
            },
        ],
    }).then(forEachAccount(processMetaplexAccounts_1.processMetaplexAccounts));
    const loadMetadata = () => pullMetadataByCreators(connection, state, updateState);
    const loadEditions = () => pullEditions(connection, updateState, state);
    const loading = [
        loadCreators().then(loadMetadata).then(loadEditions),
        loadVaults(),
        loadAuctions(),
        loadMetaplex(),
    ];
    await Promise.all(loading);
    state.metadata = lodash_1.uniqWith(state.metadata, (a, b) => a.pubkey === b.pubkey);
    return state;
};
exports.loadAccounts = loadAccounts;
const pullEditions = async (connection, updater, state) => {
    console.log('Pulling editions for optimized metadata');
    let setOf100MetadataEditionKeys = [];
    const editionPromises = [];
    const loadBatch = () => {
        editionPromises.push(getMultipleAccounts_1.getMultipleAccounts(connection, setOf100MetadataEditionKeys, 'recent').then(processEditions));
        setOf100MetadataEditionKeys = [];
    };
    const processEditions = (returnedAccounts) => {
        for (let j = 0; j < returnedAccounts.array.length; j++) {
            processMetaData_1.processMetaData({
                pubkey: returnedAccounts.keys[j],
                account: returnedAccounts.array[j],
            }, updater);
        }
    };
    for (const metadata of state.metadata) {
        let editionKey;
        if (metadata.info.editionNonce === null) {
            editionKey = await actions_1.getEdition(metadata.info.mint);
        }
        else {
            editionKey = (await web3_js_1.PublicKey.createProgramAddress([
                Buffer.from(actions_1.METADATA_PREFIX),
                ids_1.toPublicKey(ids_1.METADATA_PROGRAM_ID).toBuffer(),
                ids_1.toPublicKey(metadata.info.mint).toBuffer(),
                new Uint8Array([metadata.info.editionNonce || 0]),
            ], ids_1.toPublicKey(ids_1.METADATA_PROGRAM_ID))).toBase58();
        }
        setOf100MetadataEditionKeys.push(editionKey);
        if (setOf100MetadataEditionKeys.length >= 100) {
            loadBatch();
        }
    }
    if (setOf100MetadataEditionKeys.length >= 0) {
        loadBatch();
    }
    await Promise.all(editionPromises);
    console.log('Edition size', Object.keys(state.editions).length, Object.keys(state.masterEditions).length);
};
const pullMetadataByCreators = (connection, state, updater) => {
    console.log('pulling optimized nfts');
    const whitelistedCreators = Object.values(state.whitelistedCreatorsByCreator);
    const setter = async (prop, key, value) => {
        if (prop === 'metadataByMint') {
            await exports.initMetadata(value, state.whitelistedCreatorsByCreator, updater);
        }
        else {
            updater(prop, key, value);
        }
    };
    const forEachAccount = exports.processingAccounts(setter);
    const additionalPromises = [];
    for (const creator of whitelistedCreators) {
        for (let i = 0; i < actions_1.MAX_CREATOR_LIMIT; i++) {
            const promise = web3_1.getProgramAccounts(connection, ids_1.METADATA_PROGRAM_ID, {
                filters: [
                    {
                        memcmp: {
                            offset: 1 + // key
                                32 + // update auth
                                32 + // mint
                                4 + // name string length
                                actions_1.MAX_NAME_LENGTH + // name
                                4 + // uri string length
                                actions_1.MAX_URI_LENGTH + // uri
                                4 + // symbol string length
                                actions_1.MAX_SYMBOL_LENGTH + // symbol
                                2 + // seller fee basis points
                                1 + // whether or not there is a creators vec
                                4 + // creators vec length
                                i * actions_1.MAX_CREATOR_LEN,
                            bytes: creator.info.address,
                        },
                    },
                ],
            }).then(forEachAccount(processMetaData_1.processMetaData));
            additionalPromises.push(promise);
        }
    }
    return Promise.all(additionalPromises);
};
const makeSetter = (state) => (prop, key, value) => {
    if (prop === 'store') {
        state[prop] = value;
    }
    else if (prop === 'metadata') {
        state.metadata.push(value);
    }
    else {
        state[prop][key] = value;
    }
    return state;
};
exports.makeSetter = makeSetter;
const processingAccounts = (updater) => (fn) => async (accounts) => {
    await createPipelineExecutor_1.createPipelineExecutor(accounts.values(), account => fn(account, updater), {
        sequence: 10,
        delay: 1,
        jobsCount: 3,
    });
};
exports.processingAccounts = processingAccounts;
const postProcessMetadata = async (state) => {
    const values = Object.values(state.metadataByMint);
    for (const metadata of values) {
        await exports.metadataByMintUpdater(metadata, state);
    }
};
const metadataByMintUpdater = async (metadata, state) => {
    var _a;
    const key = metadata.info.mint;
    if (isMetadataPartOfStore_1.isMetadataPartOfStore(metadata, state.whitelistedCreatorsByCreator)) {
        await metadata.info.init();
        const masterEditionKey = (_a = metadata.info) === null || _a === void 0 ? void 0 : _a.masterEdition;
        if (masterEditionKey) {
            state.metadataByMasterEdition[masterEditionKey] = metadata;
        }
        state.metadataByMint[key] = metadata;
        state.metadata.push(metadata);
    }
    else {
        delete state.metadataByMint[key];
    }
    return state;
};
exports.metadataByMintUpdater = metadataByMintUpdater;
const initMetadata = async (metadata, whitelistedCreators, setter) => {
    var _a;
    if (isMetadataPartOfStore_1.isMetadataPartOfStore(metadata, whitelistedCreators)) {
        await metadata.info.init();
        setter('metadataByMint', metadata.info.mint, metadata);
        setter('metadata', '', metadata);
        const masterEditionKey = (_a = metadata.info) === null || _a === void 0 ? void 0 : _a.masterEdition;
        if (masterEditionKey) {
            setter('metadataByMasterEdition', masterEditionKey, metadata);
        }
    }
};
exports.initMetadata = initMetadata;
//# sourceMappingURL=loadAccounts.js.map