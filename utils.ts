const api = require('config/api.js');
const util = require('utils/util.js');

// 初始化登录
export const handleInitLogin = async context => {
  showGlobalLoading(context);
  try {
    const resp = await util.login();
    const userInfo = await util.getUserInfo();
    if (resp.code && userInfo) {
      const loginResp = await util.request(
        api.AuthLoginByWeixin,
        {
          code: resp.code,
          userInfo: userInfo,
        },
        'POST',
      );
      if (loginResp.errno === 0) {
        //存储用户信息
        wx.setStorageSync('userInfo', loginResp.data.userInfo);
        wx.setStorageSync('token', loginResp.data.token);
        wx.reLaunch({ url: '/pages/baby-setting/index' });
        hideGlobalLoading(context);
      }
    }
  } catch (error) {
    console.log('error');
    wx.navigateTo({
      url: '/pages/app-auth/index',
    });
  }
};

const showGlobalLoading = context => {
  context.globalData.globalLoading = true;
  wx.showLoading({ title: '登录中...', mask: true });
};

const hideGlobalLoading = context => {
  context.globalData.globalLoading = false;
  wx.hideLoading();
};
