const api = require('../../config/api.js');
const util = require('../../utils/util.js');

export const handleBabyModify = async data => {
  try {
    const resp = await util.request(api.EditBabyDetail, data, 'POST');
    if (resp) {
      console.log('res', resp);
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 2000,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
