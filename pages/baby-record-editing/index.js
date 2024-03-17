// pages/baby-record-editing/index.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
import Message from 'tdesign-miniprogram/message/index';

const app = getApp();
Page({
  data: {
    type: '',
    uuid: '',
    drinkAmount: '',
    extra: '',
    editLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const babyRecord = app.globalData.editingBabyRecord;
    if (babyRecord) {
      this.setData({
        type: babyRecord.type.split(' '),
        drinkAmount: babyRecord.drink_amount,
        extra: babyRecord.extra,
        uuid: babyRecord.uuid,
      });
    }
  },
  handleBabyRecordEdit() {
    const babyForm = this.selectComponent('#baby-action');
    const { uuid } = this.data;
    const formData = babyForm.getCurrentFields();
    const { milkAmount, newAction, extra } = formData;
    console.log('key point', uuid ,milkAmount, newAction, extra);
    if (!uuid || newAction.length === 0) {
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
    this.setData({ editLoading: true });
    util
      .request(
        api.EditBabyRecord,
        {
          uuid,
          type: newAction.join(' '),
          drink_amount: numberMilkAmount || 0,
          extra,
        },
        'POST',
      )
      .then(res => {
        if (res.data.success) {
          babyForm.clearExtra();
          this.setData({ editLoading: false });
          Message.success({
            context: this,
            offset: [10, 32],
            duration: 5000,
            content: '编辑成功',
          });
          wx.navigateBack({});
        }
      });
  },
  handleCancel(){
    wx.navigateBack();
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
