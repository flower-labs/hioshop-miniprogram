// pages/orderCart/orderCart.js
var api = require("../../config/api.js");
var util = require("../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getin()
    },
    getin() {
        util.request(api.ReserveOrderList).then(function (res) {
            console.log(res);
            // that.setData({
            //   reseveList: res.data.reserveList,
            //   highLightItem: res.data.reserveList.filter(item=>item.id=== 1008603)[0].name
            // });
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