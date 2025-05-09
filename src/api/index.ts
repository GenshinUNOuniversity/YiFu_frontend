import scooter from './scooter';
import login from './login';
import user from './user';
import report from './report';
import chargehistory from './chargehistory';
import track from './track';
// import news from './news';
import station from './station';
// import banner from './banner';
import blacklist from './blacklist';
import message from './message';

export default {
  ...login,
  ...scooter,
  ...user,
  ...report,
  ...chargehistory,
  ...track,
  // ...news,
  ...station,
  // ...banner,
  ...blacklist,
  ...message
};
