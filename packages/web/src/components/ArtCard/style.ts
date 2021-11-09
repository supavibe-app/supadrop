import { css } from '@emotion/css';

export const AuctionImage = height => css`
  height: ${height ? `${height}px` : '100%'};
  width: 100%;

  .ant-image-img {
    object-fit: cover;
    height: 100% !important;
  }
`;

export const CardStyle = css`
  overflow: hidden;
  border: 2px solid #2b2b2b;
  font-weight: bold;
  font-size: 18px;

  :hover {
    border: 2px solid #ccff00;
  }

  .ant-card-cover {
    border-radius: 2px 2px 0 0;
  }

  .ant-card-body {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    text-align: left;

    background: #000000;
    box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.3);
    border-radius: 0 0 2px 2px;
  }

  .ant-card-meta-title {
    font-size: 24px;
    font-weight: bold;
    padding: 20px 24px;
    margin-bottom: unset !important;
    color: #fafafb;
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

export const AvatarStyle = css`
  margin-right: 10px;
`;

export const UserWrapper = css`
  display: flex;
  margin-bottom: 18px;
  color: #fafafb;
  align-items: center;
`;
