import { css } from '@emotion/css';

export const FeatureBox = isLastFeature => css`
  margin-right: 28px;
  margin-bottom: 28px;

  width: 233px;
  height: 242px;
  border-radius: 12px;

  padding: 1px;

  font-weight: bold;
  font-size: 32px;
  line-height: 40px;

  color: #fafafb;

  border: 1px solid ${isLastFeature ? '#7E7C7C' : 'transparent'};
  background-image: ${isLastFeature
    ? 'unset'
    : 'linear-gradient(#000, #000), linear-gradient(225deg, #CCFF00 0%, #00FFA3 65.1%, #00FFA3 100%)'};
  background-origin: border-box;
  background-clip: content-box, border-box;

  > div {
    padding: 36px 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
`;

export const MobileFeatureBox = isLastFeature => css`
  width: 124px;
  height: 128px;
  border-radius: 12px;

  padding: 1px !important;

  font-weight: bold;
  font-size: 16px;
  line-height: 20px;

  color: #fafafb;
  margin-right: 16px;

  border: 1px solid ${isLastFeature ? '#7E7C7C' : 'transparent'};
  background-image: ${isLastFeature
    ? 'unset'
    : 'linear-gradient(#000, #000), linear-gradient(225deg, #CCFF00 0%, #00FFA3 65.1%, #00FFA3 100%)'};
  background-origin: border-box;
  background-clip: content-box, border-box;

  > div {
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
`;

export const WhiteFont24 = css`
  font-weight: 600;
  font-size: 24px;
  line-height: 30px;

  color: #fafafb;
`;

export const WhiteFont14 = css`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #fafafb;
`;

export const PoweredImagesContainer = css`
  margin: 24px 0;

  > img + img {
    margin-left: 42px;
  }
`;

export const MobilePoweredImagesContainer = css`
  margin: 24px 0;

  > img + img {
    margin-left: 20px;
  }
`;

export const PoweredDescription = css`
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;
  max-width: 55%;
  margin-bottom: 76px;

  color: #7e7c7c;
`;

export const MobilePoweredDescription = css`
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  max-width: 268px;

  color: #7e7c7c;

  margin-bottom: 32px;
`;
