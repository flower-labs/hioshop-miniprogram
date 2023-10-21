// pages/gude/gude.js
// 引入地理位置 API
const QQMapWX = require("../../utils/qqmap-wx-jssdk.min.js");
const qqmapsdk = new QQMapWX({
  key: "CUXBZ-L3L6G-CGTQQ-Q5SUK-RVPBQ-MQFNH",
});

const util = require("../../utils/util.js");
const api = require("../../config/api.js");
const user = require("../../services/user.js");
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
    dis: 0,
    goodslist: [
      {
        goods_number: 100,
        list_pic_url: "http://cdn.bajie.club/%E6%B4%97%E8%BD%A6%E5%B0%8F%E7%A8%8B%E5%BA%8F/zhenpi.jpg",
        name: "真皮座椅",
        id: 1,
        title: "真皮座椅",
        retail_price: 1200,
      },
      {
        goods_number: 100,
        list_pic_url: "http://cdn.bajie.club/%E6%B4%97%E8%BD%A6%E5%B0%8F%E7%A8%8B%E5%BA%8F/qibeng.webp",
        name: "气泵",
        id: 2,
        title: "气泵",
        retail_price: 3500,
      },
      {
        goods_number: 100,
        list_pic_url: "http://cdn.bajie.club/%E6%B4%97%E8%BD%A6%E5%B0%8F%E7%A8%8B%E5%BA%8F/huohuasai.webp",
        name: "火花塞",
        id: 3,
        title: "火花塞",
        retail_price: 230,
      },
    ],
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
      phoneNumber: "13683626507",
    });
  },
  //计算距离
  getDis() {
    // 获取用户当前位置
    wx.getLocation({
      type: "gcj02", // 返回可用于wx.openLocation的坐标系类型
      success: function (res) {
        const userLatitude = res.latitude; // 用户纬度
        const userLongitude = res.longitude; // 用户经度

        // 获取商家位置（假设商家位置已知）
        const merchantLatitude = 30.551008; // 商家纬度
        const merchantLongitude = 114.508331; // 商家经度

        // 调用地理位置 API 计算距离
        qqmapsdk.calculateDistance({
          mode: "driving", // 计算方式：驾车
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
            console.log("距离：", distance);
            this.setdata({
              dis: distance,
            });
          },
          fail: function (res) {
            console.error("计算距离失败：", res);
          },
        });
      },
      fail: function (res) {
        console.error("获取位置失败：", res);
      },
    });
  },

  //跳转到预约API调用页面
  toReservePage() {
    wx.navigateTo({
      url: "/pages/reserve/index",
    });
  },
  //跳转到门店详情
  goto_gudeInfo() {
    wx.navigateTo({
      url: "/pages/gudeInfo1/gudeInfo1",
    });
  },
  //获取电话号码
  getPhoneNumber(e) {
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
      //用户点击拒绝
      wx.showToast({
        title: "请绑定手机号",
        duration: 5000,
        icon: "none",
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

  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      wx.stopPullDownRefresh();
      if (res.errno === 0) {
        that.setData({
          floorGoods: res.data.categoryList,
          banner: res.data.banner,
          channel: res.data.channel,
          notice: res.data.notice,
          loading: 1,
        });
        let cartGoodsCount = "";
        if (res.data.cartCount == 0) {
          wx.removeTabBarBadge({
            index: 2,
          });
        } else {
          cartGoodsCount = res.data.cartCount + "";
          wx.setTabBarBadge({
            index: 2,
            text: cartGoodsCount,
          });
        }
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
      url: "/pages/bonus/bonus",
    });
  },
  toSign() {
    wx.navigateTo({
      url: "/pages/sign/sign",
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("ok");
  },

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
  onPullDownRefresh() {
    this.getIndexData();
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
