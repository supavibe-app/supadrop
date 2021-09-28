import { css } from '@emotion/css';

export const AuctionImage = css`
  width: 100%;
`;

export const CardStyle = css`
  overflow: hidden;
  border: 2px solid #2b2b2b;
  font-weight: bold;
  font-size: 18px;

  :hover {
    border: 2px solid #ccff00;
  }

  .ant-card-body {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    text-align: left;

    background: #000000;
    box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.3);
    border-radius: 0px 0px 8px 8px;
  }

  .ant-card-meta-title {
    font-size: 24px;
    font-weight: bold;
    padding: 20px 24px;
    margin-bottom: unset !important;
    color: #fafafb;
    text-transform: uppercase;
  }

  .ant-card-meta-description {
    padding: 0 24px 28px 24px;
  }

  .ant-card-meta {
    width: 100%;
    margin: unset;
  }

  .ant-image {
    display: block;
  }
`;

export const NumberStyle = css`
  font-size: 20px;
  color: #fafafb;
  font-weight: bold;
`;

export const UserWrapper = css`
  display: flex;
  margin-bottom: 18px;
  color: #fafafb;
  align-items: center;
`;

export const AvatarStyle = css`
  margin-right: 10px;
`;

export const BidPrice = css`
  color: #fafafb;
  font-weight: bold;

  .ant-statistic-content {
    color: #fafafb;
    font-size: 20px;
  }
`;

export const OwnerContainer = css`
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fafafb;
`;
