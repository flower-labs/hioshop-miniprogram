const api = require('../../config/api.js');
const util = require('../../utils/util.js');

export const queryBabyDetail = async () => {
  const resp = await util.request(api.GetBabyDetail, 'POST');
  if (resp.errno === 0) {
    if (resp.data.length !== 0) {
      return {
        hasInfo: true,
        babyInfo: resp.data[0],
      };
    } else {
      return {
        hasInfo: false,
        babyInfo: null,
      };
    }
  }
};
