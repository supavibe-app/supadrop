import { css } from '@emotion/css';

// Left Section
export const HeaderLabelStyle = css`
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: #7e7c7c;
  margin-bottom: 24px;
`;

export const ErrorTextStyle = css`
  color: #ff2d55;
  margin-top: 12px;
  font-size: 14px;
`;

export const TabsStyle = css`
  .ant-tabs-nav-list {
    font-weight: bold;
  }

  .ant-tabs-tab {
    color: #7e7c7c;
    text-transform: uppercase;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #fafafb;
  }

  .ant-tabs-ink-bar {
    background-color: transparent;
  }

  .ant-tabs-nav {
    :before {
      border: unset;
    }
  }
`;

export const FormStyle = css`
  .ant-form-item {
    margin-top: 48px;
    margin-bottom: 0;
  }

  .ant-form-item-label {
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: #fafafb;
  }
`;

export const ImageWrapper = css`
  padding: 36px;
  border: 2px dashed #444444;
  box-sizing: border-box;
  border-radius: 4px;
  background: transparent;
  position: relative;
  text-align: center;
`;

export const DraggerStyle = css`
  border: 2px dashed #444444;
  box-sizing: border-box;
  border-radius: 4px;
  background: transparent;
`;

export const InputStyle = css`
  border: unset;
  border-radius: unset;
  border-bottom: 1px solid #2b2b2b;
  color: #fafafb;
  background: transparent;
  font-size: 16px;

  padding-left: 0;
  padding-bottom: 12px;

  :focus {
    box-shadow: unset;
    border-bottom: 1px solid #ccff00;
  }

  :hover {
    box-shadow: unset;
  }
`;

export const InputWithSuffixStyle = css`
  border: unset;
  border-radius: unset;
  border-bottom: 1px solid #2b2b2b;
  color: #fafafb;
  background: transparent;
  padding: unset;
  padding-bottom: 12px;
  box-shadow: unset !important;
  font-size: 16px;

  .ant-input-prefix {
    color: #7e7c7c;
    font-style: normal;
    font-weight: normal;
  }

  .ant-input {
    font-size: 16px;
    background: transparent;
    border-radius: unset;
  }

  :focus-within {
    border-bottom: 1px solid #ccff00;
  }
`;

export const TextAreaStyle = css`
  background: transparent;
  border: unset;
  border-bottom: 1px solid #2b2b2b;
  color: #fafafb;
  padding-left: 0;
  border-radius: unset;
  font-size: 16px;

  :focus {
    box-shadow: unset;
    border-bottom: 1px solid #ccff00;
  }

  :hover {
    box-shadow: unset;
  }
`;

export const InputWithAddon = css`
  border: unset;

  .ant-input-group-addon {
    background: transparent;
    border: unset;
    cursor: pointer;
  }

  .ant-input {
    border-radius: unset;
    background: transparent;
    box-shadow: unset;

    :focus {
      box-shadow: unset;
      border: unset;
    }
  }
`;

export const TransparentInput = css`
  background: transparent;
  border: unset;
  box-shadow: unset !important;

  .ant-input {
    font-size: 16px;
    background: transparent;
    border-radius: unset;
  }
`;

export const SliderStyle = css`
  margin-top: 18px;

  .ant-slider-step {
    height: 2px;
  }

  .ant-slider-track {
    height: 3px;
    background: #fafafb;
  }

  .ant-slider-handle {
    border-radius: unset;
    height: 12px;
    width: 12px;
    margin-top: -5px;
  }
`;

// Right Section
export const CardStyle = css`
  background: transparent;
  border: 2px solid #32B2B2B;

  .ant-card-body {
    padding: 24px;
  }

  .ant-card-cover {
    padding: 1px;
  }
`;

export const PlaceholderStyle = width => css`
  height: ${width}px;
  background: #2b2b2b;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7e7c7c;
  border-radius: 2px 2px 0px 0px;
`;

export const TitleSkeletonStyle = css`
  margin-bottom: 24px;

  .ant-skeleton-content .ant-skeleton-title {
    height: 30px;
    margin: unset;
  }
`;

export const ArtTitleStyle = css`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  color: #fafafb;
  margin-bottom: 24px;
`;

export const UsernameStyle = css`
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  color: #fafafb;

  display: flex;
  align-items: center;

  span:last-child {
    margin-left: 12px;
  }
`;
