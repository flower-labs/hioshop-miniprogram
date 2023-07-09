// pages/reserve/index.js
var api = require("../../config/api.js");
var util = require("../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    note: "",
    reseveList: [],
    highLightItem:-1,
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
  onShow() {
    this.getReserveList();
  },

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
  onPullDownRefresh() {
    this.getReserveList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  handleCalendar() {
    this.setData({ visible: true });
  },
  handleConfirm(e) {
    const { value } = e.detail;
    const format = (val) => {
      const date = new Date(val);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    this.setData({
      note: format(value),
    });
  },
  onClose({ detail }) {
    console.log(detail.trigger);
  },

  getReserveList: function () {
    console.log("running");
    let that = this;
    util.request(api.ReserveList).then(function (res) {
      console.log(res);
      that.setData({
        reseveList: res.data.reserveList,
        highLightItem: res.data.reserveList.filter(item=>item.id=== 1008603)[0].name
      });
    });
  },
});
