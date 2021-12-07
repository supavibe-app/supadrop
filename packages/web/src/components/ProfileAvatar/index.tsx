import React from 'react';
import FeatherIcon from 'feather-icons-react';
import { Avatar } from 'antd';
import { AvatarStyle, StyledLink } from './style';
import { Identicon, shortenAddress } from '@oyster/common';
import { Link, useHistory } from 'react-router-dom';

const ProfileAvatar = ({ imgProfile, walletAddress, username, size = 32 }) => {
  const { push } = useHistory();
  return (
    <>
      <Link to={`/${username || walletAddress}`}>
        <Avatar
          src={
            imgProfile || (
              <Identicon address={walletAddress} style={{ width: size }} />
            )
          }
          size={size}
          className={AvatarStyle}
        />
      </Link>
      <Link to={`/${username || walletAddress}`}>
        <span style={{ color: '#fafafb' }}>
          {username || shortenAddress(walletAddress)}
        </span>
      </Link>
    </>
  );
};

export default ProfileAvatar;
