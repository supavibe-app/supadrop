import { css } from '@emotion/css';

export const ButtonStyle = width => css`
  position: relative;
  display: inline-block;
  padding: 20px 32px;
  background-color: transparent;
  border: 2px solid #ccff00;
  height: 78px;
  width: ${width || 'fit-content'}px;
  min-width: fit-content;
  text-align: center;

  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  color: #ccff00;

  box-shadow: 6px 6px 0 #ccff00;
  text-decoration: none;

  border-radius: 2px;

  &:hover {
    background-color: white;
    color: #0a0a0c;
  }

  &::after {
    position: absolute;
    top: 2px;
    left: -4px;
    width: 4px;
    height: 4px;
    background-color: #ccff00;
    transform: rotate(45deg);
    z-index: -1;
  }

  &::before {
    position: absolute;
    bottom: -4px;
    right: 2px;
    width: 4px;
    height: 4px;
    background-color: #ccff00;
    transform: rotate(45deg);
    z-index: -1;
  }

  :active {
    top: 6px;
    left: 6px;
    box-shadow: none;

    &:before {
      bottom: 1px;
      right: 1px;
    }

    &:after {
      top: 1px;
      left: 1px;
    }
  }

  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
`;
