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
  const [confirmed, setConfirmed] = useState(false);

  const title = confirmed
    ? 'Your NFT succesfully listed!'
    : 'Your NFT is being listed';
  const description =
    'your NFT will be put on supadrop marketplace as soon as the transaction processed';

  useEffect(() => {
    const func = async () => {
      await props
        .createAuction()
        .then(() => {
          // user click approve
          setConfirmed(true);
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
