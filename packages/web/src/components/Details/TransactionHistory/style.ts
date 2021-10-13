import { css } from '@emotion/css';

export const Activity = css`
  font-size: 14px;
  color: #fafafb;
  margin-bottom: 12px;
  align-items: center;

  .ant-avatar {
    margin-right: 4px;
  }

  div:last-child {
    text-align: end;
  }
`;

export const IsMyBid = css`
  position: absolute;
  height: 8px;
  width: 8px;
  background: #ccff00;
  left: 12px;
  border-radius: 4px;
  margin-top: 8px;
`;

export const ActivityHeader = css`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  color: #7e7c7c;
  margin-bottom: 16px;
  align-items: center;
`;
