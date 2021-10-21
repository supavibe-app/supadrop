import { css } from '@emotion/css';

export const BackButton = css`
  display: flex;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;

  color: #7e7c7c;
  margin-bottom: 28px;

  cursor: pointer;

  svg {
    margin-right: 16px;
    color: #fafafb;
  }
`;

export const LabelTitle = css`
  font-weight: bold;
  font-size: 36px;

  color: #fafafb;
  margin-bottom: 8px;
`;

export const LabelSecondaryTitle = css`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 8px;

  color: #fafafb;
`;

export const LabelDesc = css`
  font-weight: normal;
  font-size: 14px;
  margin-bottom: 16px;

  color: #7e7c7c;
`;

export const OptionsContainer = css`
  margin-bottom: 42px;

  font-weight: bold;
  font-size: 16px;
  color: #fafafb;

  > div + div {
    margin-top: 28px;
  }
`;

export const OptionsWrapper = css`
  display: flex;

  > div + div {
    margin-left: 16px;
  }

  > button + button {
    margin-left: 12px;
  }
`;

export const OptionBoxStyle = isActive => css`
  width: 118px;
  height: 118px;
  border: 2px solid ${isActive ? '#CCFF00' : '#7E7C7C'};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;

  font-weight: bold;
  font-size: 18px;
  line-height: 22px;

  color: ${isActive ? '#FAFAFAB' : '#7E7C7C'};

  svg {
    margin-bottom: 8px;
  }
`;

export const OptionButtonStyle = isActive => css`
  border: 2px solid ${isActive ? '#CCFF00' : '#2B2B2B'};
  padding: 2px 16px;
`;
