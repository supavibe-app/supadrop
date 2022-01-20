import { useMeta } from '@oyster/common';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';

import { AuctionRenderCard } from '../../components/AuctionRenderCard';
import { uFontSize18 } from '../../styles';
import { TwitterOutlined } from '@ant-design/icons';
import { useArt } from '../../hooks';
import { ContinueButton, Description, HeaderStyle, ShareButton } from './style';

// TODO CHANGE HOLDER

const TweetURL = (title, urlToNFT) =>
  `https://twitter.com/intent/tweet?text=I%20just%20won%20an%20NFT%20auction%20for%20${title}%20on%20%40supadropnft%E2%80%A8%0A${urlToNFT}`;

const Congratulations = ({ id, type }) => {
  const { allDataAuctions,users } = useMeta();
  const { publicKey } = useWallet();
  const auctionView = allDataAuctions[id];
  const art = useArt(auctionView.id_nft);

  return (
    <Row justify="center">
      <Col span={16} style={{ marginTop: 72 }}>
        <Row justify="center" gutter={[72, 0]} align="middle">
          {auctionView && (
            <Col span={9}>
              <Link to={`/auction/${id}`}>
                <AuctionRenderCard
                  auctionView={auctionView}
                  wallet_address={auctionView.owner}
                />
              </Link>
            </Col>
          )}

          <Col span={9}>
            {
              <div className={HeaderStyle}>
                {type === 'claim' && (
                  <>
                    Congratulations!
                    <br />
                  </>
                )}
                Your NFT is
                <br />
                on its way.
              </div>
            }

            <div className={Description}>
              your NFT currently being transferred to your wallet. Let’s spread
              some words!
            </div>

            <div className={uFontSize18}>
              <Link
                to={{
                  pathname: TweetURL(
                    art.title,
                    `https://supadrop.com/auction/${id}`,
                  ),
                }}
                target="_blank"
              >
                <Button
                  className={ShareButton}
                  type="default"
                  shape="round"
                  icon={<TwitterOutlined style={{ color: '#1DA1F2' }} />}
                >
                  tweet
                </Button>
              </Link>

              <Link to={`/${publicKey}`}>
                <span className={ContinueButton}>continue</span>
              </Link>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Congratulations;
