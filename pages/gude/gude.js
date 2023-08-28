// pages/gude/gude.js
// 引入地理位置 API
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({
    key: 'CUXBZ-L3L6G-CGTQQ-Q5SUK-RVPBQ-MQFNH'

});


const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
//获取应用实例
const app = getApp()

const imageCdn = "http://rwi9z0rl6.hd-bkt.clouddn.com";
const swiperList = [
    `${imageCdn}/main-4.jpg`,
    `${imageCdn}/main-2.jpg`,
    `${imageCdn}/main-3.webp`,
];

Page({
    /**
     * 页面的初始数据
     */
    data: {
        current: 0,
        autoplay: false,
        duration: 500,
        interval: 5000,
        swiperList,
        img1: "http://rwi9z0rl6.hd-bkt.clouddn.com/%E6%B4%97%E8%BD%A6%E5%B0%8F%E7%A8%8B%E5%BA%8F/%E5%8D%A1%E6%B3%A8%E5%86%8C.png",
        img2: "http://rwi9z0rl6.hd-bkt.clouddn.com/%E6%B4%97%E8%BD%A6%E5%B0%8F%E7%A8%8B%E5%BA%8F/%E9%92%B1%E5%8C%85.png",
        img3: "http://rwi9z0rl6.hd-bkt.clouddn.com/%E6%B4%97%E8%BD%A6%E5%B0%8F%E7%A8%8B%E5%BA%8F/%E9%A1%B9%E7%9B%AE.png",
        userInfo: {},
        current: 0,
        autoplay: false,
        duration: 500,
        interval: 5000,
        swiperList,
        dis: 0,
        img1: 'https://tdesign.gtimg.com/miniprogram/images/example1.png',
        img2: 'https://tdesign.gtimg.com/miniprogram/images/example2.png',
        img3: 'https://tdesign.gtimg.com/miniprogram/images/example3.png',
        goodslist: [{
                goods_number: 100,
                list_pic_url: 'http://yanxuan.nosdn.127.net/63f5da1f5363af43aa91864bf66af48e.png',
                name: '日式简约素色窗帘',
                id: 1,
                title: '商品详情1'
            },
            {
                goods_number: 100,
                list_pic_url: 'http://yanxuan.nosdn.127.net/9126151f028a8804026d530836b481cb.png',
                name: '日式素雅纯色流星纹窗帘',
                id: 2,
                title: '商品详情2'

            },
            {
                goods_number: 100,
                list_pic_url: 'http://yanxuan.nosdn.127.net/536246ca4adb77274a94b18bb2f91f47.png',
                name: '糖果色凹凸条纹儿童房窗帘',
                id: 3,
                title: '商品详情3'
            }

        ]
    },

    // 获取用户地理位置
    mapViewTap: function () {
        wx.openLocation({
            latitude: 30.551008,
            longitude: 114.508331,
            scale: 28
        })
    },
    //计算距离
    getDis() {
        // 获取用户当前位置
        wx.getLocation({
            type: 'gcj02', // 返回可用于wx.openLocation的坐标系类型
            success: function (res) {
                const userLatitude = res.latitude; // 用户纬度
                const userLongitude = res.longitude; // 用户经度

                // 获取商家位置（假设商家位置已知）
                const merchantLatitude = 30.551008; // 商家纬度
                const merchantLongitude = 114.508331; // 商家经度

                // 调用地理位置 API 计算距离
                qqmapsdk.calculateDistance({
                    mode: 'driving', // 计算方式：驾车
                    from: {
                        latitude: userLatitude,
                        longitude: userLongitude
                    },
                    to: [{
                        latitude: merchantLatitude,
                        longitude: merchantLongitude
                    }],
                    success: function (res) {
                        const distance = res.result.elements[0].distance; // 距离，单位：米
                        console.log('距离：', distance);
                        this.setdata({
                            dis: distance
                        })
                    },
                    fail: function (res) {
                        console.error('计算距离失败：', res);
                    }
                });
            },
            fail: function (res) {
                console.error('获取位置失败：', res);
            }
        });
    },

    //跳转到预约API调用页面
    toReservePage() {
        wx.navigateTo({
            url: '/pages/reserve/index',
        })
    },
    //跳转到门店详情
    goto_gudeInfo() {
        wx.navigateTo({
            url: '/pages/gudeInfo1/gudeInfo1',
        })
    },
    //获取电话号码
    getPhoneNumber(e) {
        var that = this;
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') { //用户点击拒绝
            wx.showToast({
                title: '请绑定手机号',
                duration: 5000,
                icon: 'none',
            });
        } else {}
    },

    onChange(e) {
        const {
            detail: {
                current,
                source
            },
        } = e;
        console.log(current, source);
    },

    getIndexData: function () {
        let that = this;
        util.request(api.IndexUrl).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    floorGoods: res.data.categoryList,
                    banner: res.data.banner,
                    channel: res.data.channel,
                    notice: res.data.notice,
                    loading: 1,
                });
                let cartGoodsCount = '';
                if (res.data.cartCount == 0) {
                    wx.removeTabBarBadge({
                        index: 2,
                    })
                } else {
                    cartGoodsCount = res.data.cartCount + '';
                    wx.setTabBarBadge({
                        index: 2,
                        text: cartGoodsCount
                    })
                }
            }
        });
    },


    onChange(e) {
        const {
            detail: {
                current,
                source
            },
        } = e;
        console.log(current, source);
    },
    toBonus() {
        wx.navigateTo({
            url: '/pages/bonus/bonus',
        })
    },
    toSign() {
        wx.navigateTo({
            url: '/pages/sign/sign',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log("ok");
    },

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

})