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

export const SelectStyle = css`
  width: 198px;

  .ant-select-selector {
    border: unset !important;
    font-size: 18px;
    padding: 0 8px !important;
  }

  .ant-select-focused {
    border: unset !important;

    :focus {
      border: unset !important;
    }
  }

  .ant-select-arrow {
    right: 8px;
    top: 28%;
  }
`;

export const OptionStyle = css`
  font-size: 14px;
`;

export const DropdownStyle = css`
  font-size: 14px;
  background: #000000;
  border: 2px solid #ccff00;
  padding: 16px 0;

  .ant-select-item-option-selected {
    color: #ccff00;
    background: #2b2b2b;
  }
`;
