import React from 'react';
import {Carousel, Col, Image, Row, Button, Skeleton } from 'antd';

import { AuctionView, useArt } from '../../hooks';
import { ArtContent } from '../ArtContent';
import { AuctionCard } from '../AuctionCard';
import { Link } from 'react-router-dom';
import { useMeta } from '../../contexts';
import ActionButton from '../ActionButton';
import Discord from '../../assets/icons/discord';
import Twitter from '../../assets/icons/twitter';
import { ButtonWrapper, Description, DiscordButton, ImageStyle, SocialMediaButton, Title, TwitterButton } from './style';
import { AuctionNumbers } from '../AuctionNumbers';

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

export const PreSaleBanner = () => {
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
        {/* TODO-Iyai: Update this to be dynamic text */}
        <div className={Title}>CRYSTAL GODS</div>
        <Row>
          <Col className={Description} span={16}>limited collection 111 of crystal gods</Col>
        </Row>

        <AuctionNumbers />

        <div className={ButtonWrapper}>
          {/* TODO-Iyai: Update to live auction url */}
          <ActionButton to={`/auction`} size="large">view auction</ActionButton>

          <div className={SocialMediaButton}>
            <div className={DiscordButton}>
              <Discord />
            </div>

            <a href="https://twitter.com/intent/user?original_referer=http%3A%2F%2Fsupadrop.com%2F&ref_src=twsrc%5Etfw&region=count_link&screen_name=supadropnft&tw_p=followbutton">
              <div className={TwitterButton}>
                <Twitter />
              </div>
            </a>
          </div>
        </div>
      </Col>
    </Row>
  );

// interface IPreSaleBanner {
//   auction?: AuctionView;
// }

// export const PreSaleBanner = ({ auction }: IPreSaleBanner) => {
//   const { isLoading } = useMeta();
//   const id = auction?.thumbnail.metadata.pubkey;
//   const art = useArt();
//
//   if (isLoading) {
//     return <Skeleton />;
//   }
//
//   return (
//     <Row className="presale">
//       <Col md={12} className="explore">
//         <ArtContent
//           pubkey={id}
//           className="artwork-image"
//           allowMeshRender={true}
//         />
//       </Col>
//       <Col md={12} className="presale-info">
//         <h2 className="art-title">{art.title}</h2>
//         {auction && (
//           <AuctionCard
//             auctionView={auction}
//             style={{
//               background: 'transparent',
//               width: '100%',
//               padding: 0,
//               margin: 0,
//             }}
//             hideDefaultAction={true}
//             action={
//               <>
//                 <Link to={`/auction/${auction.auction.pubkey}`}>
//                   <Button
//                     type="primary"
//                     size="large"
//                     className="action-btn"
//                     style={{ maxWidth: 290 }}
//                   >
//                     Go to auction
//                   </Button>
//                 </Link>
//               </>
//             }
//           />
//         )}
//       </Col>
//     </Row>
//   );
};
