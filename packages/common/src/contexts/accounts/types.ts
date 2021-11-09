import { AccountInfo } from '@solana/web3.js';
import { StringPublicKey } from '../../utils';

export interface ParsedAccountBase {
  pubkey: StringPublicKey;
  account: AccountInfo<Buffer>;
  info: any; // TODO: change to unknown
}

export type AccountParser = (
  pubkey: StringPublicKey,
  data: AccountInfo<Buffer>,
) => ParsedAccountBase | undefined;

export class UserData {
  bio: string;
  created_at: string;
  img_profile: string;
  name: string;
  twitter: string;
  updated_at: string;
  username: string;
  website: string;
  wallet_address: string;

  constructor(
    bio: string,
    created_at: string,
    img_profile: string,
    name: string,
    twitter: string,
    updated_at: string,
    username: string,
    website: string,
    wallet_address: string,
  ) {
    this.bio = bio;
    this.created_at = created_at;
    this.img_profile = img_profile;
    this.name = name;
    this.twitter = twitter;
    this.updated_at = updated_at;
    this.username = username;
    this.website = website;
    this.wallet_address = wallet_address;
  }
}

export interface ParsedAccount<T> extends ParsedAccountBase {
  info: T;
}
