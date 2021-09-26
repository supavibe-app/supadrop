import { Metadata } from '../../actions';
import { WhitelistedCreator } from '../../models/metaplex';
import { Connection } from '@solana/web3.js';
import { MetaState } from './types';
import { AccountAndPubkey, MetaState, ProcessAccountsFunc, UpdateStateValueFunc } from './types';
import { ParsedAccount } from '../accounts/types';
export declare const USE_SPEED_RUN = false;
export declare const limitedLoadAccounts: (connection: Connection) => Promise<MetaState>;
export declare const loadAccounts: (connection: Connection) => Promise<MetaState>;
export declare const makeSetter: (state: MetaState) => UpdateStateValueFunc<MetaState>;
export declare const processingAccounts: (updater: UpdateStateValueFunc) => (fn: ProcessAccountsFunc) => (accounts: AccountAndPubkey[]) => Promise<void>;
export declare const metadataByMintUpdater: (metadata: ParsedAccount<Metadata>, state: MetaState) => Promise<MetaState>;
export declare const initMetadata: (metadata: ParsedAccount<Metadata>, whitelistedCreators: Record<string, ParsedAccount<WhitelistedCreator>>, setter: UpdateStateValueFunc) => Promise<void>;
//# sourceMappingURL=loadAccounts.d.ts.map