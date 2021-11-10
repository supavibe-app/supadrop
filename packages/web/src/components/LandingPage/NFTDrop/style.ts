import { css } from '@emotion/css';

export const HomeStyle = css`
  overflow-y: hidden;
  overflow-x: hidden;
  margin-top: 88px;
`;

export const Title = css`
  font-weight: bold;
  font-size: 56px;
  line-height: 70px;
  color: #fafafb;
  margin-bottom: 24px;
`;

export const MobileTitle = css`
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  color: #fafafb;
  margin-bottom: 20px;
`;

export const Description = css`
  font-weight: normal;
  font-size: 36px;
  line-height: 45px;
  color: #fafafb;
  margin-bottom: 32px;
`;

export const MobileDescription = css`
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  color: #fafafb;
  margin-bottom: 20px;
`;

export const StoryStyle = css`
  font-weight: normal;
  font-size: 20px;
  line-height: 25px;
  color: #7e7c7c;
  margin-bottom: 64px;
`;

export const MobileStoryStyle = css`
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: #7e7c7c;
  margin-bottom: 32px;

  max-width: 85%;
`;

export const ButtonWrapper = css`
  display: flex;
  align-items: center;
`;

export const SocialMediaButton = css`
  display: flex;
  margin-left: 36px;

  div {
    margin-left: 32px;
    cursor: pointer;
  }
`;

export const MobileSocialMediaButton = css`
  display: flex;
  margin-left: 20px;

  div {
    margin-left: 20px;
    cursor: pointer;
  }
`;

export const DiscordButton = css`
  :hover {
    path {
      fill: #5865f2;
    }
  }
`;

export const ImageStyle = css`
  max-height: 512px;
  max-width: 512px;
  object-fit: contain;
  filter: drop-shadow(2px 4px 16px rgba(255, 255, 255, 0.12));
  border-radius: 2px;
`;

export const CarouselStyle = css`
  .ant-image {
    padding-bottom: 48px;
  }
`;

export const TwitterButton = css`
  :hover {
    path {
      fill: #1da1f2;
    }
  }
`;

// auctionNumbers style
export const Timer = css`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  color: #fafafb;
`;

export const MobileTimer = css`
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #fafafb;
  margin-bottom: 8px;
`;

export const Label = css`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  color: #7e7c7c;
`;

export const MobileLabel = css`
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #7e7c7c;
`;

export const NumberStyle = css`
  font-size: 48px;
  font-weight: bold;
  color: #fafafb;
`;

export const MobileNumberStyle = css`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  color: #fafafb;
  margin-bottom: 8px;
`;

export const CreateStatistic = css`
  text-align: left;
  font-weight: bold;

  .ant-statistic-title {
    font-weight: bold;
    font-size: 24px;
    line-height: 30px;

    color: #fafafb;
    margin-bottom: unset;

    flex: none;
    order: 0;
    flex-grow: 0;
  }

  .ant-statistic-content {
    font-size: 40px;
    color: #fafafb;
    margin-bottom: 10px;
  }

  .ant-statistic-content-suffix {
    margin-left: 16px;
  }
`;

export const MobileCreateStatistic = css`
  text-align: left;
  font-weight: bold;

  .ant-statistic-title {
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;

    color: #fafafb;
    margin-bottom: unset;

    flex: none;
    order: 0;
    flex-grow: 0;
    margin-bottom: 8px;
  }

  .ant-statistic-content {
    font-weight: bold;
    font-size: 24px;
    line-height: 30px;
    color: #fafafb;
    margin-bottom: 8px;
  }

  .ant-statistic-content-suffix {
    margin-left: 16px;
  }
`;

export const Availability = css`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  color: #7e7c7c;
`;

export const MobileAvailability = css`
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #7e7c7c;
`;

export const GradientGreenText = css`
  background: linear-gradient(225deg, #ccff00 0%, #00ffa3 65.1%, #00ffa3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const AssetBorder = css`
  padding: 32px;
  border-bottom-left-radius: 12px;
  border-top-left-radius: 12px;

  background-image: linear-gradient(#000, #000),
    linear-gradient(225deg, #ccff00 0%, #00ffa3 65.1%, #00ffa3 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;

  padding: 1px 0 1px 1px;

  > div {
    padding: 32px;
  }
`;
