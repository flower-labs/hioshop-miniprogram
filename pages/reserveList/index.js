// pages/reserveList/index.js
var api = require("../../config/api.js");
var util = require("../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    reserveOrderList: [],
    backTopVisible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  getOrderCart() {
    let that = this;
    const statusArr = {
      1001: "待确认",
      1002: "已确认",
      1003: "服务中",
      1004: "待评价",
      1005: "已经评价",
      1006: "服务取消",
      1007: "服务关闭",
    };
    util.request(api.ReserveOrderList).then(function (res) {
      console.log(res);
      //循环接口数据进行时间戳转换
      for (var i = 0; i < res.data.reserveOrderList.length; i++) {
        res.data.reserveOrderList[i]["reserve_time"] = util.formatTimeNum(
          res.data.reserveOrderList[i]["reserve_time"],
          "Y-M-D h:m:s",
        );
        res.data.reserveOrderList[i]["status"] = statusArr[res.data.reserveOrderList[i]["status"]];
      }
      wx.stopPullDownRefresh();
      that.setData({
        reserveOrderList: res.data.reserveOrderList,
      });
      //循环接口数据进行状态转换
    });
  },
  /** 取消预约 */
  cancelReserve(e) {
    var that = this;
    // 获取索引
    const orderId = e.currentTarget.dataset.order_id;
    util.request(api.CancelReservedOrder, {
        order_id: orderId
    },'POST').then(function (res) {
        console.log(res);
        that.getOrderCart();
    });
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  onPageScroll(e) {
    const { scrollTop } = e;
    this.setData({
      backTopVisible: scrollTop > 200,
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getOrderCart();
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
    this.getOrderCart();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
