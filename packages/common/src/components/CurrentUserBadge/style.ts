import { css } from '@emotion/css';

export const ProfileContainer = css`
  display: flex;
`;

export const DetailBox = css`
  margin-right: 12px;
  cursor: pointer;
`;

export const AddressStyle = css`
  line-height: normal;
  text-align: right;

  color: #7e7c7c;
  font-size: 12px;
`;

export const BalanceStyle = css`
  line-height: normal;
  text-align: right;

  font-weight: 700;
  font-size: 16px;

  margin-bottom: 4px;
`;

export const ProfilePopover = css`
  .ant-popover-inner {
    border: 2px solid #ccff00;
    border-radius: 4px;
  }

  .ant-popover-inner-content {
    padding-right: 0;
  }
`;

export const ModalEditProfile = css`
  .ant-modal-title {
    font-weight: bold;
    border-bottom: unset;
  }
`;
