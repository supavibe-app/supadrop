import React from 'react';
import FeatherIcon from 'feather-icons-react';
import { Avatar } from 'antd';
import { DefaultStyle } from './style';

const DefaultAvatar = ({ size, iconSize }) => {
  return (
    <Avatar
      style={{ background: '#7E7C7C' }}
      className={DefaultStyle}
      size={size}
      src={<FeatherIcon icon="user" size={iconSize} />}
    />
  );
}

export default DefaultAvatar;
