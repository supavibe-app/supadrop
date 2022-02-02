import { UserData } from '@oyster/common';

export interface IGetDataNFTByPublicKeys {
  loading: boolean;
  created: any;
  onSale: any;
}
export interface IGetDataDB {
  loading: boolean;
  data: any;
}

// User
export interface IGetUserData {
  loading: boolean;
  data: UserData | undefined;
}
export interface IGetUsernameByPublicKeys {
  loading: boolean;
  data: any;
}
