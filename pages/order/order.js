// pages/order/order.js
var api = require("../../config/api.js");
var util = require("../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        reserveList:[]
    },
    get_order(e){
        let index=e.currentTarget.dataset.id;
        let service_price=this.data.reserveList[index].service_price;
        let service_name=this.data.reserveList[index].service_name;
        let id=this.data.reserveList[index].id;

        // 跳转页面
        wx.navigateTo({
          url: '/pages/orderDetail/orderDetail?service_id='+id+'&service_name='+service_name+'&service_price='+service_price,
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
    //获取商品信息
    getGoodsInfo(){
        let that = this;
        util.request(api.ReserveList).then(function (res) {
            console.log(res);
            that.setData({
                reserveList: res.data.reserveList,
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