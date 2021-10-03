import { css } from '@emotion/css';

export const HomeStyle = css`
  overflow-y: hidden;
  overflow-x: hidden;
  margin-top: 88px;
`;

export const Title = css`
  font-size: 64px;
  font-weight: 700;
  line-height: 80px;
  margin-bottom: 16px;
`;

export const Description = css`
  font-size: 36px;
  font-weight: 400;
  line-height: 45px;
  color: #cccccc;
  margin-bottom: 46px;
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
  color: #ccff00;
`;

export const Label = css`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  color: #7e7c7c;
`;

export const NumberStyle = css`
  font-size: 48px;
  font-weight: bold;
  color: #fafafb;
`;

export const CreateStatistic = css`
  text-align: left;
  font-weight: bold;

  .ant-statistic-title {
    font-size: 24px;
    color: #ccff00;
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

export const Availability = css`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  color: #7e7c7c;
`;
