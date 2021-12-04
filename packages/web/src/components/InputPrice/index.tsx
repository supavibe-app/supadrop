import React, { ChangeEventHandler } from 'react';
import { Input } from 'antd';
import { InputPriceStyle } from './style';

interface IInputPrice {
  defaultValue?: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  suffix?: string;
}

const InputPrice = ({
  defaultValue,
  onChange,
  placeholder,
  suffix,
}: IInputPrice) => {
  return (
    <Input
      className={InputPriceStyle}
      defaultValue={defaultValue}
      placeholder={placeholder}
      suffix={suffix}
      onWheel={event => event.currentTarget.blur()}
      type="number"
      onChange={onChange}
    />
  );
};

export default InputPrice;
