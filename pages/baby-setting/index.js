// pages/baby-setting/index.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
import Message from 'tdesign-miniprogram/message/index';
import moment from 'moment';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    startTime: moment().format('HH:mm'),
    endTime: moment().add(15, 'minutes').format('HH:mm'),
    milkAmount: '',
    isCustomTime: false,
    extra: '',
    mode: '',
    addLoading: false,
    newAction: ['milk'],
    actionMap: [
      {
        key: 'milk',
        name: '喂奶',
        value: 'milk',
        image: 'http://cdn.bajie.club/babycare/milk.svg',
      },
      {
        key: 'pee',
        name: '嘘嘘',
        value: 'pee',
        image: 'http://cdn.bajie.club/babycare/pee.svg',
      },
      {
        key: 'shit',
        name: '拉粑粑',
        value: 'shit',
        image: 'http://cdn.bajie.club/babycare/shit1.svg',
      },
    ],
  },
  showPicker(e) {
    const { mode } = e.currentTarget.dataset;
    this.setData({
      mode: mode,
      [`${mode}Visible`]: true,
    });
  },
  hidePicker() {
    const { mode } = this.data;
    this.setData({
      [`${mode}Visible`]: false,
    });
  },
  onConfirm(e) {
    const { value } = e.detail;
    const { mode } = this.data;
    this.setData({
      [`${mode}Time`]: value,
    });
    this.hidePicker();
  },
  handleMilkInput: function (event) {
    this.setData({
      milkAmount: event.detail.value,
    });
  },
  handleCustomizeTime(e) {
    const { value } = e.detail;
    const newStart = moment().format('HH:mm');
    const newEnd = moment().add(15, 'minutes').format('HH:mm');
    const { startTime, endTime } = this.data;
    this.setData({
      isCustomTime: value,
      startTime: value ? newStart : startTime,
      endTime: value ? newEnd : endTime,
    });
  },
  onNewActionChange(e) {
    this.setData({ newAction: e.detail.value });
  },
  onExtraInput(e) {
    this.setData({
      extra: e.detail.value,
    });
  },
  showWarnMessage() {
    Message.warning({
      context: this,
      offset: [20, 32],
      duration: 3000,
      content: '喝奶量不正确，请检查',
    });
  },
  handleBabyRecordAdd() {
    const { extra, startTime, endTime, milkAmount, newAction, isCustomTime } = this.data;
    if (newAction.length === 0) {
      return;
    }
    const numberMilkAmount = parseInt(milkAmount);
    if (newAction.includes('milk') && (isNaN(numberMilkAmount) || !(numberMilkAmount < 1000 && numberMilkAmount > 1))) {
      this.showWarnMessage();
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
          this.setData({ addLoading: false, extra: '' });
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
    console.log('trigger');
    wx.navigateTo({
      url: '../../moduleAnalysis/pages/baby-analysis/index',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

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
