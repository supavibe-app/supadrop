import React from 'react';
import { Col, Row, Skeleton } from 'antd';
import { ContentSection, Label } from './style';

const ArtDetailSkeleton = () => (
  <div>
    <div className={ContentSection}>
      <Skeleton paragraph={{ rows: 2 }} />
    </div>
    <Row>
      <Col span={12}>
        <div className={ContentSection}>
          <div className={Label}>creator</div>
          <Skeleton avatar paragraph={{ rows: 0 }} />
        </div>
      </Col>

      <Col span={12}>
        <div className={ContentSection}>
          <div className={Label}>owner</div>
          <Skeleton avatar paragraph={{ rows: 0 }} />
        </div>
      </Col>
    </Row>

    <div className={Label}>attributes</div>

    <Row gutter={[12, 12]}>
      {[...Array(3)].map((i, idx) => (
        <Col key={idx}>
          <Skeleton.Button shape="round" />
        </Col>
      ))}
    </Row>
  </div>
);

export default ArtDetailSkeleton;
