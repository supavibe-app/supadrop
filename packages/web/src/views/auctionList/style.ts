import { css } from '@emotion/css';

export const LayoutStyle = css`
  margin-top: 88px;
`;

export const TitleWrapper = css`
  display: flex;
  font-size: 36px;
  font-weight: bold;
  align-items: center;
`;

export const LiveDot = isActive => css`
  width: 12px;
  height: 12px;
  background: ${isActive ? '#ccff00' : '#7E7C7C'};
  border-radius: 5px;
  margin-right: 16px;
  ${isActive ? 'animation: blinker 2s linear infinite;' : null}

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`;

export const TabsStyle = css`
  color: #7e7c7c;

  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: #fafafb;
    }
  }

  .ant-tabs-nav {
    ::before {
      content: none;
    }
  }

  .ant-tabs-ink-bar {
    display: none;
  }
`;

export const Timer = css`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  color: #ccff00;
`;

export const Label = css`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  color: #7e7c7c;
`;

export const NumberStyle = css`
  font-size: 48px;
  font-weight: bold;
  color: #fafafb;
`;
