// pages/lianxi/lianxi.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img1: 'https://tdesign.gtimg.com/miniprogram/images/example1.png',
        img2: 'https://tdesign.gtimg.com/miniprogram/images/example2.png',
        img3: 'https://tdesign.gtimg.com/miniprogram/images/example3.png',
        items: ["item1", "item2", "item3", "item4", "item5"],
        products: [{
            img: '/images/icon/chat.png',
            name: 'mao',
            price: 24
        }, {
            img: '/images/icon/footprint.png',
            name: 'mao',
            price: 24
        }, {
            img: '/images/icon/no-search.png',
            name: 'mao',
            price: 24
        }, {
            img: '/images/icon/chat.png',
            name: 'mao',
            price: 24
        }, {
            img: '/images/icon/footprint.png',
            name: 'mao',
            price: 24
        }, {
            img: '/images/icon/no-search.png',
            name: 'mao',
            price: 24
        }, {
            img: '/images/icon/no-search.png',
            name: 'mao',
            price: 24
        }],
        signed: [],  // 保存签到状态的数组，签到为 true，未签到为 false
        dates: []    // 保存日期的数组
    },
// 在 js 中定义 onSignTap 函数，用于处理签到事件
onSignTap: function(event) {
    const index = event.currentTarget.dataset.index;
    const signed = this.data.signed;
    // 如果已经签到了，不做任何处理
    if (signed[index]) {
      return;
    }
    // 签到成功，更新签到状态
    signed[index] = true;
    this.setData({
      signed: signed
    });
  },
 
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
          // 获取当前日期
  const today = new Date();
  // 初始化签到状态和日期数组
  const signed = [];
  const dates = [];
  for (let i = 0; i < 7; i++) {
    // 计算日期
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    dates.unshift(date);
    // 初始化签到状态为 false
    signed.unshift(false);
  }
  this.setData({
    signed: signed,
    dates: dates
  });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {


    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})