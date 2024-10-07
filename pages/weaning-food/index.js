// pages/weaning-food/index.js
import moment from 'moment';
import Message from 'tdesign-miniprogram/message/index';
var api = require('../../config/api.js');
var util = require('../../utils/util.js');

Page({
  data: {
    dateVisible: false,
    addLoading: false,
    recommendedFoods: ['大米', '面条', '牛肉', '猪肉', '鸡肉', '鱼肉', '香蕉', '橙子', '苹果', '紫薯'],
    startTime: '2024-01-01 00:00:00', // 指定选择区间起始值
    maxEndTime: moment().format('YYYY-MM-DD HH:mm'), //开始时间最大可选当前
    weaningName: '',
    weaningTime: moment().format('YYYY-MM-DD HH:mm'),
    weaningAmout: '',
    extra: '',
  },

  showPicker() {
    this.setData({ dateVisible: true });
  },
  hidePicker() {
    this.setData({ dateVisible: false });
  },

  onDateConfirm(e) {
    const { value } = e.detail;
    this.setData({ weaningTime: value });
    this.hidePicker();
  },
  hanleNameInput: function (event) {
    this.setData({ weaningName: event.detail.value });
  },
  handleAmoutInput(event) {
    this.setData({ weaningAmout: event.detail.value });
  },
  handleExtraInput(e) {
    this.setData({ extra: e.detail.value });
  },
  hanleNameClear() {
    this.setData({ weaningName: '' });
  },
  handleTagClick: function (event) {
    const { name } = event.target.dataset;
    const { weaningName } = this.data;
    if (name) {
      let newName = '';
      if (weaningName) {
        newName = `${weaningName}, ${name}`;
      } else {
        newName = name;
      }
      if (newName.length <= 20) {
        this.setData({ weaningName: newName });
      }
    }
  },
  handleWeaningSubmit() {
    console.log('trigger');
    this.setData({ addLoading: true });
    const { weaningName, weaningAmout, weaningTime, extra } = this.data;
    util
      .request(
        api.AddBabyRecord,
        {
          type: `weaning-food`,
          record_name: weaningName,
          drink_amount: Number(weaningAmout) || 0,
          start_time: util.transferTimeToUnix(weaningTime),
          end_time: util.transferTimeToUnix(weaningTime),
          count: 1,
          extra,
        },
        'POST',
      )
      .then(res => {
        if (res.data.success) {
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
