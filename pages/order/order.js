// pages/order/order.js
var api = require("../../config/api.js");
var util = require("../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        reserveList: [],
    },
    get_order(e) {
        let index = e.currentTarget.dataset.id;
        let service_price = this.data.reserveList[index].service_price;
        let service_name = this.data.reserveList[index].service_name;
        let id = this.data.reserveList[index].id;

        // 跳转页面
        wx.navigateTo({
            url: '/pages/orderDetail/orderDetail?service_id=' + id + '&service_name=' + service_name + '&service_price=' + service_price,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
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
        this.getGoodsInfo()
    },
    convertTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    //获取商品信息
    getGoodsInfo() {
        let that = this;
        util.request(api.ReserveList).then(function (res) {
            // 已预约数据
            const dynamicList = res.data.reserveDynamicList;
            // 返回数据中计算count字段
            const reserveList = res.data.reserveList.map(item => ({
                ...item,
                count: dynamicList.find(countItem => String(item.id) === countItem.id).count,
                latestTimestamp: that.convertTime(dynamicList.find(countItem => String(item.id) === countItem.id).latestTimestamp)
            }))
            that.setData({
                reserveList: reserveList,
            });
        });
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