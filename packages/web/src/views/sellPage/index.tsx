import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Tabs, Button, Dropdown, Menu } from 'antd';
import { CardLoader } from '../../components/MyLoader';

import { ArtworkViewState } from './types';
import { useItems } from './hooks/useItems';
import ItemCard from './components/ItemCard';
import { useUserAccounts } from '@oyster/common';
import { DownOutlined } from '@ant-design/icons';
import { isMetadata, isPack } from './utils';
import { useMeta } from '@oyster/common';
import { ArtsContent, EmptyRow, EmptyStyle, TabsStyle } from '../profile/style';
import { ArtCard } from '../../components/ArtCard';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;
const { Content } = Layout;

export const SellView = () => {
  const { connected } = useWallet();
  const {
    isLoadingMetaplex,
    pullAllMetadata,
    storeIndexer,
    pullItemsPage,
    art: artData,
    isLoadingAllMetadata,
    counterPullAllMetadata,
  } = useMeta();
  const { userAccounts } = useUserAccounts();

  const [activeKey, setActiveKey] = useState(ArtworkViewState.Metaplex);

  const userItems = useItems({ activeKey });

  useEffect(() => {
    if (
      !isLoadingMetaplex &&
      counterPullAllMetadata === 0 &&
      !isLoadingAllMetadata
    ) {
      pullAllMetadata();
    }
  }, [isLoadingMetaplex]);

  useEffect(() => {
    if (connected) {
      setActiveKey(ArtworkViewState.Owned);
    } else {
      setActiveKey(ArtworkViewState.Metaplex);
    }
  }, [connected, setActiveKey]);

  const artworkGrid = (
    <div className="artwork-grid">
      {isLoadingAllMetadata &&
        userItems.length === 0 &&
        [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
      {(!isLoadingMetaplex || userItems.length > 0) &&
        userItems.map(item => {
          const pubkey = isMetadata(item)
            ? item.pubkey
            : isPack(item)
            ? item.provingProcessKey
            : item.edition?.pubkey || item.metadata.pubkey;

          return <ItemCard item={item} key={pubkey} />;
        })}
    </div>
  );
  const EmptyState = () => (
    <Col className={EmptyStyle} span={24}>
      <div>nothing to show</div>
      <div>haven't collect or create any NFTs yet</div>
    </Col>
  );

  return (
    <Row>
      <Col
        className={ArtsContent}
        span={24}
        xs={24}
        sm={24}
        md={24}
        lg={24}
        xl={24}
        xxl={24}
      >
        <Tabs className={TabsStyle}>
          <TabPane
            key="2"
            tab={
              <>
                Not Listed{' '}
                <span>
                  {userItems.length === 0 || isLoadingAllMetadata
                    ? ''
                    : userItems.length < 10
                    ? `0${userItems.length}`
                    : userItems.length}
                </span>
              </>
            }
          >
            <Row
              className={userItems.length === 0 ? EmptyRow : ``}
              gutter={[36, 36]}
            >
              {isLoadingAllMetadata &&
                [...Array(10)].map((_, idx) => (
                  <Col key={idx} span={6}>
                    {' '}
                    <CardLoader key={idx} />
                  </Col>
                ))}
              {!isLoadingAllMetadata &&
                !isLoadingMetaplex &&
                userItems.length === 0 && <EmptyState />}

              {!isLoadingAllMetadata &&
                userItems.map((art: any) => {
                  const pubkey = art?.metadata?.pubkey;
                  console.log(
                    '🚀 ~ file: index.tsx ~ line 125 ~ userItems.map ~ pubkey',
                    pubkey,
                  );

                  return (
                    <Col key={pubkey} span={6}>
                      <Link to={`/art/${pubkey}`}>
                        <ArtCard
                          key={pubkey}
                          pubkey={pubkey}
                          name={art?.metadata?.info?.data?.name}
                          onSellPage={true}
                          preview={false}
                        />
                      </Link>
                    </Col>
                  );
                })}
            </Row>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};
