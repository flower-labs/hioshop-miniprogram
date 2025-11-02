// pages/babySwitch/babySwitch.ts
const api = require('../../config/api.js');
const util = require('../../utils/util.js');
import { getTimeDifference } from './utils';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    babyList: [],
  },
  // 邀请功能
  onInvite() {
    wx.navigateTo({
      url: '/pages/baby-register/baby-register',
    });
  },
  // 扫码关注功能
  onScan() {
    wx.showToast({
      title: '开发中，敬请期待',
      icon: 'none',
    });

    // wx.scanCode({
    //   onlyFromCamera: true,
    //   success: res => {
    //     wx.showToast({
    //       title: `扫码成功: ${res.result}`,
    //       icon: 'none',
    //     });
    //   },
    //   fail: err => {
    //     console.error('扫码失败', err);
    //     wx.showToast({
    //       title: '扫码失败，请重试',
    //       icon: 'none',
    //     });
    //   },
    // });
  },
  // 用户详情页
  onUserDetail(e) {
    const userId = e.currentTarget.dataset.id;
    wx.setStorageSync('defaultBabyId', userId);
    wx.switchTab({  url: `/pages/baby-setting/index` });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.queryBabyDetail();
  },
  async queryBabyDetail() {
    wx.showLoading({ title: '加载中...', mask: true });
    const resp = await util.request(api.GetBabyDetail, 'POST');
    const defaultId =  wx.getStorageSync('defaultBabyId');
    if (resp.errno === 0) {
      const formattedBabyList = (resp.data || []).map(item => ({
        ...item,
        description: getTimeDifference(item.baby_birth),
        isDefault: defaultId === item.id,
      }));
      this.setData({ babyList: formattedBabyList });
      wx.hideLoading();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
