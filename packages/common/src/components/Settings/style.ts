import { css } from '@emotion/css';

export const ListStyle = css`
  font-weight: bold;
  width: 180px;

  .ant-list-item {
    display: flex;
    justify-content: start;
    cursor: pointer;
    padding: 20px 0;
  }

  .ant-popover-inner-content {
    padding: 4px 0 4px 24px;
  }
`;

export const ItemIcon = css`
  margin-right: 20px;
`;

export const BalanceInfo = css`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  color: #fafafb;
`;

export const AddressInfo = css`
  display: flex;

  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: #7e7c7c;

  div {
    margin-right: 8px;
  }
`;
