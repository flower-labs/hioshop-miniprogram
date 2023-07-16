// pages/order/order.js
var api = require("../../config/api.js");
var util = require("../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods:[
            {
                title:"车辆抛光打蜡",
                img_url:"/images/icon/车辆抛光打蜡.jpg",
                price:188,
                num:200
            },
            {
                title:"汽车贴膜",
                img_url:"/images/icon/车辆贴膜.png",
                price:1000,
                num:300
            }
        ]
    },
    get_order(e){
        let index=e.currentTarget.dataset.id;
        let title=this.data.goods[index].title;
        console.log(title)
        //将数据存储在本地缓存中指定的 key 中
        wx.setStorageSync('tem_title', title);
        // 跳转页面
        wx.navigateTo({
          url: '/pages/orderDetail/orderDetail?id='+index,
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
        this.getinfo()
    },
    getinfo(){
        let that = this;
        util.request(api.ReserveList).then(function (res) {
            console.log(res);
            // that.setData({
            //     reseveList: res.data.reserveList,
            //     highLightItem: res.data.reserveList.filter(item => item.id === 1008603)[0].name
            // });
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