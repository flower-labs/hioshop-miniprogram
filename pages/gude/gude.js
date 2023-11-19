// pages/gude/gude.js
// 引入地理位置 API
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({
  key: 'TOGBZ-ZOFWL-FO7PE-M3557-NEA2J-LGBPK',
});

const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
//获取应用实例
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    autoplay: false,
    duration: 500,
    interval: 5000,
    swiperList: [`${api.CDN_URL}/main-4.jpg`, `${api.CDN_URL}/main-2.jpg`, `${api.CDN_URL}/main-3.webp`],
    userInfo: {},
    current: 0,
    autoplay: false,
    duration: 500,
    interval: 5000,
    // 通知列表
    noticeList: [],
    // 是否显示通知
    noticeVisible: 0,
    dis: 0,
    floorGoods: [],
    index_banner_img: 0,
  },

  // 获取用户地理位置
  mapViewTap: function () {
    wx.openLocation({
      latitude: 30.551008,
      longitude: 114.508331,
      scale: 28,
    });
  },

  homePhoneCall: () => {
    wx.makePhoneCall({
      phoneNumber: '13683626507',
    });
  },
  //计算距离
  getDis() {
    // 获取用户当前位置
    wx.getLocation({
      type: 'gcj02', // 返回可用于wx.openLocation的坐标系类型
      success: function (res) {
        const userLatitude = res.latitude; // 用户纬度
        const userLongitude = res.longitude; // 用户经度

        // 获取商家位置（假设商家位置已知）
        const merchantLatitude = 30.551008; // 商家纬度
        const merchantLongitude = 114.508331; // 商家经度

        // 调用地理位置 API 计算距离
        qqmapsdk.calculateDistance({
          mode: 'driving', // 计算方式：驾车
          from: {
            latitude: userLatitude,
            longitude: userLongitude,
          },
          to: [
            {
              latitude: merchantLatitude,
              longitude: merchantLongitude,
            },
          ],
          success: function (res) {
            const distance = res.result.elements[0].distance; // 距离，单位：米
            console.log('距离：', distance);
            this.setdata({
              dis: distance,
            });
          },
          fail: function (res) {
            console.error('计算距离失败：', res);
          },
        });
      },
      fail: function (res) {
        console.error('获取位置失败：', res);
      },
    });
  },

  //跳转到预约API调用页面
  toReservePage() {
    wx.navigateTo({
      url: '/pages/reserve/index',
    });
  },
  //跳转到门店详情
  goto_gudeInfo() {
    wx.navigateTo({
      url: '/pages/gude-detail/index',
    });
  },
  //获取电话号码
  getPhoneNumber(e) {
    var that = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      //用户点击拒绝
      wx.showToast({
        title: '请绑定手机号',
        duration: 5000,
        icon: 'none',
      });
    } else {
    }
  },

  onChange(e) {
    const {
      detail: { current, source },
    } = e;
    console.log(current, source);
  },
  goCategory: function (e) {
    let id = e.currentTarget.dataset.cateid;
    wx.setStorageSync('categoryId', id);
    wx.switchTab({
      url: '/pages/category/index',
    });
  },
  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      wx.stopPullDownRefresh();
      if (res.errno === 0) {
        that.setData({
          floorGoods: res.data.categoryList,
          banner: res.data.banner,
          channel: res.data.channel,
          noticeList: res.data.notice,
          loading: 1,
        });
        let cartGoodsCount = '';
        if (res.data.cartCount == 0) {
          wx.removeTabBarBadge({
            index: 2,
          });
        } else {
          cartGoodsCount = res.data.cartCount + '';
          wx.setTabBarBadge({
            index: 2,
            text: cartGoodsCount,
          });
        }
      }
    });
  },
  getChannelShowInfo: function (e) {
    let that = this;
    util.request(api.ShowSettings).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          index_banner_img: res.data.index_banner_img,
          noticeVisible: res.data.notice,
        });
      }
    });
  },
  onChange(e) {
    const {
      detail: { current, source },
    } = e;
    console.log(current, source);
  },
  toBonus() {
    wx.navigateTo({
      url: '/pages/bonus/bonus',
    });
  },
  toSign() {
    wx.navigateTo({
      url: '/pages/sign/sign',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getChannelShowInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getIndexData();
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
    this.getIndexData();
    this.getChannelShowInfo()
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
