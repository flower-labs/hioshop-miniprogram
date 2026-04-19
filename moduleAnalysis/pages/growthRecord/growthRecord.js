// pages/growthRecord/growthRecord.ts
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
const moment = require('moment');

import * as echarts from '../../lib/ec-canvas/echarts';
// 当为let定义才能修改全局变量
let heightChart = '';
let weightChart = '';
// 身高图表初始化
function initChart(canvas, width, height, dpr, type, data) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr,
  });
  if (type === 'height') {
    heightChart = chart;
  } else {
    weightChart = chart;
  }
  canvas.setChart(chart);
  const dates = data.map(item => item.date);
  const values = data.map(item => (type === 'height' ? item.height : item.weight));

  const option = {
    title: {
      text: type === 'height' ? '身高增长曲线' : '体重增长曲线',
      left: 'center',
      textStyle: {
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: `{b}：{c} ${type === 'height' ? 'cm' : 'kg'}`,
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLabel: {
        rotate: 30,
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      name: type === 'height' ? '身高 (cm)' : '体重 (kg)',
      min: function (value) {
        return value.min - (type === 'height' ? 5 : 1);
      },
    },
    series: [
      {
        data: values,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        itemStyle: {
          color: type === 'height' ? '#07c160' : '#1890ff',
        },
      },
    ],
  };

  chart.setOption(option);
  return chart;
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShowDialog: false, // 控制弹窗显示/隐藏
    today: '', // 今天的日期
    // 表单数据
    formData: {
      date: '', // 选中的日期
      height: '', // 输入的身高
      weight: '', // 输入的体重
    },
    currentTab: 0, // 当前激活的标签索引
    timeFilter: 'all', // 时间筛选条件
    growthRecords: [], // 生长记录数据
    latestHeight: 0, // 最新身高
    latestWeight: 0, // 最新体重
    avgHeightGrowth: 0, // 平均身高增长
    maxHeightGrowth: 0, // 最大身高增长
    avgWeightGrowth: 0, // 平均体重增长
    maxWeightGrowth: 0, // 最大体重增长
    // 图表配置
    heightChartOption: {
      onInit: () => {},
    },
    weightChartOption: {
      onInit: () => {},
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 使用 moment 初始化今天的日期
    const today = moment().format('YYYY-MM-DD');
    this.setData({
      today,
      'formData.date': today,
    });

    // 获取后端生长记录
    this.fetchBabyData();

    // 计算统计数据
    this.calculateStats();
  },
  // 获取后端数据
  async fetchBabyData() {
    const defaultBabyId = wx.getStorageSync('defaultBabyId');
    // 显示loading
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    try {
      const res = await util.request(
        api.ListBabyBodyRecord,
        { baby_id: defaultBabyId },
        'post',
      );
      if (res.errno == 0) {
        const tempBabyData = (res.data.list || []).map(item => ({
          id: item.id,
          baby_id: item.baby_id,
          weight: item.weight,
          height: item.height,
          date: item.measure_date.split(' ')[0],
        }));
        this.setData({
          growthRecords: tempBabyData,
          latestHeight: tempBabyData[tempBabyData.length - 1]?.height,
          latestWeight: tempBabyData[tempBabyData.length - 1]?.weight,
        });
        console.log(this.data.growthRecords);
      }
    } catch (err) {
      console.error('获取生长记录失败：', err);
      wx.showToast({
        title: '数据加载失败',
        icon: 'none',
      });
    } finally {
      // 无论成功或失败，都隐藏loading
      wx.hideLoading();
      // 刷新图表
      this.initCharts();
    }
  },

  // 初始化图表
  initCharts() {
    const { growthRecords } = this.data;
    this.setData({
      heightChartOption: {
        onInit: (canvas, width, height, dpr) => {
          return initChart(canvas, width, height, dpr, 'height', growthRecords);
        },
      },
      weightChartOption: {
        onInit: (canvas, width, height, dpr) => {
          return initChart(canvas, width, height, dpr, 'weight', growthRecords);
        },
      },
    });
  },
  // 计算统计数据
  calculateStats() {
    const { growthRecords } = this.data;
    if (growthRecords.length < 2) return;

    // 计算身高统计数据
    let heightDiffs = [];
    for (let i = 1; i < growthRecords.length; i++) {
      const diff = parseFloat(growthRecords[i].height) - parseFloat(growthRecords[i - 1].height);
      heightDiffs.push(diff);
    }
    const avgHeight =
      heightDiffs.length > 0 ? (heightDiffs.reduce((a, b) => a + b, 0) / heightDiffs.length).toFixed(2) : 0;
    const maxHeight = heightDiffs.length > 0 ? Math.max(...heightDiffs).toFixed(1) : 0;

    // 计算体重统计数据
    let weightDiffs = [];
    for (let i = 1; i < growthRecords.length; i++) {
      const diff = parseFloat(growthRecords[i].weight) - parseFloat(growthRecords[i - 1].weight);
      weightDiffs.push(diff);
    }
    const avgWeight =
      weightDiffs.length > 0 ? (weightDiffs.reduce((a, b) => a + b, 0) / weightDiffs.length).toFixed(2) : 0;
    const maxWeight = weightDiffs.length > 0 ? Math.max(...weightDiffs).toFixed(1) : 0;

    this.setData({
      avgHeightGrowth: avgHeight,
      maxHeightGrowth: maxHeight,
      avgWeightGrowth: avgWeight,
      maxWeightGrowth: maxWeight,
    });
  },

  // 点击标签切换
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData(
      {
        currentTab: index,
      },
      () => {
        // 如果切换到图表页面，更新图表数据
        if (index == 1) {
          this.updateHeightChart();
        } else if (index == 2) {
          this.updateWeightChart();
        }
      },
    );
  },

  // 滑动swiper切换标签
  swiperChange(e) {
    this.setData(
      {
        currentTab: e.detail.current,
      },
      () => {
        // 如果切换到图表页面，更新图表数据
        if (this.data.currentTab === 1 && this.heightChart) {
          this.updateHeightChart();
        } else if (this.data.currentTab === 2 && this.weightChart) {
          this.updateWeightChart();
        }
      },
    );
  },

  // 设置时间筛选条件
  setTimeFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    console.log(filter);
    this.setData(
      {
        timeFilter: filter,
      },
      () => {
        // 更新当前显示的图表
        if (this.data.currentTab == 1) {
          this.updateHeightChart();
        } else if (this.data.currentTab == 2) {
          this.updateWeightChart();
        }
      },
    );
  },

  // 获取筛选后的数据
  getFilteredData() {
    const { growthRecords, timeFilter } = this.data;
    if (timeFilter === 'all') return growthRecords;

    // 计算时间范围
    const today = new Date();
    let monthsToSubtract = 0;

    switch (timeFilter) {
      case 'month':
        monthsToSubtract = 1;
        break;
      case '3months':
        monthsToSubtract = 3;
        break;
      case '6months':
        monthsToSubtract = 6;
        break;
      case 'year':
        monthsToSubtract = 12;
        break;
    }

    const filterDate = new Date();
    filterDate.setMonth(today.getMonth() - monthsToSubtract);

    // 筛选数据
    return growthRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= filterDate;
    });
  },

  // 更新身高图表
  updateHeightChart() {
    const filteredData = this.getFilteredData();
    console.log(filteredData);
    if (!filteredData || filteredData.length == 0) return;
    // 准备图表数据
    const dates = filteredData.map(item => item.date);
    const heights = filteredData.map(item => parseFloat(item.height));
    // 配置图表
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333',
        },
        formatter: function (params) {
          return `${params[0].name}<br/>身高: ${params[0].value} cm`;
        },
      },
      grid: {
        left: '6%',
        right: '4%',
        bottom: '15%',
        top: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,

        axisLabel: {
          interval: Math.ceil(dates.length / 6), // 控制x轴标签显示数量
          rotate: 45,
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#f',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '身高 (cm)',
        nameTextStyle: {
          fontSize: 12,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
          },
        },
        min: Math.floor(Math.min(...heights) - 2),
        max: Math.ceil(Math.max(...heights) + 2),
      },
      series: [
        {
          data: heights,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#3478f6',
          },
          itemStyle: {
            color: '#3478f6',
            borderWidth: 2,
            borderColor: '#fff',
          },
          emphasis: {
            itemStyle: {
              symbolSize: 8,
            },
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 3, [
              {
                offset: 0,
                color: 'rgba(52, 120, 246, 0.2)',
              },
              {
                offset: 1,
                color: 'rgba(52, 120, 246, 0)',
              },
            ]),
          },
        },
      ],
    };
    heightChart.setOption(option);
  },

  // 更新体重图表
  updateWeightChart() {
    const filteredData = this.getFilteredData();
    if (!filteredData || filteredData.length === 0) return;

    // 准备图表数据
    const dates = filteredData.map(item => item.date);
    const weights = filteredData.map(item => parseFloat(item.weight));

    // 配置图表
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333',
        },
        formatter: function (params) {
          return `${params[0].name}<br/>体重: ${params[0].value} kg`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          interval: Math.ceil(dates.length / 6), // 控制x轴标签显示数量
          rotate: 30,
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#eee',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '体重 (kg)',
        nameTextStyle: {
          fontSize: 12,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
          },
        },
        min: Math.floor(Math.min(...weights) - 1),
        max: Math.ceil(Math.max(...weights) + 1),
      },
      series: [
        {
          data: weights,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#f67a34',
          },
          itemStyle: {
            color: '#f67a34',
            borderWidth: 2,
            borderColor: '#fff',
          },
          emphasis: {
            itemStyle: {
              symbolSize: 8,
            },
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(246, 122, 52, 0.2)',
              },
              {
                offset: 1,
                color: 'rgba(246, 122, 52, 0)',
              },
            ]),
          },
        },
      ],
    };

    weightChart.setOption(option);
  },
  // 表单输入事件
  onDateChange(e) {
    this.setData({
      'formData.date': e.detail.value,
    });
  },
  onHeightInput(e) {
    this.setData({
      'formData.height': e.detail.value,
    });
    console.log(this.data.formData.height);
  },
  onWeightInput(e) {
    this.setData({
      'formData.weight': e.detail.value,
    });
    console.log(this.data.formData.weight);
  },
  //删除数据
  async handleDelete(e) {
    // 获取页面传递的id
    const deleteId = e.currentTarget.dataset.id;
    console.log(deleteId);
    if (!deleteId) {
      wx.showToast({
        title: '数据ID异常',
        icon: 'none',
      });
      return;
    }
    // 二次确认
    const { confirm } = await wx.showModal({
      title: '确认删除',
      content: '是否确定删除该条数据？删除后不可恢复',
    });
    if (confirm) {
      // 用户确认删除，调用删除接口
      await this.deleteData(deleteId);
    }
  },
  //调用删除接口
  async deleteData(id) {
    const defaultBabyId = wx.getStorageSync('defaultBabyId');
    try {
      const res = await util.request(
        api.DeleteBabyBodyRecord,
        { id: id, baby_id: defaultBabyId },
        'post',
      );
      console.log(res);
    } catch (err) {
      console.error('删除记录失败：', err);
      wx.showToast({ title: '删除失败', icon: 'none' });
    }
    // 刷新数据和图表
    await this.fetchBabyData();
  },
  // 添加新记录
  async submitData() {
    const { height, weight, date } = this.data.formData;
    // 1. 表单验证
    if (!height || !weight) {
      wx.showToast({ title: '请输入身高和体重', icon: 'none' });
      return;
    }
    if (isNaN(height) || isNaN(weight)) {
      wx.showToast({ title: '请输入有效数字', icon: 'none' });
      return;
    }
    // 2. 使用 moment 格式化测量时间（基于用户选择的日期 + 当前时分秒）
    const measureDate = moment(date)
      .hour(moment().hour())
      .minute(moment().minute())
      .second(moment().second())
      .format('YYYY-MM-DD HH:mm:ss');

    const defaultBabyId = wx.getStorageSync('defaultBabyId');
    // 3. 提交到后端
    wx.showLoading({ title: '提交中...', mask: true });
    try {
      const res = await util.request(
        api.AddBabyBodyRecord,
        {
          baby_id: defaultBabyId,
          weight: weight,
          height: height,
          measure_date: measureDate,
        },
        'post',
      );
      if (res.errno == 0) {
        wx.showToast({ title: '添加成功', icon: 'success' });
        this.hideDialog();
        // 刷新数据
        await this.fetchBabyData();
      } else {
        wx.showToast({ title: res.errmsg || '添加失败', icon: 'none' });
      }
    } catch (err) {
      console.error('提交记录失败：', err);
      wx.showToast({ title: '网络异常，请重试', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },
  // 显示弹窗
  addNewRecord() {
    this.setData({
      isShowDialog: true,
      // 重置表单数据
      'formData.date': moment().format('YYYY-MM-DD'),
      'formData.height': '',
      'formData.weight': '',
    });
  },

  // 隐藏弹窗
  hideDialog() {
    this.setData({
      isShowDialog: false,
    });
  },
  // 阻止事件冒泡（空函数）
  preventBubble() {},
  // 记录列表下拉刷新
  async onListRefresh() {
    this.setData({ isRefreshing: true });
    const defaultBabyId = wx.getStorageSync('defaultBabyId');
    try {
      const res = await util.request(
        api.ListBabyBodyRecord,
        { baby_id: defaultBabyId },
        'post',
      );
      if (res.errno == 0) {
        const tempBabyData = res.data.list.map(item => ({
          id: item.id,
          baby_id: item.baby_id,
          weight: item.weight,
          height: item.height,
          date: item.measure_date.split(' ')[0],
        }));
        this.setData({
          growthRecords: tempBabyData,
          latestHeight: tempBabyData[tempBabyData.length - 1]?.height,
          latestWeight: tempBabyData[tempBabyData.length - 1]?.weight,
        });
      }
    } catch (err) {
      console.error('刷新数据失败：', err);
      wx.showToast({ title: '刷新失败', icon: 'none' });
    } finally {
      this.setData({ isRefreshing: false });
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
  onShareAppMessage() {},
});
