import React, { useEffect, useState } from 'react';
import { Col, Divider, Dropdown, Menu, Row, Select } from 'antd';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { ItemAuction, supabase, useMeta } from '@oyster/common';
import { AuctionRenderCard } from '../../components/AuctionRenderCard';
import {
  ActiveSortBy,
  CreatorName,
  DetailsInformation,
  DropdownStyle,
  OverlayStyle,
} from './style';
import { GreyColor, uTextAlignEnd, YellowGlowColor } from '../../styles';
import { getUsernameByPublicKeys } from '../../database/userData';
// import moment from 'moment';

const { Option } = Select;

const MarketComponent = () => {
  const [sortBy, setSortBy] = useState(1);
  const [updatedData, handleUpdatedData] = useState(null);

  // const now = moment().unix();
  const [list, setList] = useState<ItemAuction[]>([]);
  const [lowestPrice, setLowestPrice] = useState(0);

  let sortByText = 'lowest price';
  const getData = async () => {
    supabase
      .from('auction_status')
      .select(
        `
    *,
    id_nft (
      *
    )
    `,
      )
      .is('type_auction', true)
      .is('isLiveMarket', true)
      .then(dataAuction => {
        if (dataAuction.body != null) {
          let data: ItemAuction[] = [];
          dataAuction.body.forEach(v => {
            let itemAuction = new ItemAuction(
              v.id,
              v.id_nft.name,
              v.id_nft.id,
              v.token_mint,
              v.price_floor,
              v.id_nft.original_file,
              v.id_nft.thumbnail,
              v.id_nft.media_type,
              v.start_auction,
              v.end_auction,
              v.highest_bid,
              v.price_tick,
              v.gap_time,
              v.tick_size_ending_phase,
              v.vault,
              v.id_nft.arweave_link,
              v.owner,
              v.winner,
              v.id_nft.mint_key,
              v.type_auction,
            );

            data.push(itemAuction);
          });
          setList(data);
        }
      });
  };
  const getInfo = async () => {
    supabase
      .from('auction_status')
      .select(
        `
    *,
    nft_data (
      *
    )
    `,
      )
      .is('type_auction', true)
      .is('isLiveMarket', true)
      .order('price_floor', { ascending: true })
      .limit(1)
      .then(dataAuction => {
        if (dataAuction.body && dataAuction.body?.length > 0) {
          setLowestPrice(dataAuction.body[0].price_floor);
        }
      });
  };
  const getChange = () => {
    const mySubscription = supabase
      .from('auction_status')
      .on('UPDATE', payload => {
        handleUpdatedData(payload.new.id);
      })
      .subscribe();
    return mySubscription;
  };
  useEffect(() => {
    getData();
    getInfo();
    const mySubscription = getChange();

    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, []);

  useEffect(() => {
    const newData = list.filter(tes => tes.id !== updatedData);
    setLowestPrice(
      newData.length > 0
        ? newData.reduce((prev, curr) =>
            prev.price_floor < curr.price_floor ? prev : curr,
          ).price_floor
        : 0,
    );
    setList(newData);
  }, [updatedData]);

  switch (sortBy) {
    case 1:
      list.sort((a, b) => a.price_floor - b.price_floor);
      break;
    case 2:
      list.sort((a, b) => b.price_floor - a.price_floor);
      sortByText = 'highest price';
      break;
    default:
      // sort by lowest price
      list.sort((a, b) => a.price_floor - b.price_floor);
      break;
  }

  const SortByOption = (
    <Menu>
      <Menu.Item
        className={sortBy === 1 ? ActiveSortBy : ''}
        key="0"
        onClick={() => setSortBy(1)}
      >
        lowest price
      </Menu.Item>
      <Menu.Item
        className={sortBy === 2 ? ActiveSortBy : ''}
        key="1"
        onClick={() => setSortBy(2)}
      >
        highest price
      </Menu.Item>
    </Menu>
  );

  const ownerAddress = list.map(auction => auction.owner);
  const { data = {} } = getUsernameByPublicKeys(ownerAddress);

  return (
    <Row justify="center">
      <Col
        style={{ margin: '24px 0 48px 0' }}
        span={20}
        xs={20}
        sm={20}
        md={20}
        lg={20}
        xl={18}
        xxl={16}
      >
        <div className={CreatorName}>
          <span>CRYSTAL PUNKS </span>
          <FeatherIcon icon="check-circle" />
        </div>

        <Row className={DetailsInformation} justify="space-between">
          <Col span={8}>
            <Row justify="space-between">
              <Col>
                <div className={GreyColor}>floor price</div>
                <div>{lowestPrice} SOL</div>
              </Col>

              {/* TODO: Transaction Volume still dummy data */}
              <Col>
                <div className={GreyColor}>volume</div>
                <div>52k SOL</div>
              </Col>

              <Col>
                <div className={GreyColor}>listed</div>
                <div>{list.length} items</div>
              </Col>
            </Row>
          </Col>

          <Col className={uTextAlignEnd} span={16}>
            <div className={GreyColor}>sort by</div>

            <Dropdown
              className={DropdownStyle}
              overlay={SortByOption}
              overlayClassName={OverlayStyle}
              trigger={['click']}
              placement="bottomRight"
            >
              <div>
                {sortByText} <FeatherIcon icon="chevron-down" />
              </div>
            </Dropdown>
          </Col>
        </Row>

        <Divider style={{ margin: '36px 0 56px 0' }} />

        <Row gutter={[36, 36]}>
          {list.map((m, idx) => {
            const defaultOwnerData = {
              wallet_address: m.owner,
              img_profile: null,
            };

            return (
              <Col
                key={idx}
                span={24}
                xxl={8}
                xl={8}
                lg={8}
                md={12}
                sm={24}
                xs={24}
              >
                <Link to={`/auction/${m.id}`}>
                  <AuctionRenderCard
                    auctionView={m}
                    owner={data[m.owner] || defaultOwnerData}
                  />
                </Link>
              </Col>
            );
          })}
        </Row>
      </Col>
    </Row>
  );
};

export default MarketComponent;
