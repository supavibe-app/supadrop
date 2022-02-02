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

export const LandingButtonContainer = css`
  text-align: end;
  align-self: center;
  display: flex;
  justify-content: flex-end;
`;

export const ButtonStyle = css`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;

  color: #7e7c7c;
  text-transform: uppercase;
`;

export const MobileAppBarStyle = css`
  position: sticky;
  top: 0;
  z-index: 999;
  background: #0a0a0c;
`;

export const ButtonListStyle = css`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  border-bottom: 1px solid #2b2b2b;
  padding: 24px 0;

  color: #fafafb;
  text-transform: uppercase;
`;

export const PopoverStyle = css`
  width: 80%;

  .ant-popover-inner {
    border: 2px solid #ccff00;
    border-radius: 4px;
    background: #000000;
  }

  .ant-popover-title {
    padding: 16px 20px 8px 20px;
    border: unset;
  }

  .ant-popover-inner-content {
    overflow-y: auto;
    padding: 4px 0 4px 20px;
  }

  .ant-popover-content {
    margin-top: 24px;
  }
`;
