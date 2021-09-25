import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Button, Skeleton, List, Popover, Avatar } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { EllipsisOutlined } from '@ant-design/icons';
import moment from 'moment';

import { AuctionViewItem } from '@oyster/common/dist/lib/models/metaplex/index';
import {
  useArt,
  useAuction,
  useBidsForAuction,
  useCreators,
  useExtendedArt,
  useHighestBidForAuction,
} from '../../hooks';

import {
  formatTokenAmount,
  shortenAddress,
  useConnectionConfig,
  useMint,
  CountdownState,
  useMeta,
} from '@oyster/common';

import ActionButton from '../../components/ActionButton';
import { ArtContent } from '../../components/ArtContent';
import { ArtType } from '../../types';
import { Activity, ActivityHeader, ArtContainer, ArtDescription, ArtDetails, ArtDetailsColumn, ArtTitle, Attribute, AttributeRarity, BidStatus, BoldFont, ButtonWrapper, ColumnBox, Container, ContentSection, CurrentBid, EditionContainer, IsMyBid, Label, NormalFont, PaddingBox, StatusContainer, UserThumbnail, WhiteColor, YellowGlowColor } from './style';

export const AuctionItem = ({ item, active }: {
  item: AuctionViewItem;
  active?: boolean;
}) => (
  <ArtContent pubkey={item.metadata.pubkey} active={active} allowMeshRender={true} />
);

