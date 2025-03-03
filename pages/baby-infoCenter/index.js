// pages/baby-infoCenter/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverImage: '', // 封面图片地址
        baby_name: '哪吒',
        baby_sex: '男孩',
        baby_birth: '2023年12月22日 冬月初十 摩羯座',
        baby_blood_type: '未填写',
        baby_height: 70.0,
        baby_weight: 15.0
    },
    // 设置封面图片的方法
    setCover() {
        let that=this;
        wx.chooseMedia({
            count: 1, // 最多可以选择的图片张数，默认9
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            soureType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                //  对上传文件的格式进行校验
                console.log(res);
                var picType = false;
                for (var i = 0; i < res.tempFiles.length; i++) {
                    if (res.tempFiles[i].tempFilePath.includes('.png') || res.tempFiles[i].tempFilePath.includes('.jpg') || res.tempFiles[i].tempFilePath.includes('.jpeg') || res.tempFiles[i].tempFilePath.includes('.gif')) {
                        picType = true;
                        that.setData({
                            coverImage: res.tempFiles[i].tempFilePath
                          });
                        //   缓存到本地
                        wx.setStorageSync('coverImage', that.data.coverImage);
                    } else {
                        picType = false
                        break
                    }
                }
                if (!picType) {
                    wx.showToast({
                        title: '支持.png/ .jpg/ .jpeg/ .gif 格式图片',
                        icon: 'none'
                    })
                    return
                }
               
            },
            fail: function () {
                // fail
                wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                })
            },
            complete: function () {
                // complete
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const coverImage = wx.getStorageSync('coverImage') ;
        this.setData({
            coverImage
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