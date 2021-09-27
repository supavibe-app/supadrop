import { CountdownState } from '@oyster/common/dist/lib';

const isEnded = (state?: CountdownState) =>
  state?.days === 0 &&
  state?.hours === 0 &&
  state?.minutes === 0 &&
  state?.seconds === 0;

export default isEnded;
