import { css } from '@emotion/css';

export const UserWrapper = css`
  display: flex;
  margin-bottom: 18px;
  color: #fafafb;
  align-items: center;
`;

export const AvatarStyle = css`
  margin-right: 10px;
`;

export const StyledLink = css`
  text-decoration: none;
  text-color:red &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;
