import React, { useState } from 'react';
import { Col, Input, Row } from 'antd';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { formatNumber, formatTokenAmount, fromLamports, ItemAuction, PriceFloorType, useMint, useNativeAccount } from '@oyster/common';
import { useHighestBidForAuction } from '../../../hooks';
import getMinimumBid from '../../../helpers/getMinimumBid';
import AddFundsComponent from './addFunds';
import { WhiteColor } from '../../../styles';
import { AddFunds, BidInput, BidRuleInformation, Information, PlaceBidTitle } from './style';

const PlaceBid = ({ auction, setBidAmount, bidAmount }: {
  auction: ItemAuction | undefined;
  bidAmount: number | undefined;
  setBidAmount: (num: number) => void;
}) => {
  const { account } = useNativeAccount();
  const [showFundModal, setShowFundModal] = useState(false);

  const bid = useHighestBidForAuction(auction?.id || '');
  const mintInfo = useMint(auction?.token_mint);
  const priceFloor = auction?.price_floor;

  const balance = formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL);
  const currentBid = parseFloat(formatTokenAmount(bid?.info.lastBid)) || fromLamports(priceFloor, mintInfo);
  const minimumBid = getMinimumBid(currentBid);

  return (
    <>
      <div className={PlaceBidTitle}>place a bid </div>

      <div className={Information}>
        <div>your bid must at least</div>
        <div className={WhiteColor}>{minimumBid} SOL</div>
      </div>

      <Input
        className={BidInput}
        defaultValue={bidAmount}
        placeholder="0"
        suffix="SOL"
        type="number"
        onChange={e => setBidAmount(parseFloat(e.target.value))}
      />

      <div className={Information}>
        <div>
          <span>my balance </span>
          <span className={WhiteColor}>{balance} SOL</span>
        </div>

        {balance < minimumBid && (
          <div className={AddFunds} onClick={() => setShowFundModal(true)}>
            add funds
          </div>
        )}
      </div>

      <Row>
        <Col span={20}>
          <div className={BidRuleInformation}>
            Bids placed in the last 15 minutes will extend bidding for another 15 minutes beyond the point in time that bid was made. Bids must at least 10% higher.
          </div>
        </Col>
      </Row>

      {showFundModal && <AddFundsComponent onCancel={() => setShowFundModal(false)} />}
    </>
  )
};

export default PlaceBid;
