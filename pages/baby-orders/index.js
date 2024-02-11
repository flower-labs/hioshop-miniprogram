// pages/baby-orders/index.js
import moment from 'moment';
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
  /** 获取baby记录列表 */
  getBabyOrder(isRefresh = false) {
    util
      .request(
        api.BabyOrderList,
        {
          size: this.data.pageSize,
          page: this.data.page,
        },
        'POST',
      )
      .then(res => {
        const orderInfo = res.data.babyList;
        const currentOrders = orderInfo.data.map(item => ({
          ...item,
          startTime: this.formatTimestamp(item.start_time),
          endTime: this.formatTimestamp(item.end_time),
          createTime: this.formatTimestamp(item.create_time),
        }));
        const { currentPage, totalPages } = orderInfo;
        // 判断是否有更多数据
        this.setData({
          hadMore: currentPage < totalPages,
        });
        //循环接口数据进行时间戳转换
        const { reserveOrderList } = this.data;

        this.setData({
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
    this.getBabyOrder();
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
    this.getBabyOrder();
  },
  formatTimestamp(timestamp) {
    return moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');
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
    this.getBabyOrder(true);
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
