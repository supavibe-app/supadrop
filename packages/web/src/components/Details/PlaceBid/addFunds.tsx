import React from 'react';
import { Button, Modal } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatNumber, useNativeAccount } from '@oyster/common';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AddFundsBalance, AddFundsModal, LogoSOL, SignInFTXButton } from './style';

const AddFundsComponent = ({ onCancel }) => {
  const { publicKey } = useWallet();
  const { account } = useNativeAccount();
  const balance = formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL);

  return (
    <Modal className={AddFundsModal} title="Add Funds" onCancel={onCancel} footer={null} width="360px" visible>
      <p style={{ color: 'white' }}>
        We partner with <b>FTX</b> to make it simple to start purchasing
        digital collectibles.
      </p>

      <div className={AddFundsBalance}>
        <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Balance
        </span>

        <span>
          {balance}&nbsp;&nbsp;
          <span className={LogoSOL}>
            <img src="/sol.svg" width="10" />
          </span>{' '}
          SOL
        </span>
      </div>

      <p>
        If you have not used FTX Pay before, it may take a few moments
        to get set up.
      </p>

      <Button
        className={SignInFTXButton}
        onClick={() => {
          window.open(
            `https://ftx.com/pay/request?coin=SOL&address=${publicKey?.toBase58()}&tag=&wallet=sol&memoIsRequired=false`,
            '_blank',
            'resizable,width=680,height=860',
          );
        }}
      >
        <div>
          <span style={{ marginRight: 6 }}>Sign with</span>
          <img src="/ftxpay.png" width="80" />
        </div>
      </Button>
    </Modal>
  );
};

export default AddFundsComponent;
