import { css } from '@emotion/css';

export const ButtonGroup = css`
  display: flex;
  align-items: center;

  > svg {
    margin-left: 28px;
  }

  > div + div {
    margin-left: 28px;
  }
`;

export const MobileButtonGroup = css`
  display: flex;

  > svg {
    margin-left: 20px;
  }

  > div + div {
    margin-left: 20px;
  }
`;

export const ButtonStyle = css`
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;
  padding-left: unset;

  color: #fafafb;

  span {
    margin-right: 4px;
  }

  :hover,
  :active,
  :focus {
    background: linear-gradient(
      125deg,
      #1cefff 0%,
      #ccff00 65.1%,
      #1cefff 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const MobileButtonStyle = css`
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;

  color: #fafafb;
  padding: 0;

  span {
    margin-right: 4px;
  }

  :hover,
  :active,
  :focus {
    background: linear-gradient(
      125deg,
      #1cefff 0%,
      #ccff00 65.1%,
      #1cefff 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const ButtonStyleFAQ = css`
  font-weight: normal;
  font-size: 24px;
  line-height: 30px;

  color: #fafafb;

  span {
    margin-right: 4px;
  }

  :hover,
  :active,
  :focus {
    color: #fafafb;
    opacity: 0.75;
  }
`;

export const MobileButtonStyleFAQ = css`
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;

  color: #fafafb;

  span {
    margin-right: 4px;
  }

  :hover,
  :active,
  :focus {
    color: #fafafb;
    opacity: 0.75;
  }
`;
