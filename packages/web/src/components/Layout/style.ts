import { css } from '@emotion/css';

export const HeaderStyle = params => css`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  background: #000000;
  height: auto;
  padding: 0 28px 0 0;

  position: ${params.sticky ? 'fixed' : 'unset'};
  z-index: 1;
  backdrop-filter: blur(5px);
`;
