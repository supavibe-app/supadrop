import React from 'react';
import { Avatar, Col, Row, Skeleton } from 'antd';
import {
  BidderMetadata,
  formatTokenAmount,
  Identicon,
  ItemAuction,
  ParsedAccount,
  shortenAddress,
  useMeta,
  useMint,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';

import { AuctionView } from '../../../hooks';
import {
  GreyColor,
  uBoldFont,
  uFlexAlignItemsCenter,
  YellowGlowColor,
} from '../../../styles';
import { Activity, ActivityHeader, IsMyBid } from './style';
import ProfileAvatar from '../../ProfileAvatar';

const TransactionHistory = ({
  auction,
  bids,
  users,
}: {
  auction: ItemAuction | undefined;
  bids: ParsedAccount<BidderMetadata>[];
  users: any;
}) => {
  const { publicKey } = useWallet();
  const { isLoadingDatabase } = useMeta();
  const mint = useMint(auction?.token_mint);

  const TransactionHistorySkeleton = (
    <div>
      {[...Array(3)].map(i => (
        <Skeleton avatar paragraph={{ rows: 0 }} />
      ))}
    </div>
  );

  return (
    <>
      <div className={ActivityHeader}>
        <div className={YellowGlowColor}>bids history</div>
        {/* <div>activity</div> */}
      </div>

      {isLoadingDatabase && TransactionHistorySkeleton}

      {!isLoadingDatabase && !Boolean(bids.length) && (
        <div className={GreyColor}>
          <div>no one bid yet</div>
          <div>be the first to make a bid!</div>
        </div>
      )}

      {bids.map((bid, idx) => (
        <div key={bid.pubkey}>
          {publicKey?.toBase58() === bid.info.bidderPubkey && (
            <div className={IsMyBid} />
          )}
          <Row className={Activity} justify="space-between" align="middle">
            <Col className={uFlexAlignItemsCenter} span={12}>
              <ProfileAvatar
                imgProfile={users[bid.info.bidderPubkey]?.img_profile}
                username={users[bid.info.bidderPubkey]?.username}
                walletAddress={bid.info.bidderPubkey}
                size={24}
              />
            </Col>

            <Col className={uBoldFont} span={12}>
              <span>{formatTokenAmount(bid.info.lastBid, mint)} SOL</span>
            </Col>
          </Row>
        </div>
      ))}
    </>
  );
};

interface ISettle {
  key: string | number;
  address: string;
  amount: number;
}

export const BillingHistory = ({
  auction,
  bids,
}: {
  auction: AuctionView | undefined;
  bids: ISettle[];
}) => {
  const { publicKey } = useWallet();
  const { isLoadingDatabase } = useMeta();
  const mint = useMint(auction?.auction.info.tokenMint);

  const TransactionHistorySkeleton = (
    <div>
      {[...Array(3)].map(i => (
        <Skeleton key={i} avatar paragraph={{ rows: 0 }} />
      ))}
    </div>
  );

  return (
    <>
      <div className={ActivityHeader}>
        <div className={YellowGlowColor}>history</div>
        {/* <div>activity</div> */}
      </div>

      {isLoadingDatabase && TransactionHistorySkeleton}

      {!isLoadingDatabase && !Boolean(bids.length) && (
        <div className={GreyColor}>
          <div>no one settle the auction value yet</div>
        </div>
      )}

      {bids.map((bid, idx) => (
        <div key={idx}>
          {publicKey?.toBase58() === bid.address && <div className={IsMyBid} />}
          <Row className={Activity} justify="space-between" align="middle">
            <Col className={uFlexAlignItemsCenter} span={12}>
              <div>
                <Avatar
                  // src={
                  //   users[bid.info.bidderPubkey]?.img_profile
                  //     ? users[bid.info.bidderPubkey].img_profile
                  //     : null
                  // }
                  size={24}
                />
              </div>

              <div>{shortenAddress(bid.address)}</div>
            </Col>

            <Col className={uBoldFont} span={12}>
              <span>
                {bid.amount > 0 ? formatTokenAmount(bid.amount, mint) : 0} SOL
              </span>
            </Col>
          </Row>
        </div>
      ))}
    </>
  );
};

export default TransactionHistory;
