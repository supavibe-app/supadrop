import { css } from '@emotion/css';

export const PaddingBox = css`
  padding: 32px 28px;
`;

export const SmallPaddingBox = css`
  padding: 16px 28px 32px 28px;
`;

export const ArtDetailsHeader = css`
  display: flex;
  justify-content: space-between;
`;

export const StatusContainer = css`
  border-top: 1px solid #2b2b2b;
`;

export const BidStatus = css`
  display: flex;
  margin-bottom: 32px;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  color: #7e7c7c;

  .ant-avatar {
    margin-right: 16px;
  }
`;

export const BidStatusEmpty = css`
  display: flex;
  margin-bottom: 22px;
  font-weight: bold;
  font-size: 14px;
  color: #7e7c7c;
`;

export const CurrentBid = css`
  font-size: 18px;
`;

export const NormalFont = css`
  font-weight: normal;
  font-style: normal;
`;

export const ButtonWrapper = css`
  padding: 0 8px 8px 0;
`;

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

export const SpinnerStyle = css`
  margin-right: 12px;
`;
