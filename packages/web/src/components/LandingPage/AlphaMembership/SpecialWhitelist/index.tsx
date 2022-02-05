import { Button, Col, Divider, Row } from "antd";
import React, { useState } from "react";
import { DiscordURL } from "../../../../constants";
import { DividerStyle, ExtraValue, GradientText, Label, ButtonStyle, TitleSectionStyle, TitleStyle, Value, WhitelistName, SecondaryButtonStyle, DividerNoPaddingStyle, MobileTitleSectionStyle, MobileTitleStyle, MobileWhitelistName, MobileSecondaryButtonStyle, MobileLabel, MobileValue, MobileExtraValue, MobileButtonStyle } from "./style";

const whitelists = [
  {
    key: "thugbirdz",
    name: "thugbirdz",
    img: "thugbirdz.png"
  },
  {
    key: "eternal_monks",
    name: "eternal monks",
    img: "eternal_monks.png"
  },
  {
    key: "ordinary",
    name: "ordinary",
    img: "ordinary.png"
  },
  {
    key: "boogle",
    name: "boogle",
    img: "boogle.png"
  },
  {
    key: "solana_monkey_business",
    name: "solana monkey business",
    img: "solana_monkey_business.png"
  },
  {
    key: "boryoku_dragonz",
    name: "boryoku dragonz",
    img: "boryoku_dragonz.png"
  },
  {
    key: "urs",
    name: "URS – collab artists",
    img: "urs.png"
  },
  {
    key: "mindfolk",
    name: "mindfolk",
    img: "mindfolk.png"
  },
  {
    key: "taiyo_robotics",
    name: "taiyo robotics",
    img: "taiyo_robotics.png"
  },
  {
    key: "monkey_kingdom",
    name: "monkey kingdom",
    img: "monkey_kingdom.png"
  },
  {
    key: "daa",
    name: "DAA",
    img: "daa.png"
  },
  {
    key: "chillchat",
    name: "chillchat",
    img: "chillchat.png"
  },
  {
    key: "skeleton_crew",
    name: "skeleton crew",
    img: "skeleton_crew.png"
  },
  {
    key: "ssc",
    name: "SSC – GenesysGo",
    img: "ssc.png"
  },
  {
    key: "degods",
    name: "Degods",
    img: "degods.png"
  },
  {
    key: "aurory",
    name: "aurory",
    img: "aurory.png"
  },
  {
    key: "rogue_shark",
    name: "rogue shark",
    img: "rogue_shark.png"
  },
  {
    key: "dazed_duck",
    name: "dazed duck",
    img: "dazed_duck.png"
  },
  {
    key: "quantum_traders",
    name: "Quantum Traders",
    img: "quantum_traders.png"
  },
  {
    key: "catalina_whale",
    name: "Catalina Whale",
    img: "catalina_whale.png"
  },
  {
    key: "stoned_ape_crew",
    name: "Stoned Ape Crew",
    img: "stoned_ape_crew.png"
  },
  {
    key: "galactic_geckos",
    name: "Galactic Geckos",
    img: "galactic_geckos.png"
  },
  {
    key: "zillaz",
    name: "Zillaz NFT",
    img: "zillaz.png"
  },
  {
    key: "pesky_penguin_club",
    name: "Pesky Penguin Club",
    img: "pesky_penguin_club.png"
  },
  {
    key: "baby_ape_social_club",
    name: "Baby Ape Social Club",
    img: "baby_ape_social_club.png"
  },
  {
    key: "space_runners",
    name: "Space Runners",
    img: "space_runners.png"
  },
  {
    key: "meerkat_millionaires",
    name: "Meerkat Millionaires",
    img: "meerkat_millionaires.png"
  },
  {
    key: "famous_fox_federation",
    name: "Famous Fox Federation",
    img: "famous_fox_federation.png"
  },
  {
    key: "turtles",
    name: "turtles",
    img: "turtles.png"
  },
  {
    key: "meta_drago",
    name: "meta drago",
    img: "meta_drago.png"
  },
];

