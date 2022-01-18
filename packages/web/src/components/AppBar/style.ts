import { css } from '@emotion/css';

export const LogoWrapper = css`
  display: flex;
  align-items: center;
`;

export const Title = css`
  font-size: 26px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: 0.24em;
  -webkit-text-stroke: 0.75px #fafafb;
  margin: 20px;
  color: #fafafb;
`;

export const MobileTitle = css`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.24em;
  -webkit-text-stroke: 0.75px #fafafb;
  margin: 20px;
  color: #fafafb;
`;

export const ButtonContainer = css`
  text-align: end;
  align-self: center;
  display: flex;
  align-items: center;
`;

export const LandingButtonContainer = css`
  text-align: end;
  align-self: center;
`;

export const LinkButton = css`
  font-weight: bold;
  font-size: 14px;
`;

export const RoundButton = css`
  height: 42px;
  padding: 0 24px;
  border-radius: 28px;
  border: 2px solid #444444;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 700;
  margin-left: 12px;
`;

export const RoundGreenButton = css`
  height: 42px;
  padding: 0 24px;
  border-radius: 28px;
  border: 2px solid;
  border-image-source: linear-gradient(
    225deg,
    #ccff00 0%,
    #00ffa3 65.1%,
    #00ffa3 100%
  );
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 700;
  margin-left: 12px;
`;

export const ActivityBadge = css`
  sup {
    width: 10px;
    min-width: 10px;
    height: 10px;
    top: 20px;
    right: 10px;
  }
`;

export const ButtonStyle = css`
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;
  padding-left: unset;
  margin-right: 16px;

  color: #fafafb;

  span {
    margin-right: 4px;
  }

  :hover,
  :active,
  :focus {
    background: linear-gradient(
      125deg,
      #1cefff 0%,
      #ccff00 65.1%,
      #1cefff 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const ButtonStyleFAQ = css`
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;
  padding-left: unset;

  color: #fafafb;

  span {
    margin-right: 4px;
  }

  :hover,
  :active,
  :focus {
    color: #7e7e7c;
  }
`;
