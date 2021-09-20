import { css } from '@emotion/css';

export const Title = css`
  font-size: 64px;
  font-weight: 700;
  line-height: 80px;
  margin-bottom: 16px;
`;

export const Description = css`
  font-size: 36px;
  font-weight: 400;
  line-height: 45px;
  color: #cccccc;
  margin-bottom: 46px;
`;

export const ButtonWrapper = css`
  display: flex;
  align-items: center;
`;

export const SocialMediaButton = css`
  display: flex;
  margin-left: 36px;

  div {
    margin-left: 32px;
    cursor: pointer;
  }
`;

export const DiscordButton = css`
  :hover {
    path { fill: #5865F2; }
  }
`;

export const ImageStyle = css`
  max-height: 512px;
  max-width: 512px;
  object-fit: contain;
  filter: drop-shadow(0px 8px 48px rgba(255, 255, 255, 0.16));
  border-radius: 2px;
`;

export const TwitterButton = css`
  :hover {
    path { fill: #1DA1F2; }
  }
`;
