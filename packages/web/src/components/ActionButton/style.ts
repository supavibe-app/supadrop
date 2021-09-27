import { css } from '@emotion/css';

export const ButtonStyle = ({
  height,
  width,
  fontSize,
  padding,
  disabled,
}) => css`
  position: relative;
  display: inline-block;
  padding: ${padding}px 32px;
  background-color: transparent;
  border: ${disabled ? '2px solid #7E7C7C' : '2px solid #ccff00'};
  height: ${height}px;
  width: ${width ? width : 'fit-content'};
  min-width: fit-content;
  text-align: center;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};

  font-weight: bold;
  font-size: ${fontSize}px;
  color: ${disabled ? '#7E7C7C' : '#ccff00'};

  box-shadow: 8px 8px 0 ${disabled ? '#7E7C7C' : '#ccff00'};
  text-decoration: none;

  border-radius: 2px;

  ${!disabled
    ? `&:hover {
      background-color: white;
      color: #0a0a0c;
    }`
    : null}

  &::after {
    position: absolute;
    top: 2px;
    left: -4px;
    width: 4px;
    height: 4px;
    background-color: ${disabled ? '#7E7C7C' : '#ccff00'};
    transform: rotate(45deg);
    z-index: -1;
  }

  &::before {
    position: absolute;
    bottom: -4px;
    right: 2px;
    width: 4px;
    height: 4px;
    background-color: ${disabled ? '#7E7C7C' : '#ccff00'};
    transform: rotate(45deg);
    z-index: -1;
  }

  ${!disabled
    ? `:active {
      top: 8px;
      left: 8px;
      box-shadow: none;
  
      &:before {
        bottom: 1px;
        right: 1px;
      }
  
      &:after {
        top: 1px;
        left: 1px;
      }
    }`
    : null}

  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
`;
