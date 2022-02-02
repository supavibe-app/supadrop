import { css } from '@emotion/css';

export const TitleSectionStyle = css`
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 30px;

  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 17px;
`;

export const MobileTitleSectionStyle = css`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;

  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 11px;
`;

export const TitleStyle = css`
  font-style: normal;
  font-weight: bold;
  font-size: 48px;
  line-height: 60px;

  color: #fafafb;
  text-transform: uppercase;
  width: 60%;
  margin-bottom: 28px;
`;

export const MobileTitleStyle = css`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 35px;

  color: #fafafb;
  text-transform: uppercase;
  width: 60%;
  margin-bottom: 11px;
`;

export const GradientText = css`
  background: linear-gradient(125deg, #1cefff 0%, #ccff00 65.1%, #1cefff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
`;

export const DescriptionStyle = css`
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;

  color: #7e7c7c;
  margin-bottom: 62px;
`;

export const MobileDescriptionStyle = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  color: #7e7c7c;
  margin-bottom: 27px;
`;

export const ListStyle = css`
  border-top: 1px solid #7e7c7c;
  border-bottom: 1px solid #7e7c7c;
  margin-bottom: 48px;

  .ant-list-item {
    align-items: flex-start;
    padding: 28px 0;
    border-bottom: 1px solid #7e7c7c;
  }
`;

export const BenefitTitle = css`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 25px;
  display: flex;
  align-items: center;
  letter-spacing: 0.05em;

  color: #f6f8fa;
  text-transform: uppercase;
`;

export const MobileBenefitTitle = css`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  letter-spacing: 0.05em;

  color: #f6f8fa;
  text-transform: uppercase;

  margin-bottom: 7px;
`;

export const BenefitDescription = css`
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 25px;
  display: flex;
  align-items: center;
  letter-spacing: 0.05em;

  color: #a7a8aa;
`;

export const MobileBenefitDescription = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  letter-spacing: 0.05em;

  color: #a7a8aa;
`;

export const VideoContainer = css`
  border-radius: 12px;

  border: 1px solid transparent;
  background-image: linear-gradient(#000, #000),
    linear-gradient(225deg, #ccff00 0%, #00ffa3 65.1%, #00ffa3 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;

  position: sticky;
  top: 64px;
`;
