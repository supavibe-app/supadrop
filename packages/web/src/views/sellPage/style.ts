import { css } from '@emotion/css';

export const ProfileSection = css`
  padding: 56px;
  overflow: auto;
  height: calc(100vh - 80px);
  width: 100%;
  position: fixed;
  text-align: -webkit-center;
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
  height: 100%;
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

export const BadgeStyle = css`
  text-transform: uppercase;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  color: #7e7c7c !important;
  padding: unset;

  span {
    color: #444444 !important;
  }

  .ant-badge-dot {
    background: #ff2d55;
    width: 8px;
    height: 8px;
    animation: blinker 2s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
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