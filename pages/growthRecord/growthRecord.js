// pages/growthRecord/growthRecord.ts
import * as echarts from '../test/ec-canvas/echarts';

// 身高图表初始化
function onHeightChartInit(canvas, width, height) {

    // 初始化图表实例
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(chart);

    // 存储图表实例供后续使用
    this.setData({
        heightChart: chart
    });

    // 设置图表配置项
    const option = {
        // 身高图表的具体配置（如坐标轴、数据系列等）
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月']
        },
        yAxis: {
            type: 'value',
            name: '身高(cm)'
        },
        series: [{
            data: [110, 112, 115, 118, 120],
            type: 'line',
            smooth: true
        }]
    };

    chart.setOption(option);
    console.log(chart);
    // 返回图表实例
    return chart;
}

Page({
    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0, // 当前激活的标签索引
        timeFilter: 'all', // 时间筛选条件
        growthRecords: [], // 生长记录数据
        latestHeight: 0, // 最新身高
        latestWeight: 0, // 最新体重
        avgHeightGrowth: 0, // 平均身高增长
        maxHeightGrowth: 0, // 最大身高增长
        avgWeightGrowth: 0, // 平均体重增长
        maxWeightGrowth: 0, // 最大体重增长

        ecHeightChartOption: {
            // lazyLoad: false, // 延迟加载
            onInit: onHeightChartInit,
        },
        // 身高图表配置
        heightChartOption: {
            ec: {
                lazyLoad: false, // 延迟加载
            },
        },

        // 体重图表配置
        weightChartOption: {
            ec: {
                lazyLoad: true, // 延迟加载
            },
        },

        // 图表实例
        heightChart: null,
        weightChart: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        // 初始化模拟数据
        this.initMockData();

        // 计算统计数据
        this.calculateStats();
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
                if (index === 1 && this.heightChart) {
                    this.updateHeightChart();
                } else if (index === 2 && this.weightChart) {
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
        this.setData({
                timeFilter: filter,
            },
            () => {
                // 更新当前显示的图表
                if (this.data.currentTab === 1 && this.heightChart) {
                    this.updateHeightChart();
                } else if (this.data.currentTab === 2 && this.weightChart) {
                    this.updateWeightChart();
                }
            },
        );
    },


    // 体重图表初始化
    onWeightChartInit(canvas, width, height) {

        this.weightChart = echarts.init(canvas, null, {
            width: width,
            height: height,
        });
        canvas.setChart(this.weightChart);
        this.updateWeightChart();
        return this.weightChart;
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
        if (!filteredData || filteredData.length === 0) return;

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
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(52, 120, 246, 0.2)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(52, 120, 246, 0)'
                        },
                    ]),
                },
            }, ],
        };

        this.heightChart.setOption(option);
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
            }, ],
        };

        this.weightChart.setOption(option);
    },

    // 添加新记录
    addNewRecord() {
        // 这里可以跳转到记录添加页面
        wx.showToast({
            title: '跳转到添加记录页面',
            icon: 'none',
        });
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