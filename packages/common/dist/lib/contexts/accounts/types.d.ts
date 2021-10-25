/// <reference types="node" />
import { AccountInfo } from '@solana/web3.js';
import { StringPublicKey } from '../../utils';
export interface ParsedAccountBase {
    pubkey: StringPublicKey;
    account: AccountInfo<Buffer>;
    info: any;
}
export declare type AccountParser = (pubkey: StringPublicKey, data: AccountInfo<Buffer>) => ParsedAccountBase | undefined;
export declare class UserData {
    bio: string;
    created_at: string;
    img_profile: string;
    name: string;
    twitter: string;
    updated_at: string;
    username: string;
    website: string;
    wallet_address: string;
    constructor(bio: string, created_at: string, img_profile: string, name: string, twitter: string, updated_at: string, username: string, website: string, wallet_address: string);
}
export interface ParsedAccount<T> extends ParsedAccountBase {
    info: T;
}
//# sourceMappingURL=types.d.ts.map