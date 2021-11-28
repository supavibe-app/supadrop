import { CountdownState, Identicon, shortenAddress } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import countDown from '../../../helpers/countdown';
import { Avatar, Col, Row } from 'antd';
import {
  ActivityCardStyle,
  ButtonWrapper,
  ImageCard,
  Label,
  NFTDescription,
  NFTName,
  NFTStatus,
  Price,
  StatusValue,
  UserContainer,
} from './style';
import { Link } from 'react-router-dom';
import { ArtContent } from '../../../components/ArtContent';
import isEnded from '../../../components/Home/helpers/isEnded';
import ActionButton from '../../../components/ActionButton';
export const ActivityCardOnSale = ({ auctionView }: { auctionView: any }) => {
  const [state, setState] = useState<CountdownState>();

  const wallet = useWallet();
  const isInstantSale = auctionView.type_auction;
  const owner = auctionView.owner;
  const highestBid = auctionView.highest_bid;
  const winner = auctionView.winner;

  const haveWinner = highestBid > 0;
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
              <div className={NFTName}>{auctionView.id_nft.name}</div>
              <div className={UserContainer}>
                <Avatar
                  src={
                    owner.img_profile || (
                      <Identicon
                        address={owner.wallet_address}
                        style={{ width: 32 }}
                      />
                    )
                  }
                  size={32}
                />
                <div>
                  {owner.username
                    ? owner.username
                    : shortenAddress(owner.wallet_address)}
                </div>
              </div>

              <div className={NFTStatus}>
                {/* case 3: on sale - no bid */}
                {!haveWinner && (
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
                {haveWinner && (
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
                          <Avatar
                            src={
                              winner.img_profile || (
                                <Identicon
                                  address={owner.wallet_address}
                                  style={{ width: 32 }}
                                />
                              )
                            }
                            size={32}
                          />
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
                          <Avatar
                            src={
                              winner.img_profile || (
                                <Identicon
                                  address={owner.wallet_address}
                                  style={{ width: 32 }}
                                />
                              )
                            }
                            size={32}
                          />
                          <span>
                            {winner.username
                              ? winner.username
                              : shortenAddress(winner.wallet_address)}
                          </span>{' '}
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
        {isEnded(state) && haveWinner && (
          <div>
            <div className={Label}>settle fund</div>
            <div className={Price}>{highestBid} SOL</div>
          </div>
        )}
        {isEnded(state) && !haveWinner && (
          <div>
            <div className={Label}>ending in</div>
            <div className={StatusValue}>auction ended</div>
          </div>
        )}

        {/* case 0: is owner and instant sell */}
        {isInstantSale && (
          <ActionButton to={`/auction/${auctionView.id}`}>UNLIST</ActionButton>
        )}

        {/* case 2.1: auction ended & win */}

        {/* case 2.2: auction ended & lose */}

        {isEnded(state) && !isInstantSale && !haveWinner && (
          <ActionButton to={`/auction/${auctionView.id}`}>
            reclaim NFT
          </ActionButton>
        )}
        {isEnded(state) && !isInstantSale && haveWinner && (
          <ActionButton to={`/auction/${auctionView.id}/settle`}>
            settle
          </ActionButton>
        )}

        {/* case 2.3: owner */}
        {!isEnded(state) && (
          <ActionButton to={`/auction/${auctionView.id}`}>
            view auction
          </ActionButton>
        )}
      </Col>
    </Row>
  );
};