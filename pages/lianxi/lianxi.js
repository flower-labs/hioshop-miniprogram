// pages/lianxi/lianxi.js
var api = require("../../config/api.js");
var util = require("../../utils/util.js");
import moment from 'moment'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        yesterday: "",
        todayDate: "",
        calendar: [],
        check_status: {},
        flag: false
    },
    // 在 js 中定义 onSignTap 函数，用于处理签到事件
    onSignTap(e) {
        var that=this;
        var timestamp = Math.floor(Date.now() / 1000);
        console.log(timestamp);
        //  可以传递数据到后端
        util.request(api.AddCheck, {
                // 签到类型，目前仅支持每日签到，因此固定传"daily_check"即可
                "check_type": "daily_check",
                // 签到时间（时间戳）
                "check_time": timestamp,
                // 签到积分，目前穿10即可
                "points_amount": 10
            },
            "POST"
        ).then(function (res) {
            console.log(res.data),
            that.queryCheckStatus()
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var that = this;
        // 获取当前日期
        var today = moment();
        // 创建一个数组来保存昨天、今天及未来5天的日期
        var dates = [];

        // 添加昨天日期
        var yesterday = today.clone().subtract(1, 'day').format('YYYY-MM-DD');
        this.setData({
            yesterday: yesterday
        })

        // 添加今天日期
        var todayDate = today.format('YYYY-MM-DD');
        this.setData({
            todayDate: todayDate
        })

        // 添加未来5天日期
        for (var i = 1; i <= 5; i++) {
            var futureDay = today.clone().add(i, 'day').format('MM-DD');
            dates.push(futureDay);

        }

        // 打印未来5天的日期数组
        this.setData({
            calendar: dates
        })

        this.queryCheckStatus()
    },
    queryCheckStatus() {
        var that=this;
        // 获取昨天、今天签到状态
        var timestamp = Math.floor(Date.now() / 1000);
        console.log(timestamp);
        util.request(
            api.CheckList, {
                "current_time": timestamp
            },
            "GET"
        ).then(function (res) {
            that.setData({
                check_status: res.data.check_status
            })

        })
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