export const AuctionView = () => {
  const { id } = useParams<{ id: string }>();
  const { env } = useConnectionConfig();
  const { publicKey } = useWallet();
  const auction = useAuction(id);
  const { isLoading } = useMeta();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<CountdownState>();

  const { ref, data } = useExtendedArt(auction?.thumbnail.metadata.pubkey);
  const art = useArt(auction?.thumbnail.metadata.pubkey);
  const bids = useBidsForAuction(auction?.auction.pubkey || '');
  const creators = useCreators(auction);
  const owner = auction?.auction.account.owner.toString();
  const mint = useMint(auction?.auction.info.tokenMint);
  const highestBid = useHighestBidForAuction(auction?.auction.pubkey || '');

  const hasDescription = data === undefined || data.description === undefined;
  const description = data?.description;
  const attributes = data?.attributes;

  const ended = state?.hours === 0 && state?.minutes === 0 && state?.seconds === 0;

  let edition = '';
  if (art.type === ArtType.NFT) {
    edition = 'Unique';
  } else if (art.type === ArtType.Master) {
    edition = 'NFT 0';
  } else if (art.type === ArtType.Print) {
    edition = `edition ${art.edition} of ${art.supply} `;
  }

  useEffect(() => {
    const calc = () => {
      setState(auction?.auction.info.timeToEnd());
    };

    const interval = setInterval(() => {
      calc();
    }, 1000);

    calc();
    return () => clearInterval(interval);
  }, [auction, setState]);

  const items = [
    ...(auction?.items
      .flat()
      .reduce((agg, item) => {
        agg.set(item.metadata.pubkey, item);
        return agg;
      }, new Map<string, AuctionViewItem>())
      .values() || []),
    auction?.participationItem,
  ].map((item, index) => {
    if (!item || !item?.metadata || !item.metadata?.pubkey) {
      return null;
    }

    return (
      <AuctionItem
        key={item.metadata.pubkey}
        item={item}
        active={index === currentIndex}
      />
    );
  });

  const options = (
    <div>
      <List>
        <List.Item>
          <Button type="link" onClick={() => window.open(art.uri || '', '_blank')}>
            View on Arweave
          </Button>
        </List.Item>
        <List.Item>
          <Button
            type="link"
            onClick={() =>
              window.open(
                `https://explorer.solana.com/account/${art?.mint || ''}${env.indexOf('main') >= 0 ? '' : `?cluster=${env}`
                }`,
                '_blank',
              )
            }
          >
            View on Solana
          </Button>
        </List.Item>
      </List>
    </div>
  );

  const ArtDetailSkeleton = () => (
    <div>
      <div className={ContentSection}>
        <Skeleton paragraph={{ rows: 2 }} />
      </div>
      <Row>
        <Col span={12}>
          <div className={ContentSection}>
            <div className={Label}>creator</div>
            <Skeleton avatar paragraph={{ rows: 0 }} />
          </div>
        </Col>

        <Col span={12}>
          <div className={ContentSection}>
            <div className={Label}>owner</div>
            <Skeleton avatar paragraph={{ rows: 0 }} />
          </div>
        </Col>
      </Row>

      <div className={Label}>attributes</div>

      <Row gutter={[12, 12]}>
        {[...Array(3)].map(i => (
          <Col key={i}>
            <Skeleton.Button shape="round" />
          </Col>
        ))}
      </Row>
    </div>
  );

  const BidStatusSkeleton = () => (
    <Skeleton avatar paragraph={{ rows: 0 }} />
  );

  const BidsHistorySkeleton = () => (
    <div>
      {[...Array(3)].map(i => (
        <Skeleton avatar paragraph={{ rows: 0 }} />
      ))}
    </div>
  );

  return (
    <Row className={Container} ref={ref}>
      <Col className={ColumnBox} span={24} md={13}>
        <div className={ArtContainer}>{items}</div>
      </Col>

      <Col className={ColumnBox} span={24} md={7}>
        <div className={ArtDetailsColumn}>
          <div className={`${ArtDetails} ${PaddingBox} `}>
            <div className={`${EditionContainer} ${Label} `}>
              {!art.title && <Skeleton paragraph={{ rows: 0 }} />}
              {art.title && <div>{edition}</div>}

              <Popover trigger="click" placement="bottomRight" content={options}>
                <div style={{ cursor: 'pointer', color: '#FAFAFB' }}>
                  <EllipsisOutlined />
                </div>
              </Popover>
            </div>

            {/* Show Skeleton when Loading */}
            {!art.title && ArtDetailSkeleton()}

            {art.title && (
              <>
                <div className={ArtTitle}>{art.title}</div>

                {hasDescription && (
                  <div className={`${ArtDescription} ${ContentSection}`}>
                    {description}
                  </div>
                )}

                <Row>
                  {Boolean(creators.length) && (
                    <Col span={12}>
                      <div className={ContentSection}>
                        <div className={Label}>{creators.length > 1 ? 'creators' : 'creator'}</div>
                        {creators.map(creator => {
                          if (creator.address) {
                            return (
                              <div className={UserThumbnail} key={creator.address}>
                                <Avatar size={40} /> {shortenAddress(creator.address)}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </Col>
                  )}

                  {owner && (
                    <Col span={12}>
                      <div className={Label}>owner</div>
                      <div className={UserThumbnail}>
                        <Avatar size={40} /> {shortenAddress(owner)}
                      </div>
                    </Col>
                  )}
                </Row>

                {attributes && <div className={ContentSection}>
                  <div className={Label}>attributes</div>
                  <Row gutter={[12, 12]}>
                    {attributes.map(attribute =>
                      <Col key={attribute.trait_type}>
                        <Button className={Attribute} shape="round">
                          <span>{attribute.value} –</span>
                          <span className={AttributeRarity}>{attribute.trait_type}</span>
                        </Button>
                      </Col>
                    )}
                  </Row>
                </div>}
              </>
            )}
          </div>


          <div className={`${StatusContainer} ${PaddingBox} `}>
            <div className={BidStatus}>
              {!art.title && BidStatusSkeleton()}

              {art.title && (
                <>
                  <div>
                    <Avatar size={40} />
                  </div>

                  <div>
                    {ended ? (
                      <>
                        <div>
                          winning bid by{' '}
                          <span className={WhiteColor}>{highestBid && shortenAddress(highestBid.info.bidderPubkey)}</span>
                        </div>
                        <div className={CurrentBid}>
                          <span className={WhiteColor}>{highestBid && `${formatTokenAmount(highestBid.info.lastBid)} SOL`}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          current bid by{' '}
                          <span className={WhiteColor}>{highestBid && shortenAddress(highestBid.info.bidderPubkey)}</span>
                          <span className={NormalFont}>・{highestBid && moment.unix(highestBid.info.lastBidTimestamp.toNumber()).fromNow()}</span>
                        </div>

                        <div className={CurrentBid}>
                          <span className={WhiteColor}>{highestBid && formatTokenAmount(highestBid.info.lastBid)} SOL</span>

                          {' '}ending in{' '}

                          {state && (
                            <span className={WhiteColor}>
                              {state.hours} :{' '}
                              {state.minutes > 0 ? state.minutes : `0${state.minutes}`} :{' '}
                              {state.minutes > 0 ? state.minutes : `0${state.minutes}`}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className={ButtonWrapper}>
              <ActionButton disabled={ended} width="100%">{ended ? 'auction ended' : 'place a bid'}</ActionButton>
            </div>
          </div>
        </div>
      </Col >

      <Col className={`${ColumnBox} ${PaddingBox} `} span={24} md={4}>
        <div className={ActivityHeader}>
          <div className={YellowGlowColor}>bids history</div>
          {/* <div>activity</div> */}
        </div>

        {!art.title && BidsHistorySkeleton()}

        {bids.map((bid, idx) => (
          <div key={idx}>
            {publicKey?.toBase58() === bid.info.bidderPubkey && <div className={IsMyBid} />}
            <div className={Activity}>
              <div>
                <Avatar size={24} /> {shortenAddress(bid.info.bidderPubkey)}
              </div>
              <div className={BoldFont}>
                {formatTokenAmount(bid.info.lastBid, mint)} SOL
              </div>
            </div>
          </div>
        ))}
      </Col>
    </Row >
  );
};
