import { css } from '@emotion/css';

export const UploadStyle = css`
  .ant-upload-list {
    display: none;
  }
`;

export const EditProfileTitle = css`
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 30px;
  margin-bottom: 24px;
`;

export const UploadImageContainer = css`
  display: flex;
  margin-bottom: 36px;

  div:first-child {
    margin-right: 12px;
  }
`;

export const InputPrefixStyle = css`
  border: unset;
  border-radius: unset;
  border-bottom: 1px solid #2b2b2b;
  color: #fafafb;
  background: transparent;
  padding: unset;
  padding-bottom: 12px;
  box-shadow: unset !important;

  .ant-input-prefix {
    color: #7e7c7c;
    font-style: normal;
    font-weight: normal;
  }

  .ant-input {
    background: transparent;
    border-radius: unset;
  }

  :focus-within {
    border-bottom: 1px solid #ccff00;
  }
`;

export const InputStyle = css`
  border: unset;
  border-radius: unset;
  border-bottom: 1px solid #2b2b2b;
  color: #fafafb;
  background: transparent;

  padding: unset;
  padding-bottom: 12px;

  :focus {
    box-shadow: unset;
    border-bottom: 1px solid #ccff00;
  }

  :hover {
    box-shadow: unset;
  }
`;

export const TextAreaStyle = css`
  background: transparent;
  border: 1px solid #2b2b2b;
  color: #fafafb;
  border-radius: 2px;
`;

export const FormItemStyle = css`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  color: #fafafb;
  margin-bottom: 24px;

  .ant-form-item-label {
    padding: unset;
    margin-bottom: 2px;
  }

  label {
    width: 100%;
    font-size: 18px;
  }
`;

export const ChooseFileButton = css`
  padding: unset;
  margin-top: 12px;
`;

export const BioLabel = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;

  div:last-child {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    color: #7e7c7c;
  }
`;

export const CancelButton = css`
  margin-top: 24px;
  width: 100%;
  color: #fafafb;
`;
