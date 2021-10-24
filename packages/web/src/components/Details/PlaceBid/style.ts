import { css } from '@emotion/css';

export const PlaceBidTitle = css`
  font-weight: bold;
  font-size: 36px;
  color: #fafafb;
  margin-bottom: 16px;
`;

export const Information = css`
  font-weight: bold;
  font-size: 18px;
  color: #7e7c7c;
  margin-bottom: 28px;

  display: flex;
  justify-content: space-between;
`;

export const AddFunds = css`
  font-weight: normal;
  color: #ccff00;
  cursor: pointer;
`;

export const BidRuleInformation = css`
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: #fafafb;
`;

export const BidInput = css`
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

// Add Funds Style
export const AddFundsModal = css`
  border: 2px solid #ccff00;
  border-radius: 4px;
  padding-bottom: unset;

  .ant-modal-header {
    background: #000000;
  }

  .ant-modal-body {
    background: #000000 !important;
  }

  .ant-modal-title {
    font-weight: bold;
  }
`;

export const AddFundsBalance = css`
  width: 100%;
  background: #242424;
  border-radius: 12px;
  margin-bottom: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
  font-weight: 700;
`;

export const LogoSOL = css`
  border-radius: 50%;
  background: #000000;
  display: inline-block;
  padding: 1px 4px 4px 4px;
  line-height: 1;
`;

export const SignInFTXButton = css`
  background: #000000;
  border-radius: 14px;
  width: 100%;
  padding: 10px;
  height: auto;
  border-color: #fafafb;
  margin: 16px 0;
`;
