import { css } from '@emotion/css';

export const CreatorName = css`
  font-weight: bold;
  font-size: 36px;
  line-height: 45px;
  color: #fafafb;

  text-align: center;
  margin-bottom: 98px;

  svg {
    color: #ccff00;
  }
`;

export const DetailsInformation = css`
  font-size: 18px;
  font-weight: bold;
  color: #fafafb;
`;

export const DropdownStyle = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;

  .svg {
    right: 8px;
    top: 28%;
  }
`;

export const OverlayStyle = css`
  font-size: 14px;
  background: #000000;
  border: 2px solid #ccff00;
  padding: 16px 0;
  width: 198px;
  min-width: 198px !important;
  border-radius: 4px;

  .ant-dropdown-menu {
    background-color: #000000;
  }

  .ant-dropdown-menu-item {
    font-weight: bold;

    :hover {
      background: #2b2b2b;
    }
  }
`;

export const ActiveSortBy = css`
  color: #ccff00;
  background: #2b2b2b;
`;
