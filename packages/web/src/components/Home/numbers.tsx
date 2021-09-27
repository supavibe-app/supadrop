import React from 'react';
import { Col, Row, Statistic } from 'antd';
import { CountdownState } from '@oyster/common/dist/lib';

import { Availability, CreateStatistic, Label, NumberStyle, Timer } from './style';
import isEnded from './helpers/isEnded';

const Numbers = ({ state }: { state: CountdownState | undefined; }) => {
  return (
    <div style={{ marginBottom: 48 }}>
      <Row>
        <Col span={8}>
          <Statistic
            className={CreateStatistic}
            title="reserve price"
            value={2}
            suffix="SOL"
          />

          <div className={Availability}>24/111 left</div>
        </Col>

        <Col span={16}>
          <Countdown state={state} />
        </Col>
      </Row>
    </div>
  );
};

const Countdown = ({ state }: { state?: CountdownState }) => {
  return (
    <div style={{ width: '100%' }}>
      <div className={Timer}>
        {state && isEnded(state) ? 'ending in' : 'starting in'}
      </div>

      {state &&
        <Row gutter={[24, 0]}>
          {state.days > 0 && (
            <Col>
              <div className={NumberStyle}>
                {state.days < 10 && <span>0</span>}
                {state.days}
              </div>
              <div className={Label}>days</div>
            </Col>
          )}

          <Col>
            <div className={NumberStyle}>
              {state.hours < 10 && <span>0</span>}
              {state.hours}
            </div>
            <div className={Label}>hours</div>
          </Col>

          <Col>
            <div className={NumberStyle}>
              {state.minutes < 10 && <span>0</span>}
              {state.minutes}
            </div>
            <div className={Label}>minutes</div>
          </Col>

          {state.days === 0 && (
            <Col>
              <div className={NumberStyle}>
                {state.seconds < 10 && <span style={{ opacity: 0.2 }}>0</span>}
                {state.seconds}
              </div>
              <div className={Label}>seconds</div>
            </Col>
          )}
        </Row>
      }
    </div>
  );
};

export default Numbers;