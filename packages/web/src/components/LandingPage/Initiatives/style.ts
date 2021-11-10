import { css } from '@emotion/css';

export const BackgroundImage = css`
  position: absolute;
  right: 0;
`;

export const Title = css`
  font-weight: bold;
  font-size: 56px;
  line-height: 70px;

  color: #fafafb;
  margin-bottom: 36px;
`;

export const MobileTitle = css`
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;

  color: #fafafb;
  margin-bottom: 24px;

  max-width: 60%;
`;

export const Description = css`
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;
  width: 60%;

  color: #7e7c7c;
  margin-bottom: 72px;
`;

export const MobileDescription = css`
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  width: 90%;

  color: #7e7c7c;
  margin-bottom: 48px;
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

export const ButtonList = css`
  border: 2px solid #444444;
  cursor: unset;
  text-transform: uppercase;
  font-weight: bold;
  height: 47px !important;
  padding: 0 18px;

  font-weight: bold;
  font-size: 18px !important;

  color: #fafafb;

  :hover,
  :active,
  :focus {
    border: 2px solid #444444;
    cursor: unset;
    color: #fafafb;
  }
`;

export const MobileButtonList = css`
  border: 2px solid #444444;
  cursor: unset;
  text-transform: uppercase;
  font-weight: bold;
  height: 39px !important;
  padding: 0 18px;

  font-weight: bold;
  font-size: 12px !important;
  line-height: 15px;

  color: #fafafb;

  :hover,
  :active,
  :focus {
    border: 2px solid #444444;
    cursor: unset;
    color: #fafafb;
  }
`;

export const GradientText = css`
  background: linear-gradient(125deg, #1cefff 0%, #ccff00 65.1%, #1cefff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
`;
