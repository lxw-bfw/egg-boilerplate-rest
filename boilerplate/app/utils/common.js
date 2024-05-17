/**
 *
 * @param {*} input 格式 '1m' '1s' '1h' '1ms'
 * @returns
 */
const getFutureTimestamp = input => {
    const units = {
      ms: 1,
      s: 1000,
      m: 60000,
      h: 3600000,
    };
  
    const unit = input.match(/[a-zA-Z]+/)[0];
    const value = Number(input.match(/\d+/)[0]);
  
    if (!(unit in units)) {
      console.error('Invalid unit. Please use ms, s, m, or h.');
      return;
    }
  
    const now = new Date().getTime();
    const future = now + value * units[unit];
  
    return future;
  };
  module.exports = {
    getFutureTimestamp,
  };
  