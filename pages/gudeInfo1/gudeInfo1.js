// pages/gudeInfo1/gudeInfo1.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //存储页面参数
        id: 0,
        count:0,
        query:{},
        current:0,
        goodsImage_list:[],
        userInfo:{},
        showShareDialog:0,
        openAttr: false,
        priceChecked: false,
        specChecked:false,
        checkedSpecText: '',
        tmpSpecText: '请选择规格和数量',
        specificationList: [],
        goods:[{
            share_img_url:'http://yanxuan.nosdn.127.net/63f5da1f5363af43aa91864bf66af48e.png',
            title:'商品详情1',
            des:'日式简约素色窗帘',
            Spec:'规格',
            goods_unit:'件',
            SpecList:[
                {checked:false,goodsNumber:34,sell_volume:121,SpecValue:'1套',retail_price:258,value:'型号1',spec_id:0},
                {checked:false,goodsNumber:12,sell_volume:111,SpecValue:'1套',retail_price:158,value:'型号2',spec_id:1}
            ],
            goodsList:[
                {img_url:'http://yanxuan.nosdn.127.net/4a052c9a96ef8f424ddb35e6a1dae822.jpg',id:0},
                {img_url:'http://yanxuan.nosdn.127.net/1ad1192c393500a7d6e31036af44b0aa.jpg',id:0},
                {img_url:'http://yanxuan.nosdn.127.net/de46fc2984dea187c6d95036a3ca7852.jpg',id:0},
                {img_url:'http://yanxuan.nosdn.127.net/e3fc3ff866a0ac4d588f890cdc45ab20.jpg',id:0}
            ]
            },
            {
            share_img_url:'http://yanxuan.nosdn.127.net/9126151f028a8804026d530836b481cb.png',
            title:'商品详情2',
            des:'日式素雅纯色流星纹窗帘',
            goodsList:[
                {img_url:'http://yanxuan.nosdn.127.net/f3ab20a6f488fdfdadd15402f07b1794.jpg',id:1},
                {img_url:'http://yanxuan.nosdn.127.net/9afed203129a696d682eb005fdf980ed.jpg',id:1},
                {img_url:'http://yanxuan.nosdn.127.net/6436743044528b017ea8b40a276dde7d.jpg',id:1},
                {img_url:'http://yanxuan.nosdn.127.net/7b2f3a9be300acdcb580fe75620d8133.jpg',id:1}
            ]},
            {
                share_img_url:'http://yanxuan.nosdn.127.net/536246ca4adb77274a94b18bb2f91f47.png',
                title:'商品详情3',
            des:'糖果色凹凸条纹儿童房窗帘',
            goodsList:[
                {img_url:'http://yanxuan.nosdn.127.net/42d0d0b58137b50c41a472b721817110.jpg',id:2},
                {img_url:'http://yanxuan.nosdn.127.net/9afed203129a696d682eb005fdf980ed.jpg',id:2},
                {img_url:'http://yanxuan.nosdn.127.net/6436743044528b017ea8b40a276dde7d.jpg',id:2},
                {img_url:'http://yanxuan.nosdn.127.net/05a7288be96a45435fa942dfe73a37c7.jpg',id:2}
            ]
            }
        ],
        goodsIndex:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let userInfo = wx.getStorageSync('userInfo');
        this.setData({
            query:options  
        });
        this.getGoodsIndex()
        this.getGoodsInfo()
        
    },
    //获取商品规格信息
    getGoodsInfo(){
        let that = this;
        let goods= that.data.goods;
        
        // 如果仅仅存在一种货品，那么商品页面初始化时默认checked
        if (goods[that.data.query.id-1].SpecList.length >= 1) {
            goods[that.data.query.id-1].SpecList[0].checked = true
            that.setData({
                goods:that.data.goods,
                checkedSpecText: '已选择：' + goods[that.data.query.id-1].SpecList[0].value,
                tmpSpecText: '已选择：' + goods[that.data.query.id-1].SpecList[0].value,
                checkedSpecPrice: that.data.goods[that.data.query.id-1].SpecList.retail_price,
            });
        } else {
            that.setData({
                checkedSpecText: '请选择规格和数量'
            });
        }
        
    },
    clickSkuValue: function(event) {
        let that = this;
        let specValueId = event.currentTarget.dataset.valueId;
         //判断是否可以点击
         let _specificationList = that.data.goods;
            for (let j = 0; j < goods[that.data.query.id-1].SpecList.length; j++) {
                if (_specificationList[j].spec_id == specValueId) {
                    //如果已经选中，则反选
                    if (_specificationList[j].checked) {
                        _specificationList[j].checked = false;
                    } else {
                        _specificationList[j].checked = true;
                    }
                } else {
                    _specificationList[j].checked = false;
                }
            }
        // 必须重新渲染数据-------------为了添加isSelect属性
        that.setData({
            goods:that.data._specificationList
        })
        //重新计算spec改变后的信息
        //重新计算哪些值不可以点击
    },
    //获取图片数组下标
    getGoodsIndex(){
        this.setData({
            goodsIndex:this.data.query.id-1, 
        })
    
    },
    //预览图片函数
    previewImage: function (e) {
        let current = e.currentTarget.dataset.src;
        let id=e.currentTarget.dataset.id;
        let that = this;
        let goodsImage_list = [];
        for (const item of that.data.goods[id].goodsList) {
            goodsImage_list.push(item.img_url);
        };
        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: goodsImage_list // 需要预览的图片http链接列表  
        })
    },
    //获取当前事件的current
    bindchange: function(e) {
        let current = e.detail.current;
        this.setData({
            current: current
        })
    },
    //隐藏分享对话框
    hideDialog: function (e) {
        let that = this;
        that.setData({
            showShareDialog: false,
        });
    },
    //分享对话框
    shareTo:function(){
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo == '') {
            util.loginNow();
            return false;
        } else {
            this.setData({
                showShareDialog: !this.data.showShareDialog,
            });
        }
    },

    //打开规格型号对话框
    switchAttrPop: function() {
        if (this.data.openAttr == false) {
            this.setData({
                openAttr: !this.data.openAttr
            });
        }
    },
    //关闭规格型号
    closeAttr: function() {
        this.setData({
            openAttr: false,
            alone_text: '单独购买'
        });
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        wx.setNavigationBarTitle({
          title: this.data.query.title,
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        var that = this;
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo != '') {
            that.setData({
                userInfo: userInfo,
            });
        };
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
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareTimeline','shareAppMessage']
          });
        let id = this.data.query.id-1;
        let name = this.data.goods[id].name;
        let image = this.data.goods[id].share_img_url;
        let title = this.data.goods[id].title;
        return {
            title: title,
            path: '/pages/gudeInfo1/gudeInfo1?id='+id+'&title='+title,
            desc: name,
            imageUrl: image
        }
    }

})