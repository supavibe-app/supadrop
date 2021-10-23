import React from 'react';
import { Col, Divider, Row, Select } from 'antd';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { useMeta } from '@oyster/common';
import { AuctionRenderCard2 } from '../../components/AuctionRenderCard';
import { CreatorName, DetailsInformation, DropdownStyle, OptionStyle, SelectStyle } from './style';
import { GreyColor, uTextAlignEnd } from '../../styles';
import moment from 'moment';

const { Option } = Select;

const MarketComponent = () => {
  const { liveDataAuctions } = useMeta();
  const now = moment().unix();

  const list = Object.entries(liveDataAuctions).filter(([key, data]) => data.isInstantSale && data.endAt > now);

  return (
    <Row justify="center">
      <Col style={{ margin: '24px 0 48px 0' }} span={20} xs={20} sm={20} md={20} lg={20} xl={18} xxl={16}>
        <div className={CreatorName}>
          <span>CRYSTAL PUNKS </span>
          <FeatherIcon icon="check-circle" />
        </div>

        <Row className={DetailsInformation} justify="space-between">
          <Col span={8}>
            <Row justify="space-between">
              <Col>
                <div className={GreyColor}>floor price</div>
                <div>72 SOL</div>
              </Col>

              <Col>
                <div className={GreyColor}>volume</div>
                <div>52k SOL</div>
              </Col>

              <Col>
                <div className={GreyColor}>listed</div>
                <div>64 items</div>
              </Col>
            </Row>
          </Col>

          <Col className={uTextAlignEnd} span={16}>
            <div className={GreyColor}>sort by</div>

            <Select className={SelectStyle} dropdownClassName={DropdownStyle} defaultValue="1" onChange={() => console.log('handle change')} suffixIcon={() => <FeatherIcon icon="chevron-down" />}>
              <Option value="1">lowest price</Option>
              <Option value="2">highest price</Option>
            </Select>
          </Col>
        </Row>

        <Divider style={{ margin: '36px 0 56px 0' }} />

        <Row gutter={[36, 36]}>
          {list.map(([_, m], idx) => {
            return (
              <Col key={idx} span={24} xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
                <Link to={`/auction/${m.id}`}>
                  <AuctionRenderCard2 auctionView={m} />
                </Link>
              </Col>
            );
          })}
        </Row>
      </Col>
    </Row>
  )
};

export default MarketComponent;
