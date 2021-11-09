import { css } from '@emotion/css';

export const Container = css`
  height: calc(100vh - 80px);
`;

export const ArtContainer = css`
  display: flex;
  justify-content: center;
  height: 100%;

  .ant-skeleton-image {
    min-width: 300px;
    min-height: 300px;

    display: flex !important;
  }
`;

export const ArtContentStyle = css`
  display: flex;
  height: 100%;
  max-width: 85%;

  .ant-image-img {
    object-fit: contain;
    filter: drop-shadow(2px 4px 16px rgba(255, 255, 255, 0.12));
    border-radius: 2px;
    max-height: 100%;
  }
`;

export const OptionsPopover = css`
  .ant-popover-inner {
    border: 2px solid #ccff00;
    border-radius: 4px;
    background: #000000;
  }

  .ant-popover-inner-content {
    padding: 8px 20px;
    padding-right: 0;
  }

  .ant-btn-link {
    padding: 0;
    padding-right: 20px;
    color: #fafafb;
    font-weight: bold;
  }

  .ant-list-item {
    padding: 12px 0;
  }
`;

export const BackButton = css`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #fafafb;

  svg {
    margin-right: 16px;
  }
`;

export const ArtDetailsColumn = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: 768px) {
    height: 100%;
  }
`;

export const OverflowYAuto = css`
  overflow-y: auto;
`;

export const ColumnBox = css`
  border: 1px solid #2b2b2b;
  border-bottom: none;
  border-left: none;
  overflow-y: auto;

  @media (min-width: 768px) {
    height: 100%;
  }
`;

export const PaddingBox = css`
  padding: 32px 28px;
`;

export const ArtDetailsHeader = css`
  display: flex;
  justify-content: space-between;
`;

export const Label = css`
  font-size: 18px;
  color: #7e7c7c;
  margin-bottom: 12px;
`;

export const StatusContainer = css`
  border-top: 1px solid #2b2b2b;
`;
