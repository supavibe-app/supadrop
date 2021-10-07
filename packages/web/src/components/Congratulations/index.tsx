import { useMeta } from '@oyster/common';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'antd';
import { AuctionRenderCard2 } from '../../components/AuctionRenderCard';
import { ContinueButton, Description, HeaderStyle, ShareButton } from './style';
import { uFontSize18 } from '../../styles';
import { TwitterOutlined } from '@ant-design/icons';

const TweetURL = urlToNFT => `https://twitter.com/intent/tweet?text=I%20just%20won%20nft%20auction%20for%20CRYSTAL%20GODS%2007%20on%20%40supadropnft%E2%80%A8%0A${urlToNFT}`;

const Congratulations = ({ id }) => {
  const { liveDataAuctions } = useMeta();
  const auctionView = liveDataAuctions[id];

  return (
    <Row justify="center" >
      <Col span={16} style={{ marginTop: 72 }}>
        <Row justify="center" gutter={[72, 0]} align="middle">
          {auctionView && (
            <Col span={9}>
              <Link to={`/auction/${id}`}>
                <AuctionRenderCard2 auctionView={auctionView} />
              </Link>
            </Col>
          )}

          <Col span={9}>
            <div className={HeaderStyle}>
              Congratulations!<br />
              Your NFT is<br />
              on its way.
            </div>

            <div className={Description}>
              your NFT currently being transferred to your wallet. Let’s spread some words!
            </div>

            <div className={uFontSize18}>
              <Link to={{ pathname: TweetURL(`https://supadrop.com/auction/${id}`) }} target="_blank">
                <Button
                  className={ShareButton}
                  type="default"
                  shape="round"
                  icon={<TwitterOutlined style={{ color: '#1DA1F2' }} />}
                >
                  tweet
                </Button>
              </Link>

              {/* TODO: Insert URL to user profile*/}
              <Button className={ContinueButton} type="link">continue</Button>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Congratulations;
