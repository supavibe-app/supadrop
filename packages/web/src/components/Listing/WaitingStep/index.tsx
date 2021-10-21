import React, { useEffect, useState } from 'react';
import { Col, Spin } from 'antd';
import { Description, Title } from '../style';
import { useHistory } from 'react-router';

const WaitingStep = (props: {
  createAuction: () => Promise<void>;
  confirm: () => void;
  goBack: () => void;
}) => {
  const history = useHistory();
  const [confirmed, setConfirimed] = useState(false);

  const title = confirmed
    ? 'Your NFT is being listed'
    : 'waiting for confirmation';
  const description = confirmed
    ? 'your NFT will be put on supadrop marketplace as soon as the transaction processed'
    : 'confirm he transaction in your wallet to continue';

  useEffect(() => {
    const func = async () => {
      await props
        .createAuction()
        .then(() => {
          // user click approve
          setConfirimed(true);
          props.confirm();
        })
        .catch(err => {
          // user click cancel
          console.error(err);
          props.goBack();
        });
    };
    func();
  }, []);

  return (
    <Col span={9}>
      <div className={Title}>{title}</div>
      <div className={Description}>{description}</div>
      <Spin />
    </Col>
  );
};

export default WaitingStep;
