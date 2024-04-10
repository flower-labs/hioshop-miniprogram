import * as echarts from './ec-canvas/echarts';
import moment from 'moment';
import { generateOptions } from './utils';

const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');

let analysisChart = null;

function initChart(canvas, width, height, dpr) {
  analysisChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  });
  canvas.setChart(analysisChart);
  analysisChart.setOption({});
  return analysisChart;
}

// pages/baby-analysis/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ecMilkBar: {
      onInit: initChart,
    },
    isLoading: false,
    analysisData: [],
    milkOption: null,
    shitOption: null,
    peeOption: null,
    tabValue: 'milk',
    tabList: [
      { value: 'milk', label: '喝奶量' },
      { value: 'pee', label: '尿尿' },
      { value: 'shit', label: '拉粑粑' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBabyOrder();
  },

  getBabyOrder() {
    this.setData({ isLoading: true });
    util.request(api.BabyAnalysis, { duration: 6 }, 'POST').then(response => {
      const analysisList = response.data.babyAnalysisList;
      this.setData({
        analysisData: analysisList,
      });

      const milkAmountByDate = {};
      const shitTimeByDate = {};
      const peeTimeByDate = {};
      analysisList.forEach(record => {
        const date = moment(record.start_time * 1000)
          .startOf('day')
          .format('MM-DD');

        if (!milkAmountByDate[date]) {
          milkAmountByDate[date] = 0;
        }

        if (!shitTimeByDate[date]) {
          shitTimeByDate[date] = 0;
        }
        if (!peeTimeByDate[date]) {
          peeTimeByDate[date] = 0;
        }

        if (record.type.includes('milk')) {
          milkAmountByDate[date] += record.drink_amount;
        }
        if (record.type.includes('shit')) {
          shitTimeByDate[date] += 1;
        }
        if (record.type.includes('pee')) {
          peeTimeByDate[date] += 1;
        }
      });

      const xAxisData = Object.keys(milkAmountByDate).reverse();
      const milkYAxisData = Object.values(milkAmountByDate).reverse();
      const shitYAxisData = Object.values(shitTimeByDate).reverse();
      const peeYAxisData = Object.values(peeTimeByDate).reverse();

      const milkOption = generateOptions('喝奶量统计', xAxisData, milkYAxisData);
      const shitOption = generateOptions('拉粑粑统计', xAxisData, shitYAxisData);
      const peeOption = generateOptions('尿尿统计', xAxisData, peeYAxisData);
      this.setData({ milkOption, shitOption, peeOption });
      setTimeout(() => {
        this.setData({ isLoading: false });
        analysisChart.setOption(milkOption);
      }, 500);
    });
  },

  onChange(e) {
    const currentTab = e.detail.value;
    this.setData({
      tabValue: currentTab,
    });
    if (currentTab === 'milk') {
      analysisChart.setOption(this.data.milkOption);
    } else if (currentTab === 'shit') {
      analysisChart.setOption(this.data.shitOption);
    } else if (currentTab === 'pee') {
      analysisChart.setOption(this.data.peeOption);
    }
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
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '欢迎使用古德小程序',
      path: '/pages/baby-analysis/index',
      success: function () {},
      fail: function () {},
    };
  },
});
