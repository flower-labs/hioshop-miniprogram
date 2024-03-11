import * as echarts from '../../lib/ec-canvas/echarts';
import moment from 'moment';

const api = require('../../config/api.js');
const util = require('../../utils/util.js');

let chart = null;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  });
  canvas.setChart(chart);
  chart.setOption({});
  return chart;
}

// pages/baby-analysis/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart,
    },
    isLoading: false,
    analysisData: [],
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
      console.log('response', analysisList);
      this.setData({
        analysisData: analysisList,
      });

      const milkAmountByDate = {};
      analysisList.forEach(record => {
        if (record.type.includes('milk')) {
          const date = moment(record.start_time * 1000)
            .startOf('day')
            .format('MM-DD');
          console.log('date', date);
          if (!milkAmountByDate[date]) {
            milkAmountByDate[date] = 0;
          }
          milkAmountByDate[date] += record.drink_amount;
        }
      });

      console.log('milkAmountByDate', milkAmountByDate);
      const xAxisData = Object.keys(milkAmountByDate).reverse();
      const yAxisData = Object.values(milkAmountByDate).reverse();

      const newOption = {
        title: {
          text: '喝奶量统计',
          left:'center'     
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisTick: { show: false },
          axisLabel: {
            textStyle: { color: '#999999' },
            interval: 0,
          },
          axisLine: {
            lineStyle: { color: '#cccccc' },
          },
        },
        yAxis: {
          type: 'value',
          nameTextStyle: { color: '#666666' },
          axisTick: { show: false },
          axisLabel: { textStyle: { color: '#999999' } },
          axisLine: {
            lineStyle: { color: '#cccccc' },
            show: true,
          },
          splitLine: {
            show: true,
            lineStyle: { type: 'dashed' },
          },
        },
        series: [
          {
            data: yAxisData,
            type: 'bar',
            itemStyle: {
              normal: {
                barBorderRadius: [12, 12, 0, 0],
                label: {
                  show: true,
                  position: 'top',
                },
                color: function (params) {
                  var colorList = [
                    ['#5498ff', '#89d3f6'],
                    ['#0acd81', '#b7f5bf'],
                    ['#ff9137', '#ffd59a'],
                    ['#f97878', '#ffafaf'],
                  ];
                  var index = params.dataIndex;
                  if (params.dataIndex >= colorList.length) {
                    index = params.dataIndex - colorList.length;
                  }
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colorList[index][0] },
                    { offset: 1, color: colorList[index][1] },
                  ]);
                },
              },
            },
          },
        ],
      };
      this.setData({ isLoading: false });
      chart.setOption(newOption);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    setTimeout(function () {
      // 获取 chart 实例的方式
      // console.log(chart)
    }, 2000);
  },

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
