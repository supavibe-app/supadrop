import React, { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

import { ButtonStyle } from './style';

interface IActionButton {
  to?: string;
  width?: number | string;
  size?: "small" | "medium" | "large";
  onClick?: MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
  disabled?: boolean;
}

const ActionButton = ({ to, size, width, children, onClick, disabled }: IActionButton) => {
  let height = 60;
  let fontSize = 16;
  let padding = 16;

  switch (size) {
    case 'small':
      height = 48;
      fontSize = 14;
      padding = 14;
      break;
    case 'large':
      height = 78;
      fontSize = 24;
      padding = 20;
      break;
  }

  if (onClick) {
    return <div onClick={onClick} className={ButtonStyle({ height, width, fontSize, padding, disabled })}>
      {children}
    </div>
  }

  if (to) {
    return (
      <Link className={ButtonStyle({ height, width, fontSize, padding, disabled })} to={to}>{children}</Link>
    );
  }

  return (
    <div className={ButtonStyle({ height, width, fontSize, padding, disabled })}>
      {children}
    </div>
  );
};

export default ActionButton;
