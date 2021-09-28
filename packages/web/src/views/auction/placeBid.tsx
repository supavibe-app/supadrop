import React from 'react';
import { Col, Input, Row } from 'antd';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { formatNumber, formatTokenAmount, fromLamports, PriceFloorType, useMint, useNativeAccount } from '@oyster/common';
import { BidInput, BidRuleInformation, Information, PlaceBidTitle } from './style';
import { AuctionView, useHighestBidForAuction } from '../../hooks';
import { WhiteColor } from '../../styles';

const PlaceBid = ({ auction, setBidAmount }: {
  auction: AuctionView | undefined;
  setBidAmount: (num: number) => void;
}) => {
  const { account } = useNativeAccount();
  const bid = useHighestBidForAuction(auction?.auction.pubkey || '');

  const mintInfo = useMint(auction?.auction.info.tokenMint);
  const priceFloor =
    auction?.auction.info.priceFloor.type === PriceFloorType.Minimum
      ? auction?.auction.info.priceFloor.minPrice?.toNumber() || 0
      : 0;

  const balance = formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL);
  const currentBid = parseFloat(formatTokenAmount(bid?.info.lastBid)) || fromLamports(priceFloor, mintInfo);
  const minimumBid = currentBid + currentBid * 0.1;

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
