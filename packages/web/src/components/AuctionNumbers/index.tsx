import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';

import {
  formatTokenAmount,
  useMint,
  fromLamports,
  CountdownState,
  PriceFloorType,
} from '@oyster/common';
import { AuctionView, AuctionViewState, useBidsForAuction } from '../../hooks';
import { AmountLabel } from '../AmountLabel';
import { Label, NumberStyle, Timer } from './style';

export const AuctionNumbers = (props: { auctionView: AuctionView }) => {
  const { auctionView } = props;
  const bids = useBidsForAuction(auctionView.auction.pubkey);
  const mintInfo = useMint(auctionView.auction.info.tokenMint);

  const participationFixedPrice =
    auctionView.auctionManager.participationConfig?.fixedPrice || 0;
  const participationOnly =
    auctionView.auctionManager.numWinners.toNumber() === 0;
  const priceFloor =
    auctionView.auction.info.priceFloor.type === PriceFloorType.Minimum
      ? auctionView.auction.info.priceFloor.minPrice?.toNumber() || 0
      : 0;
  const isUpcoming = auctionView.state === AuctionViewState.Upcoming;
  const isStarted = auctionView.state === AuctionViewState.Live;

  const [state, setState] = useState<CountdownState>();

  const auction = auctionView.auction.info;

  useEffect(() => {
    const calc = () => {
      const newState = auction.timeToEnd();

      setState(newState);
    };

    const interval = setInterval(() => {
      calc();
    }, 1000);

    calc();
    return () => clearInterval(interval);
  }, [auction]);

  const ended = isEnded(state);

  return (
    <div style={{ minWidth: 350 }}>
      <Row>
        {(!ended || auctionView.isInstantSale) && (
          <Col span={12}>
            {(isUpcoming || bids.length === 0) && (
              <AmountLabel
                style={{ marginBottom: 10 }}
                containerStyle={{ flexDirection: 'column' }}
                title={auctionView.isInstantSale ? 'Price' : 'Starting bid'}
                amount={fromLamports(
                  participationOnly ? participationFixedPrice : priceFloor,
                  mintInfo,
                )}
              />
            )}
            {isStarted && bids.length > 0 && (
              <AmountLabel
                style={{ marginBottom: 10 }}
                containerStyle={{ flexDirection: 'column' }}
                title="Highest bid"
                amount={formatTokenAmount(bids[0].info.lastBid, mintInfo)}
              />
            )}
          </Col>
        )}

        {!ended && <Col span={ended ? 24 : 12}>
          <Countdown state={state}/>
        </Col>}
      </Row>
    </div>
  );
};

const isEnded = (state?: CountdownState) =>
  state?.days === 0 &&
  state?.hours === 0 &&
  state?.minutes === 0 &&
  state?.seconds === 0;

