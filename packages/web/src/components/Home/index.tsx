import React, { useEffect, useState } from 'react';
import { Carousel, Col, Image, Row } from 'antd';
import { CountdownState } from '@oyster/common/dist/lib';
import { useMeta } from '../../contexts';
import ActionButton from '../ActionButton';
import Discord from '../../assets/icons/discord';
import Twitter from '../../assets/icons/twitter';
import countDown from '../../helpers/countdown';
import { ButtonWrapper, CarouselStyle, Description, DiscordButton, HomeStyle, ImageStyle, SocialMediaButton, Title, TwitterButton } from './style';
import Numbers from './numbers';
import isEnded from './helpers/isEnded';
import { TwitterURL } from '../../constants';

const Home = () => {
  const [state, setState] = useState<CountdownState>();
  const { endingTime, dataCollection } = useMeta();

  useEffect(() => {
    const calc = () => setState(countDown(endingTime));
    const interval = setInterval(() => calc(), 1000);
    calc();

    return () => clearInterval(interval);
  }, [endingTime]);

  return (
    <Row className={HomeStyle}>
      <Col span={12} md={12} xs={24}>
        <div style={{ textAlign: 'center' }}>
          <Carousel className={CarouselStyle} autoplay effect="fade" autoplaySpeed={1000}>
            {dataCollection.images.map((img, idx) => (
              <div key={idx}>
                <Image src={img} className={ImageStyle} />
              </div>
            ))}
          </Carousel>
        </div>
      </Col>

      <Col span={12} md={12} xs={24}>
        <div className={Title}>{dataCollection.name}</div>
        <Row>
          <Col className={Description} span={16}>{dataCollection.description}</Col>
        </Row>

        <Numbers state={state} />

        <div className={ButtonWrapper}>
          {!isEnded(state) && <ActionButton to="auction" size="large">view auction</ActionButton>}
          {isEnded(state) && (
            <a href={TwitterURL}>
              <ActionButton size="large">notify me</ActionButton>
            </a>
          )}

          <div className={SocialMediaButton}>
            <a href="https://discord.gg/HRKp4q4Zxy" target="_blank">
              <div className={DiscordButton}>
                <Discord />
              </div>
            </a>

            <a href={TwitterURL}>
              <div className={TwitterButton}>
                <Twitter />
              </div>
            </a>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Home;
