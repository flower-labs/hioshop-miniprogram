// pages/addRelative/addRelative.ts
Page({
    /**
     * 页面的初始数据
     */
    data: {
        showQRCode: false,
        qrCodeUrl: '',
    },
    goBack() {
        wx.navigateBack({
          delta: 1  // 返回上一页
        });
      },
    // 微信邀请功能
    onWechatInvite() {
        // 分享
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
          })
        
    },

    // 面对面邀请功能
    onFaceToFaceInvite() {
        wx.showLoading({
            title: '生成二维码中...'
        });
        // 模拟请求后端生成二维码
        setTimeout(() => {
            this.setData({
                showQRCode: true,
                qrCodeUrl: 'https://demo.com/qrcode?userId=' + getApp().globalData.userId,
            });
            wx.hideLoading();
        }, 1000);
    },

    // 保存二维码到相册
    saveQRCode() {
        wx.downloadFile({
            url: this.data.qrCodeUrl,
            success: res => {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: () => wx.showToast({
                        title: '保存成功'
                    }),
                });
            },
        });
    },

    // 关闭弹窗
    closeModal() {
        this.setData({
            showQRCode: false
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {},

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