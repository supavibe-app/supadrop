import { css } from '@emotion/css';

export const SubHeaderBox = css`
  border-radius: 12px;
  background: linear-gradient(225deg, #ccff00 0%, #00ffa3 65.1%, #00ffa3 100%);
  padding: 74px 64px 74px 0;
  color: #000;
`;

export const MobileSubHeaderBox = css`
  border-radius: 12px;
  background: linear-gradient(225deg, #ccff00 0%, #00ffa3 65.1%, #00ffa3 100%);
  color: #000;
`;

export const TabsStyle = css`
  color: #000000;

  .tab-indicator {
    width: 6px;
    height: 56px;
    background: #000000;
    position: absolute;
    left: 0;
    border-radius: 0px 2px 2px 0px;
  }

  .ant-tabs-extra-content {
    max-width: 260px;
    margin: 24px 24px 24px 56px;
    font-weight: 600;
    font-size: 20px;
    line-height: 25px;

    color: #2b2b2b;
  }

  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: #000;
      opacity: 1;
    }
  }

  .ant-tabs-tab-btn {
    color: #0a0a0c;
    font-size: 36px;
    font-weight: bold;
    opacity: 0.4;
    margin-left: 32px;
  }

  .ant-tabs-ink-bar {
    background-color: transparent;
  }

  .ant-tabs-content-holder {
    border-left: unset;
  }
`;

export const MobileTabsStyle = css`
  color: #000000;

  .ant-tabs-nav-wrap {
    padding: 0 24px;
  }

  .tab-indicator {
    width: 68px;
    height: 6px;
    background: #000000;
    position: absolute;
    top: 0;
    border-radius: 0px 2px 2px 0px;
  }

  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: #000;
      opacity: 1;
    }
  }

  .ant-tabs-tab-btn {
    color: #0a0a0c;
    font-size: 18px;
    font-weight: bold;
    opacity: 0.4;
    margin-top: 30px;
  }

  .ant-tabs-ink-bar {
    background-color: transparent;
  }

  .ant-tabs-content-holder {
    border-top: unset;
  }

  .ant-tabs-nav {
    :: before {
      content: unset;
    }
  }
`;

export const ImagePreview = css`
  width: 100%;
`;

export const MobileDescription = css`
  margin: 0 28px 24px 28px;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;

  /* 2B2B2B */

  color: #2b2b2b;
`;

export const PreviewStyle = css`
  text-align: center;
  background: #000000;

  font-weight: bold;
  color: #fafafb;
  margin: 0 16px 16px 16px;
  padding-top: 40px;
  border-radius: 8px;
`;

export const ProfileInfo = css`
  margin-bottom: 8px;
`;

export const CardStyle = css`
  overflow: hidden;
  border: 1px solid #2b2b2b;
  font-weight: bold;
  font-size: 12px;

  .ant-card-cover {
    border-radius: 2px 2px 0 0;
  }

  .ant-card-body {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    text-align: left;

    background: #000000;
    box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.3);
    border-radius: 0 0 2px 2px;
  }

  .ant-card-meta-title {
    font-size: 14px;
    font-weight: bold;
    padding: 20px 12px;
    margin-bottom: unset !important;
    color: #fafafb;
  }

  .ant-card-meta-description {
    padding: 0 12px 14px 12px;
  }

  .ant-card-meta {
    width: 100%;
    margin: unset;
  }

  .ant-image {
    display: block;
  }
`;

export const UserWrapper = css`
  display: flex;
  margin-bottom: 18px;
  color: #fafafb;
  align-items: center;
`;

export const BidPrice = css`
  color: #fafafb;
  font-weight: bold;

  .ant-statistic-content {
    color: #fafafb;
    font-size: 12px;
  }
`;

export const OwnerContainer = css`
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fafafb;
`;

export const PreviewCarousel = css`
  margin: 24px -8px;
  padding-bottom: 24px;
`;

export const PreviewRow = css`
  overflow-y: auto;
  padding: 0 24px;
`;
