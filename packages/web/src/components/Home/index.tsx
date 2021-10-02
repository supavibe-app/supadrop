import React, { useEffect, useState } from 'react';
import { Carousel, Col, Image, Row } from 'antd';
import { CountdownState } from '@oyster/common/dist/lib';

import ActionButton from '../ActionButton';
import Discord from '../../assets/icons/discord';
import Twitter from '../../assets/icons/twitter';
import countDown from '../../helpers/countdown';
import { ButtonWrapper, CarouselStyle, Description, DiscordButton, HomeStyle, ImageStyle, SocialMediaButton, Title, TwitterButton } from './style';
import Numbers from './numbers';
import isEnded from './helpers/isEnded';

const TwitterURL = 'https://twitter.com/intent/user?original_referer=http%3A%2F%2Fsupadrop.com%2F&ref_src=twsrc%5Etfw&region=count_link&screen_name=supadropnft&tw_p=followbutton';

// TODO-Iyai: Get images from backend
const images = [
  'https://cdn.discordapp.com/attachments/459348449415004161/888271413381832734/0x26fd3e176c260e7fef019966622419dabfebb299_20.webp',
  'https://cdn.discordapp.com/attachments/459348449415004161/888271475033915432/0x26fd3e176c260e7fef019966622419dabfebb299_17.png',
  'https://cdn.discordapp.com/attachments/459348449415004161/888271489881743360/0x26fd3e176c260e7fef019966622419dabfebb299_38.png',
  'https://cdn.discordapp.com/attachments/459348449415004161/888271492230565968/0x26fd3e176c260e7fef019966622419dabfebb299_49.png',
  'https://cdn.discordapp.com/attachments/459348449415004161/888271493606305802/0x26fd3e176c260e7fef019966622419dabfebb299_89.png',
  'https://cdn.discordapp.com/attachments/459348449415004161/888271495485349938/0x26fd3e176c260e7fef019966622419dabfebb299_10.png',
  'https://cdn.discordapp.com/attachments/459348449415004161/888271505853665330/0x26fd3e176c260e7fef019966622419dabfebb299_12.png',
];

const Home = () => {
  const [state, setState] = useState<CountdownState>();
  // TODO-Iyai: get endAt from DB
  const endAt = 1632763291;

  useEffect(() => {
    const calc = () => setState(countDown(endAt));

    const interval = setInterval(() => calc(), 1000);
    calc();

    return () => clearInterval(interval);
  }, []);

  return (
    <Row className={HomeStyle}>
      <Col span={12} md={12} xs={24}>
        <div style={{ textAlign: 'center' }}>
          <Carousel className={CarouselStyle} autoplay effect="fade">
            {images.map((img, idx) => (
              <div key={idx}>
                <Image src={img} className={ImageStyle} />
              </div>
            ))}
          </Carousel>
        </div>
      </Col>

      <Col span={12} md={12} xs={24}>
        <div className={Title}>CRYSTAL GODS</div>
        <Row>
          <Col className={Description} span={16}>limited collection 111 of crystal gods</Col>
        </Row>

        <Numbers state={state} />

        <div className={ButtonWrapper}>
          {isEnded(state) && <ActionButton to="auction" size="large">view auction</ActionButton>}
          {!isEnded(state) && (
            <a href={TwitterURL}>
              <ActionButton size="large">notify me</ActionButton>
            </a>
          )}

          <div className={SocialMediaButton}>
            <a href="https://discord.gg/YEk83tSw" target="_blank">
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
