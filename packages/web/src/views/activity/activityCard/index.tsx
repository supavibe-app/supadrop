import React, { useEffect, useState } from 'react';
import { Avatar, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import {
  NFTStatus,
  NFTName,
  Label,
  StatusValue,
  Price,
  ButtonWrapper,
  ActivityCardStyle,
  NFTDescription,
  ImageCard,
  UserContainer,
} from './style';

import ActionButton from '../../../components/ActionButton';
import {
  AuctionView,
  useArt,
  useBidsForAuction,
  useHighestBidForAuction,
  useUserBalance,
} from '../../../hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  AuctionViewItem,
  CountdownState,
  formatTokenAmount,
  fromLamports,
  PriceFloorType,
  shortenAddress,
  supabaseUpdateIsRedeem,
  supabaseUpdateStatusInstantSale,
  useConnection,
  useMeta,
  useMint,
  useUserAccounts,
  WinningConfigType,
} from '@oyster/common';
import {
  eligibleForParticipationPrizeGivenWinningIndex,
  sendRedeemBid,
} from '../../../actions/sendRedeemBid';
import { ArtContent } from '../../../components/ArtContent';
import { sendCancelBid } from '../../../actions/cancelBid';
import { sendPlaceBid } from '../../../actions/sendPlaceBid';
import { endSale } from '../../../components/AuctionCard/utils/endSale';
import isEnded from '../../../components/Home/helpers/isEnded';
import countDown from '../../../helpers/countdown';

export const AuctionItem = ({
  item,
  active,
}: {
  item: AuctionViewItem;
  active?: boolean;
}) => (
  <ArtContent
    className={ImageCard}
    pubkey={item.metadata.pubkey}
    active={active}
    allowMeshRender={true}
  />
);

