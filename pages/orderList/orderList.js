Page({
  data: {
    currentTab: 0, // 当前选中的Tab索引
    statusTabs: [
      { name: "全部", value: -1 },
      { name: "待支付", value: 0 },
      { name: "已完成", value: 1 },
      { name: "已取消", value: 2 },
    ],
    orderList: [], // 订单列表数据
  },

  onLoad(options) {
    // 页面加载时获取数据，默认获取全部
    this.fetchOrderList(-1);
  },

  /**
   * 切换状态标签
   */
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    const statusValue = this.data.statusTabs[index].value;

    if (this.data.currentTab === index) return;

    this.setData({
      currentTab: index,
    });

    // 根据选中状态重新请求数据
    this.fetchOrderList(statusValue);
  },

  /**
   * 模拟获取订单列表
   * @param {Number} status - 订单状态筛选条件
   */
  fetchOrderList(status) {
    // 在实际项目中，这里应调用 wx.request 请求后端接口
    // 例如: wx.request({ url: '/api/orders', data: { status } })

    console.log(`正在获取状态为 ${status} 的订单...`);

    // 模拟延迟和数据
    setTimeout(() => {
      const mockData = [
        {
          id: "1001",
          courseName: "JavaScript 高级程序设计实战课",
          courseImage: "https://via.placeholder.com/150", // 替换为真实图片URL
          amount: "299.00",
          status: 0, // 0: 待支付
          statusText: "待支付",
        },
        {
          id: "1002",
          courseName: "Vue3.0 源码解析与最佳实践",
          courseImage: "https://via.placeholder.com/150",
          amount: "199.00",
          status: 1, // 1: 已完成
          statusText: "已完成",
        },
        {
          id: "1003",
          courseName: "Node.js 全栈开发入门",
          courseImage: "https://via.placeholder.com/150",
          amount: "99.00",
          status: 2, // 2: 已取消
          statusText: "已取消",
        },
      ];

      // 简单过滤模拟数据
      let filteredData = mockData;
      if (status !== -1) {
        filteredData = mockData.filter((item) => item.status === status);
      }

      this.setData({
        orderList: filteredData,
      });
    }, 300);
  },

  /**
   * 去支付
   */
  goToPay(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showToast({
      title: "发起支付: " + orderId,
      icon: "none",
    });
    // 实际逻辑：调用微信支付 API
    // wx.requestPayment({...})
  },

  /**
   * 查看详情
   */
  /**
   * 查看详情 - 优化版
   */
  goToDetail(e) {
    // 1. 获取订单ID
    const orderId = e.currentTarget.dataset.id;

    if (!orderId) {
      wx.showToast({
        title: "订单信息异常",
        icon: "none",
      });
      return;
    }

    // 2. 显示加载提示（可选，提升交互感）
    wx.showLoading({
      title: "加载中...",
      mask: true,
    });

    // 3. 跳转到详情页并传递ID
    wx.navigateTo({
      url: `/pages/detail/detail?id=${orderId}`,
      success: () => {
        // 跳转成功后关闭loading
        wx.hideLoading();
      },
      fail: (err) => {
        wx.hideLoading();
        console.error("跳转失败", err);
        wx.showToast({
          title: "页面跳转失败",
          icon: "none",
        });
      },
    });
  },

  /**
   * 申请退款
   */
  applyRefund(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确定要申请退款吗？",
      success: (res) => {
        if (res.confirm) {
          // 调用退款接口
          wx.showToast({
            title: "退款申请已提交",
            icon: "success",
          });
        }
      },
    });
  },
});
