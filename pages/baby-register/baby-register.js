// pages/baby-register/baby-register.js
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

    },
    _cancelRegister(e){
        wx.switchTab({
          url: '/pages/baby-setting/index',
        })
    },
    _handleBabyRegister(e){
        wx.navigateTo({
          url: '/pages/baby-register-babyinfo/index',
        })
    },
    _handleMomRegister(e){
        console.log('Cell 被点击了');
        // 可以在这里添加更多点击后的处理逻辑
        // 例如，跳转到其他页面、显示详情信息等
        wx.showToast({
          title: '此功能待开通！',
          icon: 'none'
        });
      }
})