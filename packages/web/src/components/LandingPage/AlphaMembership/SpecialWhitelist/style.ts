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
  margin-bottom: 48px;
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

export const DividerStyle = css`
  ::before {
    content: unset !important;
  }

  .ant-divider-inner-text {
    padding-left: 0;
  }

  ::after {
    border-image: -webkit-gradient(
        linear,
        left top,
        left bottom,
        from(#ccff00),
        to(#00ffa3),
        color-stop(0.5, #00ffa3),
        color-stop(0.5, #ccff00)
      )
      21 30 30 21 repeat repeat;
  }
`;

export const DividerNoPaddingStyle = css`
  ::before {
    content: unset !important;
  }

  .ant-divider-inner-text {
    padding-left: 0;
  }
`;

export const ButtonStyle = css`
  border-radius: 4px;
  border: 1px solid transparent;
  background-image: linear-gradient(#000, #000),
    linear-gradient(225deg, #ccff00 0%, #00ffa3 65.1%, #00ffa3 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  text-transform: uppercase;
  margin-right: 16px;

  padding: 1px;
  height: 71px;
  font-weight: bold;
  font-size: 18px;

  div {
    padding: 18px 32px;
  }

  :hover {
    border: 1px solid #fafafb;
    color: #fafafb;
  }
`;

export const MobileButtonStyle = css`
  border-radius: 4px;
  border: 1px solid transparent;
  background-image: linear-gradient(#000, #000),
    linear-gradient(225deg, #ccff00 0%, #00ffa3 65.1%, #00ffa3 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;

  padding: 1px;
  height: 47px;
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;

  margin-right: 36px;

  div {
    padding: 6px 24px;
  }

  :hover {
    border: 1px solid #fafafb;
    color: #fafafb;
  }
`;

export const SecondaryButtonStyle = css`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;

  text-decoration-line: underline;
  text-transform: uppercase;

  color: #fafafb;
`;

export const MobileSecondaryButtonStyle = css`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  text-decoration-line: underline;
  text-transform: uppercase;

  color: #fafafb;
`;

export const WhitelistName = css`
  font-style: normal;
  font-weight: normal;
  font-size: 20px;

  color: #a7a8aa; ;
`;

export const MobileWhitelistName = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;

  color: #a7a8aa; ;
`;

export const Label = css`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 25px;

  color: #fafafb;

  margin-bottom: 4px;
`;

export const MobileLabel = css`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;

  color: #fafafb;
  margin-bottom: 3px;
`;

export const Value = css`
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 45px;

  color: #fafafb;
  margin-bottom: 4px;
`;

export const MobileValue = css`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;

  color: #fafafb;
  margin-bottom: 3px;
`;

export const ExtraValue = css`
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 25px;

  color: #7e7c7c;
`;

export const MobileExtraValue = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  color: #7e7c7c;
`;
