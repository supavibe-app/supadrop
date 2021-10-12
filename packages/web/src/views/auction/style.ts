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

export const SmallPaddingBox = css`
  padding: 16px 28px 32px 28px;
`;

export const ArtDetailsHeader = css`
  display: flex;
  justify-content: space-between;
`;

export const ArtTitle = css`
  font-weight: bold;
  font-size: 36px;
  color: #fafafb;
  margin-bottom: 16px;
  line-height: 48px;
`;

export const ArtDescription = css`
  font-size: 18px;
  line-height: 22px;
  color: #fafafb;
`;

export const Label = css`
  font-size: 18px;
  color: #7e7c7c;
  margin-bottom: 12px;
`;

export const ContentSection = css`
  margin-bottom: 32px;
`;

export const StatusContainer = css`
  border-top: 1px solid #2b2b2b;
`;

export const BidStatus = css`
  display: flex;
  margin-bottom: 32px;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  color: #7e7c7c;

  .ant-avatar {
    margin-right: 16px;
  }
`;

export const BidStatusEmpty = css`
  display: flex;
  margin-bottom: 22px;
  font-weight: bold;
  font-size: 14px;
  color: #7e7c7c;
`;

export const CurrentBid = css`
  font-size: 18px;
`;

export const NormalFont = css`
  font-weight: normal;
  font-style: normal;
`;

export const ButtonWrapper = css`
  padding: 0 8px 8px 0;
`;

export const Activity = css`
  font-size: 14px;
  color: #fafafb;
  margin-bottom: 12px;
  align-items: center;

  .ant-avatar {
    margin-right: 4px;
  }

  div:last-child {
    text-align: end;
  }
`;

export const IsMyBid = css`
  position: absolute;
  height: 8px;
  width: 8px;
  background: #ccff00;
  left: 12px;
  border-radius: 4px;
  margin-top: 8px;
`;

export const ActivityHeader = css`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  color: #7e7c7c;
  margin-bottom: 16px;
  align-items: center;
`;

export const UserThumbnail = css`
  margin-bottom: 8px;
  .ant-avatar {
    margin-right: 12px;
  }
`;

export const Attribute = css`
  border: 1px solid #ccff00;
  background: #0f1202;
  color: #7e7c7c;
  font-weight: 600;
  cursor: initial;
  text-transform: lowercase;

  :hover {
    border: 1px solid #ccff00;
    background: #0f1202;
    color: #7e7c7c;
    font-weight: 600;
  }

  :active {
    border: 1px solid #ccff00;
    background: #0f1202;
    color: #7e7c7c;
    font-weight: 600;
  }

  :focus {
    border: 1px solid #ccff00;
    background: #0f1202;
    color: #7e7c7c;
    font-weight: 600;
  }
`;

export const AttributeRarity = css`
  margin-left: 4px;
  color: #ccff00;
`;

// place bid styles
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

export const SpinnerStyle = css`
  margin-right: 12px;
`;