const Countdown = ({ state }: { state?: CountdownState }) => {
  return (
    <>
      <div style={{ width: '100%' }}>
        <>
          <div
            className="info-header"
            style={{
              margin: '12px 0',
              fontSize: 18,
            }}
          >
            Time left
          </div>
          {state &&
            (isEnded(state) ? (
              <Row style={{ width: '100%' }}>
                <div className="cd-number">This auction has ended</div>
              </Row>
            ) : (
              <Row style={{ width: '100%', flexWrap: 'nowrap' }}>
                {state && state.days > 0 && (
                  <Col>
                    <div className="cd-number">
                      {state.days < 10 && (
                        <span style={{ opacity: 0.2 }}>0</span>
                      )}
                      {state.days}
                      <span style={{ opacity: 0.2 }}>:</span>
                    </div>
                    <div className="cd-label">days</div>
                  </Col>
                )}
                <Col>
                  <div className="cd-number">
                    {state.hours < 10 && (
                      <span style={{ opacity: 0.2 }}>0</span>
                    )}
                    {state.hours}
                    <span style={{ opacity: 0.2 }}>:</span>
                  </div>
                  <div className="cd-label">hour</div>
                </Col>
                <Col>
                  <div className="cd-number">
                    {state.minutes < 10 && (
                      <span style={{ opacity: 0.2 }}>0</span>
                    )}
                    {state.minutes}
                    {state.days === 0 && (
                      <span style={{ opacity: 0.2 }}>:</span>
                    )}
                  </div>
                  <div className="cd-label">mins</div>
                </Col>
                {!state.days && (
                  <Col>
                    <div className="cd-number">
                      {state.seconds < 10 && (
                        <span style={{ opacity: 0.2 }}>0</span>
                      )}
                      {state.seconds}
                    </div>
                    <div className="cd-label">secs</div>
                  </Col>
                )}
              </Row>
            ))}
        </>
      </div>
    </>
  );

//   export const AuctionNumbers = () => {
//     const [state, setState] = useState<CountdownState>();
//     const now = moment().unix();
//     // TODO-Iyai: get endAt from DB
//     const endAt = 1632167969;
//
//     const countDown = () => {
//       const ended = { days: 0, hours: 0, minutes: 0, seconds: 0 };
//
//       let delta = endAt - now;
//       if (!endAt || delta <= 0)
//         return ended;
//       const days = Math.floor(delta / 86400);
//       delta -= days * 86400;
//       const hours = Math.floor(delta / 3600) % 24;
//       delta -= hours * 3600;
//       const minutes = Math.floor(delta / 60) % 60;
//       delta -= minutes * 60;
//       const seconds = Math.floor(delta % 60);
//       return { days, hours, minutes, seconds };
//     }
//
//     useEffect(() => {
//       const calc = () => {
//         const newState = countDown();
//
//         setState(newState);
//       };
//
//       const interval = setInterval(() => {
//         calc();
//       }, 1000);
//
//       calc();
//       return () => clearInterval(interval);
//     });
//
//     return (
//       <div style={{ marginBottom: 48 }}>
//         <Row>
//           <Col span={8}>
//             <AmountLabel
//               style={{ marginBottom: 8 }}
//               containerStyle={{ flexDirection: 'column' }}
//               title="reserve price"
//               amount={2}
//             />
//           </Col>
//
//           <Col span={16}>
//             <Countdown state={state} />
//           </Col>
//         </Row>
//       </div>
//     );
//   };
//
//   const isEnded = (state?: CountdownState) =>
//     state?.days === 0 &&
//     state?.hours === 0 &&
//     state?.minutes === 0 &&
//     state?.seconds === 0;
//
//   const Countdown = ({ state }: { state?: CountdownState }) => {
//     return (
//       <div style={{ width: '100%' }}>
//         <div className={Timer}>
//           {state && isEnded(state) ? 'ending in' : 'starting in'}
//         </div>
//
//         {state &&
//           <Row gutter={[24, 0]}>
//             {state.days > 0 && (
//               <Col>
//                 <div className={NumberStyle}>
//                   {state.days < 10 && <span>0</span>}
//                   {state.days}
//                 </div>
//                 <div className={Label}>days</div>
//               </Col>
//             )}
//
//             <Col>
//               <div className={NumberStyle}>
//                 {state.hours < 10 && <span>0</span>}
//                 {state.hours}
//               </div>
//               <div className={Label}>hours</div>
//             </Col>
//
//             <Col>
//               <div className={NumberStyle}>
//                 {state.minutes < 10 && <span>0</span>}
//                 {state.minutes}
//               </div>
//               <div className={Label}>minutes</div>
//             </Col>
//
//             {state.days === 0 && (
//               <Col>
//                 <div className={NumberStyle}>
//                   {state.seconds < 10 && <span style={{ opacity: 0.2 }}>0</span>}
//                   {state.seconds}
//                 </div>
//                 <div className={Label}>seconds</div>
//               </Col>
//             )}
//           </Row>
//         }
//       </div>
//     );
};
