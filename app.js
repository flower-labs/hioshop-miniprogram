import { handleInitLogin } from './utils'

App({
  data: {
    deviceInfo: {}
  },
  onLaunch: function () {
    this.data.deviceInfo = wx.getSystemInfoSync();
    console.log(this.data.deviceInfo);
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    handleInitLogin(this);
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
      avatar: 'http://cdn.bajie.club/babycare/default_avatar_big.png'
    },
    token: '',
    editingBabyRecord: null,
  }
})