import React from 'react';
import { Col, Input, Row } from 'antd';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { formatNumber, fromLamports, PriceFloorType, useMint, useNativeAccount } from '@oyster/common';
import { BidInput, BidRuleInformation, Information, PlaceBidTitle, WhiteColor } from './style';
import { AuctionView, useHighestBidForAuction } from '../../hooks';

const PlaceBid = ({ auction, setBidAmount }: {
  auction: AuctionView | undefined;
  setBidAmount: (num: number) => void;
}) => {
  const { account } = useNativeAccount();
  const bid = useHighestBidForAuction(auction?.auction.pubkey || '');

  const mintInfo = useMint(auction?.auction.info.tokenMint);
  const participationFixedPrice = auction?.auctionManager.participationConfig?.fixedPrice || 0;
  const priceFloor =
    auction?.auction.info.priceFloor.type === PriceFloorType.Minimum
      ? auction?.auction.info.priceFloor.minPrice?.toNumber() || 0
      : 0;
  let currentBid: number | string = 0;
  currentBid = fromLamports(priceFloor, mintInfo);

  // currentBid = parseFloat(formatTokenAmount(bid?.info.lastBid)) || auction?.auction.info.priceFloor.minPrice?.toNumber() || 0;
  const minimumBid = currentBid + currentBid * 0.1;
  const balance = formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL);

  // console.log('auction: ', auction);
  // console.log('currentBid: ', currentBid);
  // console.log('priceFloor: ', priceFloor);
  // console.log('participationFixedPrice: ', participationFixedPrice);
  // console.log('minimumBid: ', minimumBid);

  return (
    <>
      <div className={PlaceBidTitle}>place a bid </div>

      <div className={Information}>
        <div>your bid must at least</div>
        <div className={WhiteColor}>{minimumBid} SOL</div>
      </div>

      <Input
        className={BidInput}
        placeholder="0"
        suffix="SOL"
        type="number"
        onChange={e => setBidAmount(parseFloat(e.target.value))}
      />

      <div className={Information}>
        my balance{' '}
        <span className={WhiteColor}>{balance} SOL</span>
      </div>

      <Row>
        <Col span={20}>
          <div className={BidRuleInformation}>
            Bids placed in the last 15 minutes will extend bidding for another 15 minutes beyond the point in time that bid was made. Bids must at least 10% higher.
          </div>
        </Col>
      </Row>
    </>
  )
};

export default PlaceBid;
