// pages/orderCart/orderCart.js
var api = require("../../config/api.js");
var util = require("../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    reserveOrderList: [],
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
      that.setData({
        reserveOrderList: res.data.reserveOrderList,
      });
      //循环接口数据进行状态转换
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

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
