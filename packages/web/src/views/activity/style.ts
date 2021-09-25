import { css } from '@emotion/css';

export const PageTitle = css`
  font-weight: bold;
  font-size: 36px;
  line-height: 45px;
  color: #fafafb;
  margin: 56px 0 24px 0;
`;

export const TabStyle = css`
  padding-bottom: 8px;

  .ant-tabs-nav {
    font-weight: bold;
    color: #7e7c7c;
    margin-bottom: 32px;
  }

  .ant-tabs-tab + .ant-tabs-tab {
    margin: 0 0 0 24px;
  }

  .ant-tabs-tab {
    font-size: 18px;
  }
`;

export const ActivityCard = css`
  font-weight: bold;
  font-size: 18px;

  display: flex;
  border: 2px solid #2b2b2b;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 32px;
  justify-content: space-between;
  margin-bottom: 32px;
`;

export const ImageCard = css`
  margin-right: 32px;
  width: 198px;
  height: 198px;
  object-fit: cover;
  cursor: pointer;
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
`;

export const NFTOwner = css`
  display: flex;
  margin-bottom: 32px;
  font-size: 16px;

  > span {
    margin-right: 12px;
  }
`;

export const Label = css`
  color: #7e7c7c;
`;

export const StatusValue = css`
  font-size: 24px;
`;

export const Price = css`
  font-size: 36px;
  margin-bottom: 38px;
`;

export const ButtonWrapper = css`
  padding-right: 8px;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const SubTitle = css`
  font-size: 24px;
  font-weight: bold;
  color: #fafafb;
`;

export const Content = css`
  font-size: 18px;
  color: #7e7c7c;
  margin-bottom: 36px;
`;
