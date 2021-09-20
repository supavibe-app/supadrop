import React from 'react';
import { Row, Statistic } from 'antd';
import { Availability, CreateStatistic } from './style';

interface IAmountLabel {
  amount: number | string;
  displayUSD?: boolean;
  title?: string;
  style?: object;
  containerStyle?: object;
}

export const AmountLabel = (props: IAmountLabel) => {
  const {
    amount: _amount,
    title = '',
    style = {},
    containerStyle = {},
  } = props;
  const amount = typeof _amount === 'string' ? parseFloat(_amount) : _amount;

  return (
    <div style={{ display: 'flex', ...containerStyle }}>
      <Row>
        <Statistic
          style={style}
          className={CreateStatistic}
          title={title || ''}
          value={amount}
          suffix="SOL"
        />
      </Row>

      <div className={Availability}>
        {/* TODO-Iyai: Handle if sold out */}
        24/111 left
      </div>
    </div>
  );
};
