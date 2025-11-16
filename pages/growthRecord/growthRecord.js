// pages/growthRecord/growthRecord.ts
import * as echarts from '../../lib/ec-canvas/echarts';
// 当为let定义才能修改全局变量
let heightChart='';
let weightChart='';
// 身高图表初始化
function initChart(canvas, width, height, dpr, type, data) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  if (type === 'height') { 
    heightChart=chart;
  } else {
    weightChart=chart;
  };
  canvas.setChart(chart);
  const dates = data.map(item => item.date);
  const values = data.map(item => type === 'height' ? item.height : item.weight);

  const option = {
    title: {
      text: type === 'height' ? '身高增长曲线' : '体重增长曲线',
      left: 'center',
      textStyle: { fontSize: 14 }
    },
    tooltip: {
      trigger: 'axis',
      formatter: `{b}：{c} ${type === 'height' ? 'cm' : 'kg'}`
    },
    grid: { left: '5%', right: '5%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLabel: { rotate: 30, fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      name: type === 'height' ? '身高 (cm)' : '体重 (kg)',
      min: function (value) {
        return value.min - (type === 'height' ? 5 : 1);
      }
    },
    series: [{
      data: values,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      itemStyle: { color: type === 'height' ? '#07c160' : '#1890ff' }
    }]
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
      weight: '' // 输入的体重
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
    heightChartOption: { onInit: () => { } },
    weightChartOption: { onInit: () => { } },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 初始化今天的日期
    const today = this.formatDate(new Date());
    this.setData({
      today,
      'formData.date': today // 表单默认日期为今天
    });
    // 初始化模拟数据
    this.initMockData();

    // 计算统计数据
    this.calculateStats();
  },
  // 格式化日期为 yyyy-mm-dd
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  // 初始化模拟生长记录数据
  initMockData() {
    // 生成过去12个月的模拟数据
    const records = [];
    const today = new Date();
    let baseHeight = 120; // 初始身高
    let baseWeight = 20; // 初始体重

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      date.setDate(Math.floor(Math.random() * 28) + 1);

      // 随机生成身高和体重增长
      baseHeight += Math.random() * 1.5 + 0.5; // 每月增长0.5-2cm
      baseWeight += Math.random() * 0.6 + 0.2; // 每月增长0.2-0.8kg

      records.push({
        date: `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
        height: baseHeight.toFixed(1),
        weight: baseWeight.toFixed(1),
      });
    }

    this.setData({
      growthRecords: records,
      latestHeight: records[records.length - 1].height,
      latestWeight: records[records.length - 1].weight,
    });
    // 刷新图表
    this.initCharts();
  },
  // 初始化图表
  initCharts() {
    const { growthRecords } = this.data;
    this.setData({
      heightChartOption: {
        onInit: (canvas, width, height, dpr) => {
          return initChart(canvas, width, height, dpr, 'height', growthRecords);
        }
      },
      weightChartOption: {
        onInit: (canvas, width, height, dpr) => {
          return initChart(canvas, width, height, dpr, 'weight', growthRecords);
        }
      }
    });
  },
  // 计算统计数据
  calculateStats() {
    const {
      growthRecords
    } = this.data;
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
    this.setData({
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
    this.setData({
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
    console.log(filter)
    this.setData({
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
    const {
      growthRecords,
      timeFilter
    } = this.data;
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
          color: '#333'
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
      series: [{
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
          color: new echarts.graphic.LinearGradient(0, 0, 0, 3, [{
            offset: 0,
            color: 'rgba(52, 120, 246, 0.2)'
          },
          {
            offset: 1,
            color: 'rgba(52, 120, 246, 0)'
          },
          ]),
        },
      },],
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
          color: '#333'
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
      series: [{
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
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(246, 122, 52, 0.2)'
          },
          {
            offset: 1,
            color: 'rgba(246, 122, 52, 0)'
          },
          ]),
        },
      },],
    };

    weightChart.setOption(option);
  },
  // 表单输入事件
  onDateChange(e) {
    this.setData({ 'formData.date': e.detail.value });
  },
  onHeightInput(e) {
    this.setData({ 'formData.height': e.detail.value });
  },
  onWeightInput(e) {
    this.setData({ 'formData.weight': e.detail.value });
  },
  // 添加新记录
  async submitData() {
    // 1. 表单验证
    const { height, weight } = this.data;
    if (!height || !weight) {
      wx.showToast({ title: '请输入身高和体重', icon: 'none' });
      return;
    }
    if (isNaN(height) || isNaN(weight)) {
      wx.showToast({ title: '请输入数字', icon: 'none' });
      return;
    }

    // 2. 获取当前时间（格式：YYYY-MM-DD）
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，补0
    const day = String(currentDate.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    // 3. 提交到后端
    wx.showLoading({ title: '提交中...' });
    try {
      const res = await wx.request({
        url: 'https://你的后端域名/api/baby/growth/add', // 后端接口地址
        method: 'POST',
        data: {
          height: Number(height), // 转为数字类型
          weight: Number(weight),
          date: date // 当前时间
        },
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + wx.getStorageSync('token') // 若需要登录，携带token
        }
      });

      // 4. 处理后端响应
      if (res.data.code === 200) { // 假设200为成功状态码
        wx.showToast({ title: '提交成功' });
        this.hideDialog(); // 关闭弹窗
        this.getData(); // 重新获取数据，刷新页面图表和列表
      } else {
        wx.showToast({ title: res.data.msg || '提交失败', icon: 'none' });
      }
    } catch (err) {
      console.error('提交失败：', err);
      wx.showToast({ title: '网络错误', icon: 'none' });
    } finally {
      wx.hideLoading();
    }

  },
  // 显示弹窗
  addNewRecord() {
    this.setData({
      isShowDialog: true,
      // 重置输入框（避免显示上次输入的值）
      height: '',
      weight: ''
    });
  },

  // 隐藏弹窗
  hideDialog() {
    this.setData({ isShowDialog: false });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },
});