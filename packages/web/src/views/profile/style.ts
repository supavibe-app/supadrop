import { css } from '@emotion/css';

export const ProfileSection = css`
  padding: 56px;
  overflow: auto;
  height: calc(100vh - 80px);
`;

export const NameStyle = css`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  text-align: center;
  margin: 24px 0 16px;
`;

export const AddressSection = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7e7c7c;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 16px;

  div + div {
    margin-left: 8px;
  }
`;

export const UsernameSection = css`
  color: #ccff00;
  font-weight: bold;
  font-size: 18px;
`;

export const IconURL = css`
  margin: 24px 0;
  font-size: 26px;

  span,
  svg {
    margin: 0 8px;
    cursor: pointer;
  }
`;

export const BioSection = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 136%;
  text-align: center;
  color: #cccccc;
  margin-bottom: 28px;
`;

export const EditProfileButton = css`
  width: 120px;
  height: 42px;
  border: 2px solid #444444;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
`;

export const ArtsContent = css`
  padding: 56px 56px 56px 16px;
`;

export const UploadStyle = css`
  .ant-upload-list {
    display: none;
  }
`;

export const TabsStyle = css`
  height: 100%;

  .ant-tabs-nav {
    margin: unset;
    margin-bottom: 36px;
  }

  .ant-tabs-tab {
    text-transform: uppercase;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    color: #7e7c7c;
    margin-bottom: 16px;
    padding: unset;

    span {
      color: #444444;
    }
  }

  .ant-tabs-tab-active {
    span {
      color: #fafafb;
    }
  }

  .ant-tabs-content,
  .ant-row {
    height: 100%;
  }
`;

export const EmptyRow = css`
  align-content: center;
  text-align: center;
`;

export const EmptyStyle = css`
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  color: #7e7c7c;

  div:first-child {
    font-weight: bold;
    font-size: 24px;
    color: #fafafb;
    margin-bottom: 12px;
  }
`;

// edit profile style
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
