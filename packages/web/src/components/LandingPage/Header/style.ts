import { css } from '@emotion/css';

export const MainTitle = css`
  margin-top: 50px;
  font-weight: bold;
  font-size: 56px;
  line-height: 70px;

  text-transform: uppercase;
  background: linear-gradient(125deg, #1cefff 0%, #ccff00 65.1%, #1cefff 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation-name: shimmer;
  animation-duration: 10s;
  animation-iteration-count: infinite;

  @keyframes shimmer {
    0% {
      background-position: 250px top;
    }
    60% {
      background-position: 1000px top;
    }
    100% {
      background-position: 250px top;
    }
  }
`;

export const MobileMainTitle = css`
  margin-top: 28px;
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;

  text-transform: uppercase;
  background: linear-gradient(125deg, #1cefff 0%, #ccff00 65.1%, #1cefff 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation-name: shimmer;
  animation-duration: 10s;
  animation-iteration-count: infinite;

  @keyframes shimmer {
    0% {
      background-position: 250px top;
    }
    60% {
      background-position: 1000px top;
    }
    100% {
      background-position: 250px top;
    }
  }
`;

export const GradientText = css`
  background: linear-gradient(125deg, #1cefff 0%, #ccff00 65.1%, #1cefff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
`;

export const SecondaryTitle = css`
  font-weight: bold;
  font-size: 56px;
  line-height: 70px;
  color: #fafafb;
  margin-bottom: 32px;
  text-transform: uppercase;
`;

export const MobileSecondaryTitle = css`
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  color: #fafafb;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

export const Description = css`
  font-size: 24px;
  line-height: 30px;
  color: #cccccc;
  margin-bottom: 48px;
  max-width: 632px;
`;

export const MobileDescription = css`
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: #cccccc;
  margin-bottom: 24px;
`;

export const ButtonStyle = css`
  border-radius: 4px;
  border: 1px solid transparent;
  background-image: linear-gradient(#000, #000),
    linear-gradient(225deg, #ccff00 0%, #00ffa3 65.1%, #00ffa3 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;

  padding: 1px;
  height: 71px;
  font-weight: bold;
  font-size: 18px;

  div {
    padding: 18px 32px;
  }

  :hover {
    border: 1px solid #fafafb;
    color: #fafafb;
  }
`;

export const MobileButtonStyle = css`
  border-radius: 4px;
  border: 1px solid transparent;
  background-image: linear-gradient(#000, #000),
    linear-gradient(225deg, #ccff00 0%, #00ffa3 65.1%, #00ffa3 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;

  padding: 1px;
  height: 47px;
  font-weight: bold;
  font-size: 12px;

  div {
    padding: 6px 24px;
  }

  :hover {
    border: 1px solid #fafafb;
    color: #fafafb;
  }
`;

export const ButtonGroup = css`
  display: flex;
  align-items: center;

  div {
    cursor: pointer;
  }

  > div:first-child {
    margin-right: 32px;
  }

  > div + div {
    margin-left: 32px;
  }
`;

export const MobileButtonGroup = css`
  display: flex;
  align-items: center;

  div {
    cursor: pointer;
  }

  > div:first-child {
    margin-right: 32px;
  }

  > div + div {
    margin-right: 20px;
  }
`;

export const DiscordButton = css`
  :hover {
    path {
      fill: #5865f2;
    }
  }
`;

export const TwitterButton = css`
  :hover {
    path {
      fill: #1da1f2;
    }
  }
`;

export const InstagramButton = css`
  color: #fafafb;

  :hover {
    svg {
      opacity: 0.75;
    }
  }
`;
