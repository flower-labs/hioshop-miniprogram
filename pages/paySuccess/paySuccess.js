// pages/paySuccess/paySuccess.js
Page({
  data: {
    orderNo: "20240815001", // 订单号
    courseName: "Python入门基础课", // 课程名称
    payAmount: "99.00", // 支付金额
    payTime: "2024-08-15 14:30", // 支付时间
  },

  onLoad(options) {
    // 这里可以接收上一页传递的参数，例如 orderId
    if (options.orderId) {
      this.fetchOrderDetail(options.orderId);
    }
  },

  /**
   * 获取订单详情（模拟）
   */
  fetchOrderDetail(orderId) {
    // 实际开发中应调用后端接口
    console.log("获取订单详情:", orderId);
    // 假设请求成功，更新数据
    this.setData({
      orderNo: orderId,
      courseName: "Python入门基础课",
      payAmount: "99.00",
      payTime: "2024-08-15 14:30",
    });
  },

  /**
   * 点击查看订单
   */
  goToOrderDetail() {
    wx.navigateTo({
      url: "/pages/orderList/orderList?id=" + this.data.orderNo,
    });
  },

  /**
   * 点击立即学习
   */
  startLearning() {
    wx.switchTab({
      url: "/pages/study/study",
    });
  },
});
