import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { Carousel, Col, Image, Row, Button } from 'antd';
import { CountdownState } from '@oyster/common/dist/lib';
import { useMeta } from '../../../contexts';
import Discord from '../../../assets/icons/discord';
import Twitter from '../../../assets/icons/twitter';
import countDown from '../../../helpers/countdown';
import { AssetBorder, ButtonWrapper, CarouselStyle, Description, DiscordButton, GradientGreenText, ImageStyle, MobileDescription, MobileSocialMediaButton, MobileStoryStyle, MobileTitle, SocialMediaButton, StoryStyle, Title, TwitterButton } from './style';
import Numbers, { MobileNumbers } from './numbers';
import { CrystalPunkTwitterURL, DiscordURL, TwitterURL } from '../../../constants';
import { ButtonStyle, GradientText, MobileButtonStyle } from '../Header/style';

const NFTDrop = () => {
  const [state, setState] = useState<CountdownState>();
  const { endingTime, dataCollection } = useMeta();


  useEffect(() => {
    const calc = () => setState(countDown(endingTime ? endingTime : dataCollection.start_publish));
    const interval = setInterval(() => calc(), 1000);
    calc();

    return () => clearInterval(interval);
  }, [endingTime, dataCollection]);

  return (
    <Row justify="end">
      <Col span={11}>
        <div className={Title}>{dataCollection.name}</div>

        <Row>
          <Col className={Description} span={16}>{dataCollection.description}</Col>
        </Row>

        <div className={StoryStyle}>
          <span className={GradientGreenText}>Help us fund our project</span>
          <span> – the fund will be used to help us build the platform, hire the best people, build the network of talented artists, creators, collectors and help us grow the community.</span>
        </div>

        <Numbers state={state} />

        <div className={ButtonWrapper}>
          {endingTime > 0 && (
            <Button className={ButtonStyle} onClick={() => {
              ReactGA.event({
                category: 'View Auction Button Selected',
                action: 'viewAuctionButton',
              });
            }}>
              <div>
                <span style={{ marginRight: 8 }}>VIEW AUCTION</span>
                <span className={GradientText}>//</span>
              </div>
            </Button>
          )}

          {endingTime === 0 && (
            <Button className={ButtonStyle} href={CrystalPunkTwitterURL} onClick={() => {
              ReactGA.event({
                category: 'Notify Auction Button Selected',
                action: 'notifyButton',
              });
            }}>
              <div>
                <span style={{ marginRight: 8 }}>NOTIFY ME</span>
                <span className={GradientText}>//</span>
              </div>
            </Button>
          )}

          <div className={SocialMediaButton}>
            <a href="https://discord.gg/HRKp4q4Zxy" target="_blank" onClick={() => {
              ReactGA.event({
                category: 'Discord Button Selected',
                action: 'discordButton',
                label: 'crystalpunk'
              });
            }}>
              <div className={DiscordButton}>
                <Discord />
              </div>
            </a>

            <a href={CrystalPunkTwitterURL} target="_blank" onClick={() => {
              ReactGA.event({
                category: 'Twitter Button Selected',
                action: 'twitterButton',
                label: 'crystalpunk'
              });
            }}>
              <div className={TwitterButton}>
                <Twitter />
              </div>
            </a>
          </div>
        </div>
      </Col>

      <Col span={2} />

      <Col className={AssetBorder} span={10}>
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
    </Row>
  );
};

export const MobileNFTDrop = () => {
  const [state, setState] = useState<CountdownState>();
  const { endingTime, dataCollection } = useMeta();

  useEffect(() => {
    const calc = () => setState(countDown(endingTime ? endingTime : dataCollection.start_publish));
    const interval = setInterval(() => calc(), 1000);
    calc();

    return () => clearInterval(interval);
  }, [endingTime]);

  return (
    <>
      <Row justify="end" style={{ marginBottom: 42 }}>
        <Col className={AssetBorder} span={22}>
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
      </Row>

      <Row justify="center">
        <Col span={20}>
          <div className={MobileTitle}>{dataCollection.name}</div>

          <Row>
            <Col className={MobileDescription} span={16}>{dataCollection.description}</Col>
          </Row>

          <div className={MobileStoryStyle}>
            <span className={GradientGreenText}>Help us fund our project</span>
            <span> – the fund will be used to help us build the platform, hire the best people, build the network of talented artists, creators, collectors and help us grow the community.</span>
          </div>

          <MobileNumbers state={state} />

          <div className={ButtonWrapper}>
            {endingTime > 0 && (
              <Button className={MobileButtonStyle} onClick={() => {
                ReactGA.event({
                  category: 'View Auction Button Selected',
                  action: 'viewAuctionButton',
                });
              }}>
                <div>
                  <span style={{ marginRight: 8 }}>VIEW AUCTION</span>
                  <span className={GradientText}>//</span>
                </div>
              </Button>
            )}

            {endingTime === 0 && (
              <Button className={MobileButtonStyle} href={CrystalPunkTwitterURL} onClick={() => {
                ReactGA.event({
                  category: 'Notify Auction Button Selected',
                  action: 'notifyButton',
                });
              }}>
                <div>
                  <span style={{ marginRight: 8 }}>NOTIFY ME</span>
                  <span className={GradientText}>//</span>
                </div>
              </Button>
            )}

            <div className={MobileSocialMediaButton}>
              <a href={DiscordURL} target="_blank" onClick={() => {
                ReactGA.event({
                  category: 'Discord Button Selected',
                  action: 'discordButton',
                  label: 'crystalpunk'
                });
              }}>
                <div className={DiscordButton}>
                  <img src="img/logo/discord.svg" width="24" />
                </div>
              </a>

              <a href={TwitterURL} target="_blank" onClick={() => {
                ReactGA.event({
                  category: 'Twitter Button Selected',
                  action: 'twitterButton',
                  label: 'crystalpunk'
                });
              }}>
                <div className={TwitterButton}>
                  <img src="img/logo/twitter.svg" width="24" />
                </div>
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default NFTDrop;