export const ActivityCard2 = ({ auctionView }: { auctionView: any }) => {
  const [state, setState] = useState<CountdownState>();
  const wallet = useWallet();
  const isInstantSale = auctionView.auction_status.type_auction;
  const isOwner =
    auctionView.auction_status.owner.wallet_address ===
    wallet.publicKey?.toBase58();
  const owner = auctionView.auction_status.owner;
  const winner = auctionView.auction_status.winner;

  const highestBid = auctionView.auction_status.highest_bid;
  const haveWinner = highestBid > 0;
  const eligibleForAnything = auctionView.price_bid === highestBid;
  useEffect(() => {
    const calc = () =>
      setState(countDown(auctionView.auction_status.end_auction));

    const interval = setInterval(() => calc(), 1000);
    calc();
    return () => clearInterval(interval);
  }, [auctionView, setState]);

  return (
    <Row className={ActivityCardStyle}>
      <Col className={NFTDescription} span={18}>
        <Link to={`/auction/${auctionView.auction_status.id}`}>
          <Row>
            <Col flex={1}>
              <ArtContent
                className={ImageCard}
                pubkey={auctionView.auction_status.id}
                allowMeshRender={true}
              />
            </Col>
            <Col flex={3}>
              <div className={NFTName}>
                {auctionView.auction_status.nft_data.name}
              </div>
              <div className={UserContainer}>
                <Avatar src={owner.img_profile} size={32} />
                <div>
                  {owner.username
                    ? owner.username
                    : shortenAddress(owner.wallet_address)}
                </div>
              </div>

              <div className={NFTStatus}>
                {/* case 1: my bids - auction still live */}
                {!isEnded(state) && !isOwner && (
                  <>
                    <div>
                      <div className={Label}>current bid</div>
                      <div className={StatusValue}>{highestBid} SOL</div>
                    </div>
                    <div>
                      <div className={Label}>ending in</div>
                      {state && (
                        <div className={StatusValue}>
                          {state.hours} :{' '}
                          {state.minutes > 9
                            ? state.minutes
                            : `0${state.minutes}`}{' '}
                          :{' '}
                          {state.seconds > 9
                            ? state.seconds
                            : `0${state.seconds}`}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* case 2: my bids - auction ended */}
                {isEnded(state) && !isOwner && (
                  <>
                    <div>
                      <div className={Label}>highest bid</div>
                      <div className={StatusValue}>{highestBid} SOL</div>
                    </div>

                    {/* case 2.1: my bids - win */}
                    {highestBid === auctionView.price_bid && (
                      <div>
                        <div className={Label}>auction ended</div>
                        <div
                          className={StatusValue}
                          style={{ color: '#4CD964' }}
                        >
                          you won!
                        </div>
                      </div>
                    )}

                    {/* case 2.2: my bids - lose */}
                    {highestBid !== auctionView.price_bid && (
                      <div>
                        <div className={Label}>winning bid</div>
                        <div className={UserContainer}>
                          <Avatar src={winner.img_profile} size={32} />
                          <span>
                            {winner.username
                              ? winner.username
                              : shortenAddress(winner.wallet_address)}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* case 3: on sale - no bid */}
                {!haveWinner && isOwner && (
                  <>
                    <div>
                      <div className={Label}>reserve price</div>
                      <div className={StatusValue}>
                        {auctionView.auction_status.price_floor} SOL
                      </div>
                    </div>

                    {/* case 3.1: on sale - auction ended and no bid */}
                    {isEnded(state) && (
                      <div>
                        <div className={Label}>ending in</div>
                        <div className={StatusValue}>ended</div>
                      </div>
                    )}
                  </>
                )}

                {/* case 4: on sale - have bidder */}
                {haveWinner && isOwner && (
                  <>
                    <div>
                      <div className={Label}>
                        {isEnded(state) ? 'highest bid' : 'current bid'}
                      </div>
                      <div className={StatusValue}>{highestBid} SOL</div>
                    </div>

                    {/* case 4.1: on sale - auction ended */}
                    {!isEnded(state) && (
                      <div>
                        <div className={Label}>bid by</div>
                        <div className={UserContainer}>
                          <Avatar src={winner.img_profile} size={32} />
                          <span>
                            {winner.username
                              ? winner.username
                              : shortenAddress(winner.wallet_address)}
                          </span>{' '}
                        </div>
                      </div>
                    )}

                    {/* case 4.2: on sale - auction still live */}
                    {isEnded(state) && (
                      <div>
                        <div className={Label}>bid by</div>
                        <div className={UserContainer}>
                          <Avatar src={winner.img_profile} size={32} />
                          <span>
                            {winner.username
                              ? winner.username
                              : shortenAddress(winner.wallet_address)}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Link>
      </Col>

      <Col className={ButtonWrapper} span={6}>
        {!isOwner && (
          <div>
            <div className={Label}>your bid</div>
            <div className={Price}>{auctionView.price_bid} SOL</div>
          </div>
        )}

        {isOwner && isEnded(state) && haveWinner && (
          <div>
            <div className={Label}>settle fund</div>
            <div className={Price}>{auctionView.price_bid} SOL</div>
          </div>
        )}

        {isOwner && (
          <div>
            {!isInstantSale && <div className={Label}>ending in</div>}
            {state && !isEnded(state) && (
              <div className={StatusValue}>
                {state.hours} :{' '}
                {state.minutes > 0 ? state.minutes : `0${state.minutes}`} :{' '}
                {state.seconds > 0 ? state.seconds : `0${state.seconds}`}
              </div>
            )}

            {isEnded(state) && !isInstantSale && (
              <div className={StatusValue}>auction ended</div>
            )}
          </div>
        )}

        {/* case 1: auction still live */}
        {!isEnded(state) && !isOwner && (
          <ActionButton
            to={`/auction/${auctionView.auction_status.id}?action=bid`}
          >
            bid again
          </ActionButton>
        )}

        {/* case 2.1: auction ended & win */}
        {isEnded(state) && eligibleForAnything && !isOwner && (
          <ActionButton to={`/auction/${auctionView.auction_status.id}`}>
            claim NFT
          </ActionButton>
        )}

        {/* case 2.2: auction ended & lose */}
        {isEnded(state) &&
          !isInstantSale &&
          !eligibleForAnything &&
          !isOwner && (
            <ActionButton to={`/auction/${auctionView.auction_status.id}`}>
              {'refund bid'}
            </ActionButton>
          )}
      </Col>
    </Row>
  );
};
export const ActivityCard3 = ({ auctionView }: { auctionView: any }) => {
  const [state, setState] = useState<CountdownState>();
  const wallet = useWallet();
  const isInstantSale = auctionView.type_auction;
  const isOwner = auctionView.owner === wallet.publicKey?.toBase58();
  const highestBid = auctionView.highest_bid;
  const haveWinner = highestBid > 0;
  const eligibleForAnything = auctionView.price_bid === highestBid;
  useEffect(() => {
    const calc = () => setState(countDown(auctionView.end_auction));

    const interval = setInterval(() => calc(), 1000);
    calc();
    return () => clearInterval(interval);
  }, [auctionView, setState]);

  return (
    <Row className={ActivityCardStyle}>
      <Col className={NFTDescription} span={18}>
        <Link to={`/auction/${auctionView.id}`}>
          <Row>
            <Col flex={1}>
              <ArtContent
                className={ImageCard}
                pubkey={auctionView.id}
                allowMeshRender={true}
              />
            </Col>
            <Col flex={3}>
              <div className={NFTName}>{auctionView.nft_data.name}</div>
              {/* <div className={UserContainer}>
                <Avatar src={users[owner].img_profile} size={32} />
                <div>{users[owner].username ? users[owner].username : shortenAddress(owner)}</div>
              </div> */}

              <div className={NFTStatus}>
                {/* case 1: my bids - auction still live */}
                {!isEnded(state) && !isOwner && (
                  <>
                    <div>
                      <div className={Label}>current bid</div>
                      <div className={StatusValue}>{highestBid} SOL</div>
                    </div>
                    <div>
                      <div className={Label}>ending in</div>
                      {state && (
                        <div className={StatusValue}>
                          {state.hours} :{' '}
                          {state.minutes > 9
                            ? state.minutes
                            : `0${state.minutes}`}{' '}
                          :{' '}
                          {state.seconds > 9
                            ? state.seconds
                            : `0${state.seconds}`}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* case 2: my bids - auction ended */}
                {isEnded(state) && !isOwner && (
                  <>
                    <div>
                      <div className={Label}>highest bid</div>
                      <div className={StatusValue}>{highestBid} SOL</div>
                    </div>

                    {/* case 2.1: my bids - win */}
                    {highestBid === auctionView.price_bid && (
                      <div>
                        <div className={Label}>auction ended</div>
                        <div
                          className={StatusValue}
                          style={{ color: '#4CD964' }}
                        >
                          you won!
                        </div>
                      </div>
                    )}

                    {/* case 2.2: my bids - lose */}
                    {highestBid !== auctionView.price_bid && (
                      <div>
                        <div className={Label}>winning bid</div>
                        {/* <div className={UserContainer}>
                          <Avatar size={32} />
                          <span>{users[highestBid.info.bidderPubkey].username ? users[highestBid.info.bidderPubkey].username : shortenAddress(highestBid.info.bidderPubkey)}</span>
                        </div> */}
                      </div>
                    )}
                  </>
                )}

                {/* case 3: on sale - no bid */}
                {!haveWinner && isOwner && (
                  <>
                    <div>
                      <div className={Label}>reserve price</div>
                      <div className={StatusValue}>
                        {auctionView.price_floor} SOL
                      </div>
                    </div>

                    {/* case 3.1: on sale - auction ended and no bid */}
                    {isEnded(state) && (
                      <div>
                        <div className={Label}>ending in</div>
                        <div className={StatusValue}>ended</div>
                      </div>
                    )}
                  </>
                )}

                {/* case 4: on sale - have bidder */}
                {haveWinner && isOwner && (
                  <>
                    <div>
                      <div className={Label}>
                        {isEnded(state) ? 'highest bid' : 'current bid'}
                      </div>
                      <div className={StatusValue}>{highestBid} SOL</div>
                    </div>

                    {/* case 4.1: on sale - auction ended */}
                    {!isEnded(state) && (
                      <div>
                        <div className={Label}>bid by</div>
                        {/* <div className={UserContainer}>
                          <Avatar src={users[highestBid.info.bidderPubkey].img_profile} size={32} />
                          <span>{users[highestBid.info.bidderPubkey].username ? users[highestBid.info.bidderPubkey].username : shortenAddress(highestBid.info.bidderPubkey)}</span>
                        </div> */}
                      </div>
                    )}

                    {/* case 4.2: on sale - auction still live */}
                    {isEnded(state) && (
                      <div>
                        <div className={Label}>bid by</div>
                        {/* <div className={UserContainer}>
                          <Avatar src={users[highestBid.info.bidderPubkey].img_profile} size={32} />
                          <span>{users[highestBid.info.bidderPubkey].username ? users[highestBid.info.bidderPubkey].username : shortenAddress(highestBid.info.bidderPubkey)}</span>
                        </div> */}
                      </div>
                    )}
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Link>
      </Col>

      <Col className={ButtonWrapper} span={6}>
        {!isOwner && (
          <div>
            <div className={Label}>your bid</div>
            <div className={Price}>{auctionView.price_bid} SOL</div>
          </div>
        )}

        {isOwner && isEnded(state) && haveWinner && (
          <div>
            <div className={Label}>settle fund</div>
            <div className={Price}>{highestBid} SOL</div>
          </div>
        )}

        {isOwner &&
          !(
            isEnded(state) &&
            !isInstantSale &&
            !eligibleForAnything &&
            isOwner &&
            haveWinner
          ) && (
            <div>
              {!isInstantSale && <div className={Label}>ending in</div>}
              {state && !isEnded(state) && (
                <div className={StatusValue}>
                  {state.hours} :{' '}
                  {state.minutes > 0 ? state.minutes : `0${state.minutes}`} :{' '}
                  {state.seconds > 0 ? state.seconds : `0${state.seconds}`}
                </div>
              )}

              {isEnded(state) && !isInstantSale && (
                <div className={StatusValue}>auction ended</div>
              )}
            </div>
          )}

        {/* case 0: is owner and instant sell */}
        {isOwner && isInstantSale && (
          <ActionButton to={`/auction/${auctionView.id}`}>UNLIST</ActionButton>
        )}

        {/* case 2.1: auction ended & win */}

        {/* case 2.2: auction ended & lose */}

        {isEnded(state) &&
          !isInstantSale &&
          !eligibleForAnything &&
          isOwner &&
          !haveWinner && (
            <ActionButton to={`/auction/${auctionView.id}`}>
              reclaim NFT
            </ActionButton>
          )}
        {isEnded(state) &&
          !isInstantSale &&
          !eligibleForAnything &&
          isOwner &&
          haveWinner && (
            <ActionButton to={`/auction/${auctionView.id}/billing`}>
              settle
            </ActionButton>
          )}

        {/* case 2.3: owner */}
        {isOwner && !isEnded(state) && (
          <ActionButton to={`/auction/${auctionView.id}`}>
            view auction
          </ActionButton>
        )}
      </Col>
    </Row>
  );
};
