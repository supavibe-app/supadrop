import React from 'react';
import { Col, Row, Statistic } from 'antd';
import { CountdownState } from '@oyster/common/dist/lib';
import { useMeta } from '../../contexts';
import { Availability, CreateStatistic, Label, NumberStyle, Timer } from './style';
import isEnded from './helpers/isEnded';

const Numbers = ({ state }: { state: CountdownState | undefined; }) => {
  const {dataCollection} = useMeta();

  return (
    <div style={{ marginBottom: 48 }}>
      <Row>
        <Col span={8} md={8} sm={24} xs={24}>
          <Statistic
            className={CreateStatistic}
            title="reserve price"
            value={dataCollection.price}
            suffix="SOL"
          />

          <div className={Availability}>{`${dataCollection.sold}/${dataCollection.supply}`} left</div>
        </Col>

        <Col span={16} md={16} sm={24} xs={24}>
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