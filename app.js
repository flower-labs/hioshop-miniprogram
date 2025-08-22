import { handleInitLogin } from './utils'

App({
  data: {
    deviceInfo: {}
  },
  onLaunch: function () {
    const platform = wx.getDeviceInfo().platform;
    /** 判断是否运行在开发工具中 */
    const isDevtoolsMode = platform === 'devtools';
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    !isDevtoolsMode && handleInitLogin(this);
    let that = this;
    wx.getSystemInfo({ //  获取页面的有关信息
      success: function (res) {
        wx.setStorageSync('systemInfo', res)
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
      }
    });
  },
  globalData: {
    globalLoading: false,
    userInfo: {
      nickname: '点我登录',
      username: '点击登录',
      avatar: 'https://cdn.bajie.club/babycare/default_avatar_big.png'
    },
    token: '',
    editingBabyRecord: null,
  }
})