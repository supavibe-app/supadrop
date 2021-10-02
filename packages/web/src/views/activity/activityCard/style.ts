import { css } from '@emotion/css';

export const ActivityCardStyle = css`
  font-weight: bold;
  font-size: 18px;

  display: flex;
  border: 2px solid #2b2b2b;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 32px;
  justify-content: space-between;
  margin-bottom: 32px;

  :hover {
    border: 2px solid #ccff00;
  }
`;

export const ImageCard = css`
  margin-right: 32px;
  cursor: pointer;

  .ant-image-img {
    object-fit: cover;
    height: 198px;
    width: 198px;
    border-radius: unset !important;
  }
`;

export const NFTDescription = css`
  display: flex;
`;

export const NFTStatus = css`
  display: flex;

  > div:first-child {
    margin-right: 36px;
  }
`;

export const NFTName = css`
  font-size: 24px;
  line-height: 30px;
  color: #fafafb;
  margin-bottom: 16px;
  cursor: pointer;
  text-transform: uppercase;
`;

export const UserContainer = css`
  display: flex;
  margin-bottom: 32px;
  font-size: 16px;
  align-items: center;
  color: #fafafb;

  > span {
    margin-right: 12px;
  }
`;

export const Label = css`
  color: #7e7c7c;
`;

export const StatusValue = css`
  font-size: 24px;
  color: #fafafb;
`;

export const WinnerStyle = css`
  font-size: 16px;
  color: #fafafb;
`;

export const Price = css`
  font-size: 36px;
  margin-bottom: 38px;
  color: #fafafb;
`;

export const ButtonWrapper = css`
  padding-right: 8px;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
