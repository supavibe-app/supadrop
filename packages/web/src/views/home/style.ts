import { css } from '@emotion/css';

export const LayoutStyle = css`
  margin-top: 88px;
`;

export const TitleWrapper = css`
  display: flex;
  font-size: 36px;
  font-weight: bold;
  align-items: center;
  margin-bottom: 38px;
`;

export const LiveDot = css`
  width: 12px;
  height: 12px;
  background: #ccff00;
  border-radius: 5px;
  margin-right: 16px;
  animation: blinker 2s linear infinite;

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`;

export const MasonryGrid = css`
  display: -webkit-box; /* Not needed if autoprefixing */
  display: -ms-flexbox; /* Not needed if autoprefixing */
  display: flex;
  width: auto;
  margin-left: auto;
  margin-right: auto;

  > div {
    margin-bottom: 30px;
  }
`;

export const MasonryGridColumn = css`
  background-clip: padding-box;
`;
