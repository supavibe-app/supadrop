import React, { useEffect, useState } from 'react';
import { Button, Col } from 'antd';
import { useLocation } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import moment from 'moment';
import { StringPublicKey } from '@oyster/common';

import InputPrice from '../../../components/InputPrice';
import ActionButton from '../../ActionButton';
import { useUserArts } from '../../../hooks';
import { AuctionCategory, AuctionState } from '../../../views/auctionCreate';
import {
  LabelDesc,
  LabelSecondaryTitle,
  LabelTitle,
  OptionBoxStyle,
  OptionButtonStyle,
  OptionsContainer,
  OptionsWrapper,
} from './style';

const SellStep = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
  auction?: {
    vault: StringPublicKey;
    auction: StringPublicKey;
    auctionManager: StringPublicKey;
  };
}) => {
  // states
  const [category, setCategory] = useState(AuctionCategory.Single);
  const [time, setTime] = useState(1);
  const [priceFloor, setPriceFloor] = useState<number>(0);

  const handleList = async () => {
    const attributeValue =
      category === AuctionCategory.InstantSale
        ? {
            ...props.attributes,
            startSaleTS: moment().unix(),
            startListTS: moment().unix(),
            priceFloor,
            instantSalePrice: priceFloor,
          }
        : {
            ...props.attributes,
            startSaleTS: moment().unix(),
            startListTS: moment().unix(),
            priceFloor,
            priceTick: 0.1,
            auctionDuration: time,
            // gapTime: 15,
            gapTime: 1,
            tickSizeEndingPhase: 10,
          };

    props.setAttributes(attributeValue);
    props.confirm();
  };

  return (
    <Col span={12} style={{ paddingBottom: 8, marginBottom: 32 }}>
      <div>
        <div className={LabelTitle}>set reserve price</div>
        <div className={LabelDesc}>
          make sure you have enough SOL to perform the network fee (supadrop
          don’t charge listing fee)
        </div>

        <InputPrice
          placeholder="0"
          suffix="SOL"
          onChange={e => setPriceFloor(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <div className={LabelSecondaryTitle}>select listing options</div>
        <div className={LabelDesc}>
          timed auction allows you to set time range for collectors to bid on
          auction
        </div>

        <div className={OptionsContainer}>
          <div className={OptionsWrapper}>
            <OptionBox
              className={OptionBoxStyle(category === AuctionCategory.Single)}
              icon="clock"
              text="timed auction"
              onClick={() => setCategory(AuctionCategory.Single)}
            />
            <OptionBox
              className={OptionBoxStyle(
                category === AuctionCategory.InstantSale,
              )}
              icon="tag"
              text="instant sale"
              onClick={() => setCategory(AuctionCategory.InstantSale)}
            />
          </div>

          {category === AuctionCategory.Single && (
            <div>
              <div style={{ marginBottom: 12 }}>auction ended in</div>

              <div className={OptionsWrapper}>
                <OptionButton
                  className={OptionButtonStyle(time === 0.005)}
                  text="Under 1 d"
                  onClick={() => setTime(0.005)}
                />

                <OptionButton
                  className={OptionButtonStyle(time === 1)}
                  text="1 day"
                  onClick={() => setTime(1)}
                />

                <OptionButton
                  className={OptionButtonStyle(time === 2)}
                  text="2 days"
                  onClick={() => setTime(2)}
                />

                <OptionButton
                  className={OptionButtonStyle(time === 3)}
                  text="3 days"
                  onClick={() => setTime(3)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <ActionButton
        size="small"
        onClick={handleList}
        disabled={priceFloor <= 0 || !priceFloor}
      >
        list my NFT
      </ActionButton>
    </Col>
  );
};

const OptionBox = ({ className, onClick, icon, text }) => {
  return (
    <div className={className} onClick={onClick}>
      <FeatherIcon icon={icon} />
      <div>{text}</div>
    </div>
  );
};

const OptionButton = ({ className, onClick, text }) => {
  return (
    <Button className={className} onClick={onClick} size="middle" shape="round">
      {text}
    </Button>
  );
};

export default SellStep;
