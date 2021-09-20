import React from 'react';
import { Link } from 'react-router-dom';

import { ButtonStyle } from './style';

interface IActionButton {
  to: string;
  width?: number;
}

const ActionButton = ({ to, width }: IActionButton) => {
  return (
    <Link className={ButtonStyle(width)} to={to}>view auction</Link>
  )
};

export default ActionButton;
