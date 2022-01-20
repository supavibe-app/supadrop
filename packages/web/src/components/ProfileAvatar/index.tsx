import React from 'react';
import FeatherIcon from 'feather-icons-react';
import { Avatar } from 'antd';
import { AvatarStyle, StyledLink } from './style';
import { Identicon, shortenAddress, useMeta } from '@oyster/common';
import { Link, useHistory } from 'react-router-dom';

const ProfileAvatar = ({ walletAddress, size = 32 }) => {
  const { push } = useHistory();
  const { users } = useMeta();
  const user = users[walletAddress];
  return (
    <>
      <Link to={`/${user?.username || walletAddress}`}>
        <Avatar
          src={
            user?.img_profile || (
              <Identicon address={walletAddress} style={{ width: size }} />
            )
          }
          size={size}
          className={AvatarStyle}
        />
      </Link>
      <Link to={`/${user?.username || walletAddress}`}>
        <span style={{ color: '#fafafb' }}>
          {user?.username || shortenAddress(walletAddress)}
        </span>
      </Link>
    </>
  );
};

export default ProfileAvatar;
