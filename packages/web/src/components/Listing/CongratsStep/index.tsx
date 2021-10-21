import React from 'react';
import { Button, Col } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
import { StringPublicKey } from '@oyster/common';
import { useHistory } from 'react-router-dom';
import { Confetti } from '../../Confetti';
import { Description, Title } from '../style';
import { ContinueButton, ShareButton } from './style';

const CongratsStep = (props: {
  auction?: {
    vault: StringPublicKey;
    auction: StringPublicKey;
    auctionManager: StringPublicKey;
  };
}) => {
  const history = useHistory();

  const newTweetURL = () => {
    const params = {
      text: `Check out my “CRYSTAL GODS 07” listed on @supadrop for 1000SOL`,
      url: `${
        window.location.origin
      }/auction/${props.auction?.auction.toString()}`,
      // via: "SUPADROP",
      related: 'Metaplex,Solana',
    };
    const queryParams = new URLSearchParams(params).toString();
    return `https://twitter.com/intent/tweet?${queryParams}`;
  };

  return (
    <Col span={12}>
      <div className={Title}>Your NFT succesfully listed!</div>
      <div className={Description}>
        your NFT will be put on supadrop marketplace as soon as the transaction
        processed
      </div>
      <div>
        <Button
          className={ShareButton}
          onClick={_ => window.open(newTweetURL(), '_blank')}
          type="default"
          shape="round"
          icon={<TwitterOutlined style={{ color: '#1DA1F2' }} />}
        >
          tweet
        </Button>

        <Button
          className={ContinueButton}
          onClick={() =>
            history.push(`/auction/${props.auction?.auction.toString()}`)
          }
          type="link"
          shape="round"
          color="#FAFAFB"
        >
          see details
        </Button>
      </div>
      <Confetti />
    </Col>
  );
};

export default CongratsStep;
