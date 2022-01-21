import moment from 'moment';

const countDown = (endAt, displayDay = false) => {
  const now = moment().unix();
  const ended = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  let delta = endAt - now;
  if (!endAt || delta <= 0) return ended;
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  const seconds = Math.floor(delta % 60);
  if (displayDay) {
    return {
      days,
      hours,
      minutes,
      seconds,
    };
  } else {
    return {
      days: 0,
      hours: hours + days * 24,
      minutes,
      seconds,
    };
  }
};

export default countDown;
