// pages/baby-orders/index.js
import moment from 'moment';
// import { Texture } from 'XrFrame/kanata/lib/index';
var api = require('../../config/api.js');
var util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    currentDay: moment().format('MM-DD'),
    activeTab: 'today',
    dialogContent: '',
    dialogVisible: false,
    confirmBtn: { content: '知道了', variant: 'base' },
    drinkTotal: 0,
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
    const { activeTab } = this.data;
    const isToday = activeTab === 'today';
    util
      .request(
        api.BabyOrderList,
        {
          size: isToday ? 30 : this.data.pageSize,
          page: this.data.page,
          is_today: isToday,
        },
        'POST',
      )
      .then(res => {
        const orderInfo = res.data.babyList;
        isToday && this.calcDrinkAmount(orderInfo.data);
        const currentOrders = orderInfo.data.map(item => ({
          ...item,
          startTime: isToday ? this.formatTinyTimestamp(item.start_time) : this.formatTimestamp(item.start_time),
          image: this.filterIconArray(item.type),
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
  // 计算喝奶量
  calcDrinkAmount(records) {
    if (!records || records.length === 0) {
      return;
    }

    const milkOrders = records.filter(item => item.type.includes('milk'));
    const totalMilkAmount = milkOrders.reduce((prev, curr) => prev + curr.drink_amount, 0);
    this.setData({
      drinkTotal: totalMilkAmount,
    });
  },
  filterIconArray(action) {
    const imageArray = [];
    const imageMap = {
      milk: 'http://cdn.bajie.club/babycare/milk.svg',
      pee: 'http://cdn.bajie.club/babycare/pee.svg',
      shit: 'http://cdn.bajie.club/babycare/shit1.svg',
    };
    Object.keys(imageMap).forEach(item => {
      if (action.includes(item)) {
        imageArray.push(imageMap[item]);
      }
    });
    return imageArray;
  },

   /** 删除baby记录 */
   handleBabyOrderDelete(e) {
    var that = this;
    const recordId = e.currentTarget.dataset.record_id;
    wx.showModal({
      title: '提示',
      content: `确认删除该记录？`,
      success: operation => {
        if (operation.confirm) {
          util
            .request(
              api.DeleteBabyOrder,
              {
                record_id: recordId,
              },
              'POST',
            )
            .then(function () {
              that.getBabyOrder(true);
            });
        } else if (operation.cancel) {
          console.log('cancel');
        }
      },
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
  onTabsChange(event) {
    this.setData({
      activeTab: event.detail.value,
    });
    this.getBabyOrder(true);
  },
  onDialogShow(e) {
    const extraContent = e.currentTarget.dataset.extra;
    const { dialogVisible } = this.data;
    this.setData({
      dialogContent: extraContent,
      dialogVisible: !dialogVisible,
    })
  },
  onDialogClose() {
    const { dialogVisible } = this.data;
    this.setData({
      dialogVisible: !dialogVisible,
    })
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
    return moment.unix(timestamp).format('MM-DD HH:mm');
  },
  formatTinyTimestamp(timestamp) {
    return moment.unix(timestamp).format('HH:mm');
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
    this.setData({ page: 1 });
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
