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
    addLoading: false,
  },
  handleBabyRecordAdd() {
    const babyForm = this.selectComponent('#baby-action');
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
    // 获取
    // util.request(api.GetBabyDetail, 'POST').then(res => {
    //   console.log('res', res);
    // });

    // 新增
    // util
    //   .request(
    //     api.AddBabyDetail,
    //     {
    //       baby_name: '刘星程',
    //       baby_sex: 'female',
    //       baby_birth: '2024-12-22',
    //       baby_height: '50',
    //       baby_weight: '6',
    //       baby_relation: '父亲',
    //       baby_blood_type: 'A',
    //       extra: 'demo extra info',
    //     },
    //     'POST',
    //   )
    //   .then(res => {
    //     console.log('res', res);
    //   });
    
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
