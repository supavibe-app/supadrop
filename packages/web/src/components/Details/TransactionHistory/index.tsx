import React from 'react';
import { Avatar, Col, Row, Skeleton } from 'antd';
import { formatTokenAmount, ItemAuction, shortenAddress, useMeta, useMint } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';

import { AuctionView, useArt, useBidsForAuction } from '../../../hooks';
import { GreyColor, uBoldFont, uFlexAlignItemsCenter, YellowGlowColor } from '../../../styles';
import { Activity, ActivityHeader, IsMyBid } from './style';

const TransactionHistory = ({ auction }: { auction: ItemAuction | undefined }) => {
  const { publicKey } = useWallet();
  const { isLoadingDatabase } = useMeta();
  const mint = useMint(auction?.token_mint);
  const bids = useBidsForAuction(auction?.id || '');

  const TransactionHistorySkeleton = (
    <div>
      {[...Array(3)].map(i => <Skeleton avatar paragraph={{ rows: 0 }} />)}
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
        <div key={idx}>
          {publicKey?.toBase58() === bid.info.bidderPubkey && <div className={IsMyBid} />}
          <Row className={Activity} justify="space-between" align="middle">
            <Col className={uFlexAlignItemsCenter} span={12}>
              <div>
                <Avatar size={24} />
              </div>
              <div>{shortenAddress(bid.info.bidderPubkey)}</div>
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

export default TransactionHistory;
