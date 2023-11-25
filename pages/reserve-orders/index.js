// pages/reserve-orders/index.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 10,
    page: 1,
    hadMore: true,
    reserveOrderList: [],
    backTopVisible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  /** 获取订单列表 */
  getOrderCart(isRefresh = false) {
    console.log('isRefresh', isRefresh);
    let that = this;
    const statusArr = {
      1001: '待确认',
      1002: '已确认',
      1003: '服务中',
      1004: '待评价',
      1005: '已经评价',
      1006: '服务取消',
      1007: '服务关闭',
    };
    util
      .request(
        api.ReserveOrderList,
        {
          size: that.data.pageSize,
          page: that.data.page,
        },
        'POST',
      )
      .then(function (res) {
        const orderInfo = res.data.reserveOrderList;
        const currentOrders = orderInfo.data;
        const { currentPage, totalPages } = orderInfo;
        // 判断是否有更多数据
        that.setData({
          hadMore: currentPage < totalPages,
        });
        //循环接口数据进行时间戳转换
        for (var i = 0; i < currentOrders.length; i++) {
          currentOrders[i]['reserve_time'] = util.formatTimeNum(currentOrders[i]['reserve_time'], 'Y-M-D h:m:s');
          currentOrders[i]['status'] = statusArr[currentOrders[i]['status']];
        }
        const { reserveOrderList } = that.data;
        that.setData({
          reserveOrderList: isRefresh ? currentOrders : reserveOrderList.concat(currentOrders),
        });
        wx.stopPullDownRefresh();
      });
  },
  /** 加载更多 */
  handleLoadMore() {
    const { page } = this.data;
    this.setData({
      page: page + 1,
    });
    this.getOrderCart();
  },
  /** 取消预约 */
  cancelReserve(e) {
    var that = this;
    // 获取索引
    const orderId = e.currentTarget.dataset.order_id;
    wx.showModal({
      title: '提示',
      content: `确认删除ID为${orderId}的预约吗？`,
      success: operation => {
        if (operation.confirm) {
          util
            .request(
              api.CancelReservedOrder,
              {
                order_id: orderId,
              },
              'POST',
            )
            .then(function () {
              that.getOrderCart(true);
            });
        } else if (operation.cancel) {
          console.log('cancel');
        }
      },
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
    this.getOrderCart(true);
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
