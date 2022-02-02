import React, { MouseEventHandler } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { ButtonStyle } from './style';

interface IActionButton {
  to?: string;
  width?: number | string;
  size?: 'small' | 'medium' | 'large';
  onClick?: MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
  disabled?: boolean;
}

const ActionButton = ({
  to,
  size,
  width,
  children,
  onClick,
  disabled,
}: IActionButton) => {
  const { push } = useHistory();
  let height = 74;
  let fontSize = 20;
  let padding = 18;

  switch (size) {
    case 'small':
      height = 48;
      fontSize = 14;
      padding = 10;
      break;
    case 'large':
      height = 78;
      fontSize = 24;
      padding = 16;
      break;
  }

  if (!disabled && onClick) {
    return (
      <div onClick={onClick}>
        <div
          className={ButtonStyle({
            height,
            width,
            fontSize,
            padding,
            disabled,
          })}
        >
          {children}
        </div>
      </div>
    );
  }

  if (!disabled && to) {
    return (
      <div onClick={() => push(to)}>
        <div
          className={ButtonStyle({
            height,
            width,
            fontSize,
            padding,
            disabled,
          })}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={ButtonStyle({ height, width, fontSize, padding, disabled })}
    >
      {children}
    </div>
  );
};

export default ActionButton;
