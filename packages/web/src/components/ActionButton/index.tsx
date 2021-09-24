import React from 'react';
import { Link } from 'react-router-dom';

import { ButtonStyle } from './style';

interface IActionButton {
  to: string;
  width?: number;
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
}

const ActionButton = ({ to, size, width, children }: IActionButton) => {
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

  return (
    <Link className={ButtonStyle({ height, width, fontSize, padding })} to={to}>{children}</Link>
  )
};

export default ActionButton;
