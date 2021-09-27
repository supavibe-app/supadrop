import React, { useEffect, useState } from 'react';
import { Carousel, Col, Image, Row } from 'antd';
import { CountdownState } from '@oyster/common/dist/lib';
import moment from 'moment';

import ActionButton from '../ActionButton';
import Discord from '../../assets/icons/discord';
import Twitter from '../../assets/icons/twitter';
import { ButtonWrapper, Description, DiscordButton, ImageStyle, SocialMediaButton, Title, TwitterButton } from './style';
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
  const now = moment().unix();
  // TODO-Iyai: get endAt from DB
  const endAt = 1632763291;

  const countDown = () => {
    const ended = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    let delta = endAt - now;
    if (!endAt || delta <= 0)
      return ended;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = Math.floor(delta % 60);
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const calc = () => setState(countDown());

    const interval = setInterval(() => calc(), 1000);
    calc();

    return () => clearInterval(interval);
  });

  return (
    <Row style={{ marginTop: 88 }}>
      <Col span={12} md={12}>
        <div style={{ textAlign: 'center' }}>
          <Carousel autoplay effect="fade">
            {images.map((img, idx) => (
              <div key={idx}>
                <Image src={img} className={ImageStyle} height={512} />
              </div>
            ))}
          </Carousel>
        </div>
      </Col>

      <Col span={12} md={12}>
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
