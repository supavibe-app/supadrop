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
  -webkit-text-stroke: 0.75px #ffffff;
  margin: 20px;
  color: white;
`;

export const ButtonContainer = css`
  display: -webkit-box;
`;

export const CircleButton = css`
  height: 42px;
  width: 42px;
  border-radius: 24px;
  border: 2px solid #444444;
  margin-left: 12px;
  padding-top: 9px;
  vertical-align: -4px;
`;

export const LinkButton = css`
  font-weight: bold;
  color: #fafafb;
  font-size: 14px;
  margin: 0 18px;
`;

export const RoundButton = css`
  height: 42px;
  padding: 0 24px;
  border-radius: 28px;
  border: 2px solid #444444;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 700;
`;

export const NotificationPopover = css`
  .ant-popover-inner {
    border: 1px solid yellow;
    border-radius: 4px;
    padding: 16px 20px;
    background: #000000;
  }

  .ant-popover-title {
    border: unset;
    padding: 0;
  }

  .ant-popover-inner-content {
    width: 378px;
    height: 318px;
    padding: 0;
  }
`;
