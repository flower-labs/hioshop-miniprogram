// pages/bonus/bonus.js
var api = require("../../config/api.js");
var util = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cur: {},
        check_list: [],
        total_points: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    handlePopup(e) {
        const {
            item
        } = e.currentTarget.dataset;
        this.setData({
                cur: item,
            },
            () => {
                this.setData({
                    visible: true
                });
            },
        );
    },
    onVisibleChange(e) {
        this.setData({
            visible: e.detail.visible,
        });
    },
    cancelPopup(){
        this.setData({
            visible: false,
        });
    },
    // 获取签到列表接口
    getSignList() {
        let that = this;
        var timestamp = Math.floor(Date.now() / 1000);
        util.request(
                api.CheckList, {
                    "current_time": timestamp
                }, "GET")
            .then(function (res) {
                //循环接口数据进行时间戳转换
                for (var i = 0; i < res.data.check_list.length; i++) {
                    res.data.check_list[i]["check_time"] = util.formatTimeNum(
                        res.data.check_list[i]["check_time"],
                        "Y-M-D h:m:s"
                    )
                }
                wx.stopPullDownRefresh();
                that.setData({
                    check_list: res.data.check_list,
                    total_points: res.data.total_points
                })
            })
    },
    onLoad(options) {

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
        this.getSignList()
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
        this.getSignList()
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