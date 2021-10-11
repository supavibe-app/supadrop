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
    background: #000000;
  }

  .ant-popover-title {
    padding: 16px 20px 8px 20px;
    border: unset;
  }

  .ant-popover-inner-content {
    height: 318px;
    width: 378px;
    overflow-y: auto;

    padding: 0 0 16px 20px;
  }
`;

export const ListStyle = css`
  padding: 8px 0 !important;

  .ant-btn-link {
    font-size: 16px;
    padding-right: 20px;
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
  padding-right: 20px;

  color: #7e7c7c;
  height: 100%;

  > div {
    margin: 12px 0;
  }
`;
