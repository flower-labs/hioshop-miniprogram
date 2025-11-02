const api = require('../../config/api.js');
const util = require('../../utils/util.js');

export const queryBabyDetailGlobal = async () => {
  const resp = await util.request(api.GetBabyDetail, 'POST');
  if (resp.errno === 0) {
    if (resp.data.length !== 0) {
      const defaultBabyId = wx.getStorageSync('defaultBabyId');
      if (!defaultBabyId) {
        const defaultBabyInfo = resp.data?.[0];
        wx.setStorageSync('defaultBabyId', defaultBabyInfo.id);
        return {
          hasInfo: true,
          babyInfo: defaultBabyInfo,
        };
      } else {
        const defaultBabyInfo = (resp.data || []).find(item => item.id === defaultBabyId);
        return {
          hasInfo: true,
          babyInfo: defaultBabyInfo,
        };
      }
    } else {
      return {
        hasInfo: false,
        babyInfo: null,
      };
    }
  }
};
