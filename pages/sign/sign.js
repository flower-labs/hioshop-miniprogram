// pages/sign/sign.js
const moment = require('moment');
const api = require('../../config/api.js');
const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    img1: 'https://tdesign.gtimg.com/miniprogram/images/example1.png',
    img2: 'https://tdesign.gtimg.com/miniprogram/images/example2.png',
    img3: 'https://tdesign.gtimg.com/miniprogram/images/example3.png',
    imageUrl: 'http://cdn.bajie.club/%E6%B4%97%E8%BD%A6%E5%B0%8F%E7%A8%8B%E5%BA%8F/gold-coin.jpg',
    checkPointList: [],
    isAddDisabled: false,
    sign_day: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  // 获取最近七天日期
  generateSignCalendar() {
    const yesterday = moment().subtract(1, 'days').startOf('day');
    const checkPointList = [];

    // 生成连续 7 天的时间戳
    for (let i = 0; i < 7; i++) {
      const timestamp = yesterday.clone().add(i, 'days').valueOf();
      let checkPointLable = '';
      if (i === 0) {
        checkPointLable = '昨天';
      } else if (i === 1) {
        checkPointLable = '今天';
      } else {
        checkPointLable = moment(timestamp).format('MM-DD');
      }
      checkPointList.push({
        timestamp,
        label: checkPointLable,
        isChecked: false,
      });
    }

    console.log('checkPointList', checkPointList);
    this.setData({
      checkPointList,
    });
  },
  querySignDetail() {
    util.request(api.CheckList).then(result => {
      const checkStatus = result.data.check_status;
      this.setData({
        isAddDisabled: checkStatus.today,
      });
      const processedPointList = this.data.checkPointList.map((item, index) => {
        if ((item.label === '今天' && checkStatus.today) || (item.label === '昨天' && checkStatus.yesterday)) {
          return {
            ...item,
            isChecked: true,
          };
        }
        return item;
      });
      this.setData({
        checkPointList: processedPointList,
      });
    });
  },
  
  onSignTap(e) {
    const currentTime = Math.floor(moment().valueOf() / 1000);
    util
      .request(
        api.AddNewCheck,
        {
          check_type: 'daily_check',
          points_amount: 10,
          check_time: currentTime,
        },
        'POST',
      )
      .then(result => {
        console.log('result', result);
        this.querySignDetail();
      });
    this.querySignDetail();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.generateSignCalendar();
    this.querySignDetail();
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
