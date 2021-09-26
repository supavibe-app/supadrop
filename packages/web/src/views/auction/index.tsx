import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Button, Skeleton, Carousel, List,  Popover, Avatar, Card } from 'antd';
import { AuctionCard } from '../../components/AuctionCard';
import { Connection } from '@solana/web3.js';
import { AuctionViewItem } from '@oyster/common/dist/lib/models/metaplex/index';
import {
  AuctionView as Auction,
  useArt,
  useAuction,
  useBidsForAuction,
  useCreators,
  useExtendedArt,
  useHighestBidForAuction,
} from '../../hooks';
import ActionButton from '../../components/ActionButton';
import { ArtContent } from '../../components/ArtContent';
import { EllipsisOutlined } from '@ant-design/icons';
import moment from 'moment';

import {
  formatTokenAmount,
  Identicon,
  MetaplexModal,
  shortenAddress,
  useConnection,
  useConnectionConfig,
  fromLamports,
  useMint,
  AuctionState,
  StringPublicKey,
  toPublicKey,
  CountdownState,
    useMeta,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { MintInfo } from '@solana/spl-token';
import { getHandleAndRegistryKey } from '@solana/spl-name-service';
import useWindowDimensions from '../../utils/layout';
import { CheckOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { ArtType } from '../../types';
import { Activity, ActivityHeader, ArtContainer, ArtDescription, ArtDetails, ArtDetailsColumn, ArtTitle, Attribute, AttributeRarity, BidStatus, BoldFont, ButtonWrapper, ColumnBox, Container, ContentSection, CurrentBid, EditionContainer, IsMyBid, Label, NormalFont, PaddingBox, StatusContainer, UserThumbnail, WhiteColor, YellowGlowColor } from './style';

// export const AuctionItem = ({
//   item,
//   index,
//   size,
//   active,
// }: {
//   item: AuctionViewItem;
//   index: number;
//   size: number;
//   active?: boolean;
// }) => {
//   const id = item.metadata.pubkey;
//   var style: React.CSSProperties = {
//     transform:
//       index === 0
//         ? ''
//         : `translate(${index * 15}px, ${-40 * index}px) scale(${Math.max(
//             1 - 0.2 * index,
//             0,
//           )})`,
//     transformOrigin: 'right bottom',
//     position: index !== 0 ? 'absolute' : 'static',
//     zIndex: -1 * index,
//     marginLeft: size > 1 && index === 0 ? '0px' : 'auto',
//     background: 'black',
//     boxShadow: 'rgb(0 0 0 / 10%) 12px 2px 20px 14px',
//     height: 300,
//   };
//   return (
//     <ArtContent
//       pubkey={id}
//       className="artwork-image stack-item"
//       style={style}
//       active={active}
//       allowMeshRender={true}
//     />
//   );
// };
//
// export const AuctionView = () => {
//   const { id } = useParams<{ id: string }>();
//   const { env } = useConnectionConfig();
//   const auction = useAuction(id);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const art = useArt(auction?.thumbnail.metadata.pubkey);
//   const { ref, data } = useExtendedArt(auction?.thumbnail.metadata.pubkey);
//   const creators = useCreators(auction);
//   let edition = '';
//   if (art.type === ArtType.NFT) {
//     edition = 'Unique';
//   } else if (art.type === ArtType.Master) {
//     edition = 'NFT 0';
//   } else if (art.type === ArtType.Print) {
//     edition = `${art.edition} of ${art.supply}`;
//   }
//   const nftCount = auction?.items.flat().length;
//   const winnerCount = auction?.items.length;
//
//   const hasDescription = data === undefined || data.description === undefined;
//   const description = data?.description;
//   const attributes = data?.attributes;
//
//   const items = [
//     ...(auction?.items
//       .flat()
//       .reduce((agg, item) => {
//         agg.set(item.metadata.pubkey, item);
//         return agg;
//       }, new Map<string, AuctionViewItem>())
//       .values() || []),
//     auction?.participationItem,
//   ].map((item, index, arr) => {
//     if (!item || !item?.metadata || !item.metadata?.pubkey) {
//       return null;
//     }
//
//     return (
//       <AuctionItem
//         key={item.metadata.pubkey}
//         item={item}
//         index={index}
//         size={arr.length}
//         active={index === currentIndex}
//       ></AuctionItem>
//     );
//   });
//
//   return (
//     <>
//       <Row justify="space-around" ref={ref}>
//         <Col span={24} md={12} className="pr-4">
//           <div className="auction-view" style={{ minHeight: 300 }}>
//             <Carousel
//               autoplay={false}
//               afterChange={index => setCurrentIndex(index)}
//             >
//               {items}
//             </Carousel>
//           </div>
//           <h6>Number Of Winners</h6>
//           <h1>
//             {winnerCount === undefined ? (
//               <Skeleton paragraph={{ rows: 0 }} />
//             ) : (
//               winnerCount
//             )}
//           </h1>
//           <h6>Number Of NFTs</h6>
//           <h1>
//             {nftCount === undefined ? (
//               <Skeleton paragraph={{ rows: 0 }} />
//             ) : (
//               nftCount
//             )}
//           </h1>
//           <h6>About this {nftCount === 1 ? 'NFT' : 'Collection'}</h6>
//           <div className="auction-paragraph">
//             {hasDescription && <Skeleton paragraph={{ rows: 3 }} />}
//             {description ||
//               (winnerCount !== undefined && (
//                 <div style={{ fontStyle: 'italic' }}>
//                   No description provided.
//                 </div>
//               ))}
//           </div>
//
//           {attributes && (
//             <>
//               <h6>Attributes</h6>
//               <List grid={{ column: 4 }}>
//                 {attributes.map(attribute => (
//                   <List.Item>
//                     <Card title={attribute.trait_type}>{attribute.value}</Card>
//                   </List.Item>
//                 ))}
//               </List>
//             </>
//           )}
//           {/* {auctionData[id] && (
//             <>
//               <h6>About this Auction</h6>
//               <p>{auctionData[id].description.split('\n').map((t: string) => <div>{t}</div>)}</p>
//             </>
//           )} */}
//         </Col>
//
//         <Col span={24} md={12}>
//           <h2 className="art-title">
//             {art.title || <Skeleton paragraph={{ rows: 0 }} />}
//           </h2>
//           <Row gutter={[50, 0]} style={{ marginRight: 'unset' }}>
//             <Col>
//               <h6>Edition</h6>
//               {!auction && (
//                 <Skeleton title={{ width: '100%' }} paragraph={{ rows: 0 }} />
//               )}
//               {auction && (
//                 <p className="auction-art-edition">
//                   {(auction?.items.length || 0) > 1 ? 'Multiple' : edition}
//                 </p>
//               )}
//             </Col>
//
//             <Col>
//               <h6>View on</h6>
//               <div style={{ display: 'flex' }}>
//                 <Button
//                   className="tag"
//                   onClick={() => window.open(art.uri || '', '_blank')}
//                 >
//                   Arweave
//                 </Button>
//                 <Button
//                   className="tag"
//                   onClick={() =>
//                     window.open(
//                       `https://explorer.solana.com/account/${art?.mint || ''}${
//                         env.indexOf('main') >= 0 ? '' : `?cluster=${env}`
//                       }`,
//                       '_blank',
//                     )
//                   }
//                 >
//                   Solana
//                 </Button>
//               </div>
//             </Col>
//           </Row>
//
//           {!auction && <Skeleton paragraph={{ rows: 6 }} />}
//           {auction && <AuctionCard auctionView={auction} />}
//           {!auction?.isInstantSale && <AuctionBids auctionView={auction} />}
//         </Col>
//       </Row>
//     </>
//   );
// };
//
// const BidLine = (props: {
//   bid: any;
//   index: number;
//   mint?: MintInfo;
//   isCancelled?: boolean;
//   isActive?: boolean;
// }) => {
//   const { bid, index, mint, isCancelled, isActive } = props;
//   const { publicKey } = useWallet();
//   const bidder = bid.info.bidderPubkey;
//   const isme = publicKey?.toBase58() === bidder;
//
//   // Get Twitter Handle from address
//   const connection = useConnection();
//   const [bidderTwitterHandle, setBidderTwitterHandle] = useState('');
//   useEffect(() => {
//     const getTwitterHandle = async (
//       connection: Connection,
//       bidder: StringPublicKey,
//     ): Promise<string | undefined> => {
//       try {
//         const [twitterHandle] = await getHandleAndRegistryKey(
//           connection,
//           toPublicKey(bidder),
//         );
//         setBidderTwitterHandle(twitterHandle);
//       } catch (err) {
//         console.warn(`err`);
//         return undefined;
//       }
//     };
//     getTwitterHandle(connection, bidder);
//   }, [bidderTwitterHandle]);
//
//   return (
//     <Row
//       style={{
//         width: '100%',
//         alignItems: 'center',
//         padding: '3px 0',
//         position: 'relative',
//         opacity: isActive ? undefined : 0.5,
//         ...(isme
//           ? {
//               backgroundColor: '#ffffff21',
//             }
//           : {}),
//       }}
//     >
//       {isCancelled && (
//         <div
//           style={{
//             position: 'absolute',
//             left: 0,
//             width: '100%',
//             height: 1,
//             background: 'grey',
//             top: 'calc(50% - 1px)',
//             zIndex: 2,
//           }}
//         />
//       )}
//       <Col
//         span={2}
//         style={{
//           textAlign: 'right',
//           paddingRight: 10,
//         }}
//       >
//         {!isCancelled && (
//           <div
//             style={{
//               opacity: 0.8,
//               fontWeight: 700,
//             }}
//           >
//             {isme && (
//               <>
//                 <CheckOutlined />
//                 &nbsp;
//               </>
//             )}
//             {index + 1}
//           </div>
//         )}
//       </Col>
//       <Col span={16}>
//         <Row>
//           <Identicon
//             style={{
//               width: 24,
//               height: 24,
//               marginRight: 10,
//               marginTop: 2,
//             }}
//             address={bidder}
//           />{' '}
//           {bidderTwitterHandle ? (
//             <a
//               target="_blank"
//               title={shortenAddress(bidder)}
//               href={`https://twitter.com/${bidderTwitterHandle}`}
//             >{`@${bidderTwitterHandle}`}</a>
//           ) : (
//             shortenAddress(bidder)
//           )}
//           {isme && <span style={{ color: '#6479f6' }}>&nbsp;(you)</span>}
//         </Row>
//       </Col>
//       <Col span={6} style={{ textAlign: 'right' }}>
//         <span title={fromLamports(bid.info.lastBid, mint).toString()}>
//           ◎{formatTokenAmount(bid.info.lastBid, mint)}
//         </span>
//       </Col>
//     </Row>
//   );
// };
//
// export const AuctionBids = ({
//   auctionView,
// }: {
//   auctionView?: Auction | null;
// }) => {
//   const bids = useBidsForAuction(auctionView?.auction.pubkey || '');
//
//   const mint = useMint(auctionView?.auction.info.tokenMint);
//   const { width } = useWindowDimensions();
//
//   const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
//
//   const winnersCount = auctionView?.auction.info.bidState.max.toNumber() || 0;
//   const activeBids = auctionView?.auction.info.bidState.bids || [];
//   const activeBidders = useMemo(() => {
//     return new Set(activeBids.map(b => b.key));
//   }, [activeBids]);
//
//   const auctionState = auctionView
//     ? auctionView.auction.info.state
//     : AuctionState.Created;
//   const bidLines = useMemo(() => {
//     let activeBidIndex = 0;
//     return bids.map((bid, index) => {
//       let isCancelled =
//         (index < winnersCount && !!bid.info.cancelled) ||
//         (auctionState !== AuctionState.Ended && !!bid.info.cancelled);
//
//       let line = (
//         <BidLine
//           bid={bid}
//           index={activeBidIndex}
//           key={index}
//           mint={mint}
//           isCancelled={isCancelled}
//           isActive={!bid.info.cancelled}
//         />
//       );
//
//       if (!isCancelled) {
//         activeBidIndex++;
//       }
//
//       return line;
//     });
//   }, [auctionState, bids, activeBidders]);
//
//   if (!auctionView || bids.length < 1) return null;
//
//   return (
//     <Col style={{ width: '100%' }}>
//       <h6>Bid History</h6>
//       {bidLines.slice(0, 10)}
//       {bids.length > 10 && (
//         <div
//           className="full-history"
//           onClick={() => setShowHistoryModal(true)}
//           style={{
//             cursor: 'pointer',
//           }}
//         >
//           View full history
//         </div>
//       )}
//       <MetaplexModal
//         visible={showHistoryModal}
//         onCancel={() => setShowHistoryModal(false)}
//         title="Bid history"
//         bodyStyle={{
//           background: 'unset',
//           boxShadow: 'unset',
//           borderRadius: 0,
//         }}
//         centered
//         width={width < 768 ? width - 10 : 600}
//       >
//         <div
//           style={{
//             maxHeight: 600,
//             overflowY: 'scroll',
//             width: '100%',
//           }}
//         >
//           {bidLines}
//         </div>
//       </MetaplexModal>
//     </Col>
//   );

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
