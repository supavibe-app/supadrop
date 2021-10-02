import React, { useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Avatar, Button, Modal, Popover } from 'antd';

import { useNativeAccount } from '../../contexts/accounts';
import { formatNumber } from '../../utils';
import { Settings } from '../Settings';
import { AddressStyle, BalanceStyle, DetailBox, ModalEditProfile, ProfileContainer, ProfilePopover } from './style';
import { supabase } from '../../supabaseClient';
export const CurrentUserBadge = (props: {
  showBalance?: boolean;
  showAddress?: boolean;
  iconSize?: number;
}) => {
  const { wallet, publicKey } = useWallet();
  const { account } = useNativeAccount();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const [name,setName] = useState('')
  const [username,setUsername] = useState('')
  const [twitter,setTwitter] = useState('')
  const [website,setWebsite] = useState('')
  const [bio,setBio] = useState('')

  const base58 = publicKey?.toBase58() || '';
  const keyToDisplay =
    base58.length > 12
      ? `${base58.substring(0, 4)}...${base58.substring(
        base58.length - 4,
        base58.length,
      )}`
      : base58;

  if (!wallet || !publicKey) {
    return null;
  }

  const handleShowEditProfile = () => {
    setShowEditProfile(true);
    setShowPopover(false);
  };

  return (
    <>
      <div className="wallet-wrapper">
        <Popover
          overlayClassName={ProfilePopover}
          color="#000000"
          content={<Settings setShowEdit={handleShowEditProfile} />}
          trigger="click"
          placement="bottomRight"
          onVisibleChange={visible => setShowPopover(visible)}
          visible={showPopover}
        >
          <div className={ProfileContainer}>
            <div className={DetailBox}>
              <div className={BalanceStyle}>{formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL)} SOL</div>
              <div className={AddressStyle}>{keyToDisplay}</div>
            </div>

            <Avatar src={wallet.icon} size={42} style={{ cursor: 'pointer' }} />
          </div>
        </Popover>
      </div>

      <Modal
        className={ModalEditProfile}
        title="edit profile"
        visible={showEditProfile}
        onCancel={() => setShowEditProfile(false)}
        footer={[
          <Button key="save" type="link" style={{ fontWeight: 'bold' }} onClick={()=>{
            console.log(name);
            console.log(username);
            console.log(twitter);
            console.log(website);
            console.log(bio);
            supabase.from('user_data')
            .update({
              name,twitter,username,website,bio
            })
            .eq('wallet_address',base58)
            .then()
            setShowEditProfile(false)
          }} >
            save
          </Button>,
        ]}
      >
        <input type="text" style={{ 
      color:'black',
    	borderColor: 'gray', 
    	borderWidth: 1,
    }} 
    onChange={text => setName(text.target.value)}
    />
        <input type="text" style={{ 
      color:'black',
    	borderColor: 'gray', 
    	borderWidth: 1,
    }} 
    onChange={text => setUsername(text.target.value)}
    />
        <input type="text" style={{ 
      color:'black',
    	borderColor: 'gray', 
    	borderWidth: 1,
    }} 
    onChange={text => setTwitter(text.target.value)}
    />
        <input type="text" style={{ 
      color:'black',
    	borderColor: 'gray', 
    	borderWidth: 1,
    }} 
    onChange={text => setWebsite(text.target.value)}
    />
        <input type="text" style={{ 
      color:'black',
    	borderColor: 'gray', 
    	borderWidth: 1,
    }} 
    onChange={text => setBio(text.target.value)}
    />

      </Modal>
    </>
  );
};