const SpecialWhitelist = ({ refMembership, refWhitelist }: { refMembership: React.MutableRefObject<HTMLInputElement>, refWhitelist: React.MutableRefObject<HTMLInputElement> }) => {
  const [expandWhitelist, setExpandWhitelist] = useState(false);

  return (
    <>
      <Row ref={refWhitelist} justify="center">
        <Col span={22}>
          <div className={TitleSectionStyle}>
            <span style={{ marginRight: 8 }}>Special Whitelist</span>
            <span className={GradientText}>//</span>
          </div>

          <div className={TitleStyle}>For Selected <br />Community</div>

          <Row gutter={[80, 43]} style={{ width: '100%', marginBottom: 48 }}>
            {whitelists.map((whitelist, index) => (expandWhitelist || index < (24 / 4 * 2)) ? (
              <Col key={whitelist.key} span={4}>
                <img src={`img/whitelist/${whitelist.img}`} alt={whitelist.name} />
                <div className={WhitelistName}>{whitelist.name}</div>
              </Col>
            ) : null)}
          </Row>
        </Col>
      </Row>

      <Row justify="end">
        <Col span={23}>
          <Divider className={DividerNoPaddingStyle} orientation="left">
            <Button
              type="link"
              className={SecondaryButtonStyle}
              style={{ paddingLeft: 0 }}
              onClick={() => {
                setExpandWhitelist(!expandWhitelist);

                if (expandWhitelist) {
                  refWhitelist.current.scrollIntoView()
                }
              }}
            >
              <u>{expandWhitelist ? 'Minimize Full Whitelist' : 'See All Whitelist'}</u>
            </Button>
          </Divider>
        </Col>
      </Row>

      <Row justify="center" style={{ marginBottom: 56, marginTop: 32 }}>
        <Col span={22}>
          <Row gutter={52}>
            <Col>
              <div className={Label}>supply</div>
              <div className={Value}>500</div>
              <div className={ExtraValue}>price ◎2</div>
            </Col>

            <Col>
              <div className={Label}>mint date</div>
              <div className={Value}>06 . 02 . 2022</div>
              <div className={ExtraValue}>02 PM UTC</div>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row justify="end">
        <Col span={23}>
          <Divider className={DividerStyle} orientation="left">
            <Button className={ButtonStyle} href={DiscordURL} target="_blanks" >
              <div>
                <span style={{ marginRight: 8 }}>Join Whitelist</span>
                <span className={GradientText}>//</span>
              </div>
            </Button>

            <Button type="link" className={SecondaryButtonStyle} onClick={() => refMembership.current.scrollIntoView({ behavior: 'smooth' })}>
              <u>See Benefits</u>
            </Button>
          </Divider>
        </Col>
      </Row>
    </>
  );
};

export const MobileSpecialWhitelist = ({ refMembership, refWhitelist }: { refMembership: React.MutableRefObject<HTMLInputElement>, refWhitelist: React.MutableRefObject<HTMLInputElement> }) => {
  const [expandWhitelist, setExpandWhitelist] = useState(false);

  return (
    <>
      <Row ref={refWhitelist} justify="center">
        <Col span={20}>
          <div className={MobileTitleSectionStyle}>
            <span style={{ marginRight: 8 }}>Special Whitelist</span>
            <span className={GradientText}>//</span>
          </div>

          <div className={MobileTitleStyle}>For Selected <br />Community</div>

          <Row gutter={[20, 24]} style={{ width: '100%', marginBottom: 16 }}>
            {whitelists.map((whitelist, index) => (expandWhitelist || index < (24 / 12 * 3)) ? (
              <Col key={whitelist.key} span={12}>
                <img src={`img/whitelist/${whitelist.img}`} alt={whitelist.name} width="100%" />
                <div className={MobileWhitelistName}>{whitelist.name}</div>
              </Col>
            ) : null)}
          </Row>
        </Col>
      </Row>

      <Row justify="end">
        <Col span={22}>
          <Divider className={DividerNoPaddingStyle} orientation="left">
            <Button
              type="link"
              className={MobileSecondaryButtonStyle}
              style={{ paddingLeft: 0 }}
              onClick={() => {
                setExpandWhitelist(!expandWhitelist);

                if (expandWhitelist) {
                  refWhitelist.current.scrollIntoView()
                }
              }}
            >
              <u>{expandWhitelist ? 'Minimize Full Whitelist' : 'See All Whitelist'}</u>
            </Button>
          </Divider>
        </Col>
      </Row>

      <Row justify="center" style={{ marginBottom: 28, marginTop: 8 }}>
        <Col span={20}>
          <Row gutter={52}>
            <Col>
              <div className={MobileLabel}>supply</div>
              <div className={MobileValue}>500</div>
              <div className={MobileExtraValue}>price ◎2</div>
            </Col>

            <Col>
              <div className={MobileLabel}>mint date</div>
              <div className={MobileValue}>TBA</div>
              <div className={MobileExtraValue}>02 PM UTC</div>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row justify="end">
        <Col span={22}>
          <Button className={MobileButtonStyle} href={DiscordURL} target="_blanks" >
            <div>
              <span style={{ marginRight: 8 }}>Join Whitelist</span>
              <span className={GradientText}>//</span>
            </div>
          </Button>

          <Button type="link" className={MobileSecondaryButtonStyle} onClick={() => refMembership.current.scrollIntoView({ behavior: 'smooth' })}>
            <u>See Benefits</u>
          </Button>
        </Col>
      </Row>
    </>
  );
};


export default SpecialWhitelist;
