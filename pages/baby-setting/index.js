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
    drinkAmout: 120,
    startTime: moment().format('HH:mm'),
    endTime: moment().add(15, 'minutes').format('HH:mm'),
    amoutError: false,
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
    console.log('show picker', mode);
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
    console.log('value', value, mode);
    this.setData({
      [`${mode}Time`]: value,
    });

    this.hidePicker();
  },

  onAmountInput(e) {
    const { amoutError } = this.data;
    const isNumber = /^\d+$/.test(e.detail.value);
    if (amoutError === isNumber) {
      this.setData({
        amoutError: !isNumber,
      });
    } else {
      this.setData({
        drinkAmout: e.detail.value,
      });
    }
  },

  onNewActionChange(e) {
    this.setData({ newAction: e.detail.value });
  },

  onExtraInput(e) {
    console.log('e', e);
    this.setData({
      extra: e.detail.value,
    });
  },

  handleBabyRecordAdd() {
    const { extra, drinkAmout, startTime, endTime, newAction } = this.data;
    if (newAction.length === 0) {
      return;
    }
    this.setData({ addLoading: true });
    console.log('start end', startTime, endTime);
    util
      .request(
        api.AddBabyRecord,
        {
          type: newAction.join(' '),
          count: 1,
          extra,
          drink_amount: drinkAmout,
          start_time: util.transferTimeToUnix(startTime),
          end_time: util.transferTimeToUnix(endTime),
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

  onColumnChange(e) {
    console.log('pick', e.detail.value);
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
