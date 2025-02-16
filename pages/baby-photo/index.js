// pages/baby-photo/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: []
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
    // 上传方法
    gotoShow() {
        // 状态only 判断是否可以上传的，为0直接return出去
        if (this.data.only == 0) {
            return
        }
        var _this = this
        wx.chooseMedia({
            count: 9, // 最多可以选择的图片张数，默认9
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            soureType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                //  对上传文件的格式进行校验
                console.log(res);
                var picType = false
                let pathArr = []
                for (var i = 0; i < res.tempFiles.length; i++) {
                    if (res.tempFiles[i].tempFilePath.includes('.png') || res.tempFiles[i].tempFilePath.includes('.jpg') || res.tempFiles[i].tempFilePath.includes('.jpeg') || res.tempFiles[i].tempFilePath.includes('.gif')) {
                        picType = true
                        pathArr.push(res.tempFiles[i].tempFilePath)
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
                //  [..._this.data.src, ...res.tempFilePaths]：运用了扩展运算符 ... 来把 _this.data.src 和 res.tempFilePaths 这两个数组展开，然后合并成一个新数组。
                const srcer = [..._this.data.src, ...pathArr]
                _this.setData({
                    src: srcer
                })
                //  也可以在这里加上上传的loading，在数组_this.data.src.length -1 与循环的index相等时关闭loading
                //  循环上传图片
                _this.data.src.forEach(item => {
                    wx.uploadFile({
                        url: baseURL + '/common/upload',
                        filePath: item,
                        header: {
                            Authorization: 'Bearer' + wx.getStorageSync('token')
                        },
                        name: 'file',
                        success(res) {
                            console.log('888');
                            const arr = _this.data.annexPic
                            arr.push(JSON.parse(res.data).url)
                            _this.setData({
                                annexPic: arr
                            })
                            console.log(arr, _this.data.annexPic);
                        }
                    })
                })
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
    // 大图预览
    viewPic(e) {
        wx.previewImage({
            current: e.currentTarget.dataset.item, // 当前显示图片的 http 链接
            urls: this.data.src // 需要预览的图片 http 链接列表
        })
    },
    // 删除照片
    deletePic(e) {
        // 这里在查看的时候没处理wxml，在这里做了限制，查看点击直接return
        if (this.data.only == '0') {
            return
        }
        const srcer = this.data.src
        srcer.splice(e.currentTarget.dataset.index, 1)
        this.setData({
            src: srcer
        })
    }
})