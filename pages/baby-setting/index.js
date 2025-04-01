// pages/baby-setting/index.js
import moment from 'moment';
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
import Message from 'tdesign-miniprogram/message/index';
import { queryBabyDetail } from './utils';

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addLoading: false,
    babyInfo: null,
  },
  handleViewDetail() {
    wx.showToast({
      title: '开发中，敬请期待',
      icon: 'none'
    });
  },
  handleBabyRecordAdd() {
    const babyForm = this.selectComponent('#baby-action');
    console.log('babyForm', babyForm);
    const formData = babyForm.getCurrentFields();
    const { extra, startTime, endTime, milkAmount, newAction, isCustomTime } = formData;
    if (newAction.length === 0) {
      return;
    }
    const numberMilkAmount = parseInt(milkAmount);
    if (newAction.includes('milk') && (isNaN(numberMilkAmount) || !(numberMilkAmount < 1000 && numberMilkAmount > 1))) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 3000,
        content: '喝奶量不正确，请检查',
      });
      return;
    }
    this.setData({ addLoading: true });
    util
      .request(
        api.AddBabyRecord,
        {
          type: newAction.join(' '),
          count: 1,
          extra,
          drink_amount: numberMilkAmount || 0,
          start_time: isCustomTime ? util.transferTimeToUnix(startTime) : moment().unix(),
          end_time: isCustomTime ? util.transferTimeToUnix(endTime) : moment().add(15, 'minutes').unix(),
        },
        'POST',
      )
      .then(res => {
        if (res.data.success) {
          babyForm.clearExtra();
          this.setData({ addLoading: false });
          Message.success({
            context: this,
            offset: [10, 32],
            duration: 5000,
            content: '添加成功',
          });
          wx.redirectTo({
            url: '/pages/baby-orders/index',
          });
        }
      });
  },
  redirectToAnalysis() {
    wx.navigateTo({
      url: '../../moduleAnalysis/pages/baby-analysis/index',
    });
  },

  triggerBabyInfoModify() {
    // 更新
    // util
    // .request(
    //   api.EditBabyDetail,
    //   {
    //     uuid: 'dc556c15-ae10-4059-ae2a-7f19f3794e30',
    //     baby_height: '80',
    //   },
    //   'POST',
    // )
    // .then(res => {
    //   console.log('res', res);
    // });
  },
  handleViewDetail() {
    wx.redirectTo({ url: '/pages/baby-infoCenter/index', });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    if (!app.globalData.globalLoading) {
      const userInfo = wx.getStorageSync('userInfo');
      const { babyInfo, hasInfo } = await queryBabyDetail();
      if (hasInfo) {
        this.setData({ babyInfo });
      } else {
        // 如果注册时间大于4月1日,执行强制跳转
        if (userInfo.register_time > 1743521412) {
          wx.redirectTo({ url: '/pages/baby-register/baby-register' });
        }
      }
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
