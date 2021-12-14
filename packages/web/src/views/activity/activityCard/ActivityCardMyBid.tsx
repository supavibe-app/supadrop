import {
  CountdownState,
  Identicon,
  shortenAddress,
  supabase,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import countDown from '../../../helpers/countdown';
import { Col, Row } from 'antd';
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
import { ArtContent, ArtContent2 } from '../../../components/ArtContent';
import isEnded from '../../../components/Home/helpers/isEnded';
import ActionButton from '../../../components/ActionButton';
import ProfileAvatar from '../../../components/ProfileAvatar';

export const ActivityCardMyBid = ({ auctionView }: { auctionView: any }) => {
  const [state, setState] = useState<CountdownState>();
  const wallet = useWallet();
  const isInstantSale = auctionView.id_auction.type_auction;

  const owner = auctionView.id_auction.owner;
  const winner = auctionView.id_auction.winner;

  const isWinner = winner?.wallet_address === wallet.publicKey?.toBase58();

  const highestBid = auctionView.id_auction.highest_bid;

  useEffect(() => {
    const calc = () => setState(countDown(auctionView.id_auction.end_auction));

    const interval = setInterval(() => calc(), 1000);
    calc();
    return () => clearInterval(interval);
  }, [auctionView, setState]);

  return (
    <Row className={ActivityCardStyle}>
      <Col className={NFTDescription} span={18}>
        <Link to={`/auction/${auctionView.id_auction.id}`}>
          <Row>
            <Col flex={1}>
              <ArtContent2
                className={ImageCard}
                preview={false}
                pubkey={auctionView.id_auction.id_nft.id}
                originalFile={auctionView.id_auction.id_nft.original_file}
                thumbnail={auctionView.id_auction.id_nft?.thumbnail}
                allowMeshRender={false}
                category={'activity'}
              />
            </Col>
            <Col flex={3}>
              <div className={NFTName}>
                {auctionView.id_auction.id_nft.name}
              </div>
              <div className={UserContainer}>
                <ProfileAvatar
                  imgProfile={owner?.img_profile}
                  username={owner?.username}
                  walletAddress={owner?.wallet_address}
                />
              </div>

              <div className={NFTStatus}>
                {/* case 1: my bids - auction still live */}
                {!isEnded(state) && (
                  <>
                    <div>
                      <div className={Label}>current bid</div>
                      <div className={StatusValue}>{highestBid} SOL</div>
                    </div>
                    <div>
                      <div className={Label}>ending in</div>
                      {state && (
                        <div className={StatusValue}>
                          {state.hours > 9 ? state?.hours : `0${state.hours}`} :{' '}
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
                {isEnded(state) && (
                  <>
                    <div>
                      <div className={Label}>highest bid</div>
                      <div className={StatusValue}>{highestBid} SOL</div>
                    </div>

                    {/* case 2.1: my bids - win */}
                    {isWinner && (
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
                    {!isWinner && (
                      <div>
                        <div className={Label}>winning bid</div>
                        <div className={UserContainer}>
                          <ProfileAvatar
                            imgProfile={winner.img_profile}
                            username={winner.username}
                            walletAddress={winner.wallet_address}
                          />
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
        <div>
          <div className={Label}>your bid</div>
          <div className={Price}>{auctionView.price_bid} SOL</div>
        </div>

        {/* case 1: auction still live */}
        {!isEnded(state) && (
          <ActionButton to={`/auction/${auctionView.id_auction.id}?action=bid`}>
            bid again
          </ActionButton>
        )}

        {/* case 2.1: auction ended & win */}
        {isEnded(state) && isWinner && (
          <ActionButton to={`/auction/${auctionView.id_auction.id}`}>
            claim NFT
          </ActionButton>
        )}

        {/* case 2.2: auction ended & lose */}
        {isEnded(state) && !isInstantSale && !isWinner && (
          <ActionButton to={`/auction/${auctionView.id_auction.id}`}>
            {'refund bid'}
          </ActionButton>
        )}
      </Col>
    </Row>
  );
};
