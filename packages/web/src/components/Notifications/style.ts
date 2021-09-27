import { css } from '@emotion/css';

export const CircleButton = ({ active }) => css`
  height: 42px;
  width: 42px;
  border-radius: 24px;
  border: ${active ? '2px solid #FF2D55' : '2px solid #444444'};
  margin-left: 12px;
  padding-top: 9px;
  vertical-align: -4px;

  :active,
  :focus {
    border: ${active ? '2px solid #FF2D55' : '2px solid #444444'};
    color: #fafafb;
  }
`;

export const NotificationPopover = css`
  .ant-popover-inner {
    border: 2px solid #ccff00;
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

export const BadgeStyle = css`
  .ant-badge-dot {
    background: #ff2d55;
    width: 16px;
    height: 16px;
    border: 2.66667px solid #000000;
    box-shadow: unset;

    top: 6px;
    right: 6px;
  }
`;

export const EmptyNotification = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: #7e7c7c;
  height: 100%;
`;
