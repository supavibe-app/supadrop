import { css } from '@emotion/css';

export const InputPriceStyle = css`
  padding: unset;
  height: 78px;
  margin-bottom: 24px;
  border-radius: 2px;
  border: 2px solid #ccff00;
  background: transparent;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  .ant-input {
    font-weight: bold;
    background: transparent;
    padding-left: 32px !important;
    font-size: 24px;
  }

  .ant-input-suffix {
    padding: 0 32px;
    background: #fafafb;
    color: #161f26;
    font-weight: bold;
    font-size: 24px;
  }
`;
