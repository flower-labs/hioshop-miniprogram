// pages/orderDetail/orderDetail.js
var api = require("../../config/api.js");
var util = require("../../utils/util.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        service_id: '',
        service_name: '',
        service_price:'',
        order_c_name: '',
        order_c_phone: '',
        order_c_license: '',
        order_c_data: '',
        order_c_time: '',
        myObject: {},

        calendar: [],
        width: 0,
        currentIndex: 0,
        currentTime: 0,
        availableReserveList:[],
        highLightItem:[],
        timeArr: [{
                "time": "8:00-9:00",
                "status": "约满"
            },
            {
                "time": "9:00-10:00",
                "status": "约满"
            },
            {
                "time": "11:00-12:00",
                "status": "约满"
            },
            {
                "time": "14:00-15:00",
                "status": "约满"
            },
            {
                "time": "15:00-16:00",
                "status": "约满"
            },
            {
                "time": "16:00-17:00",
                "status": "约满"
            },
            {
                "time": "17:00-18:00",
                "status": "约满"
            }
        ]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;


        //使用页面参数
        that.setData({
            service_name: options.service_name,
            service_id: options.service_id,

            service_price:options.service_price,
        })

        function getThisMonthDays(year, month) {
            return new Date(year, month, 0).getDate();
        }
        // 计算每月第一天是星期几
        function getFirstDayOfWeek(year, month) {
            return new Date(Date.UTC(year, month - 1, 1)).getDay();
        }
        const date = new Date();
        const cur_year = date.getFullYear();
        const cur_month = date.getMonth() + 1;
        const cur_date = date.getDate();
        const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
        //利用构造函数创建对象
        function calendar(date, week) {
            this.date = cur_year + '-' + cur_month + '-' + date;
            if (date == cur_date) {
                this.week = "今天";
            } else if (date == cur_date + 1) {
                this.week = "明天";
            } else {
                this.week = '星期' + week;
            }
        }
        //当前月份的天数
        var monthLength = getThisMonthDays(cur_year, cur_month)
        //当前月份的第一天是星期几
        var week = getFirstDayOfWeek(cur_year, cur_month)
        var x = week;
        for (var i = 1; i <= monthLength; i++) {
            //当循环完一周后，初始化再次循环
            if (x > 6) {
                x = 0;
            }
            //利用构造函数创建对象
            that.data.calendar[i] = new calendar(i, [weeks_ch[x]][0])
            x++;
        }
        //限制要渲染的日历数据天数为7天以内（用户体验）
        var flag = that.data.calendar.splice(cur_date, that.data.calendar.length - cur_date <= 7 ? that.data.calendar.length : 7)
        that.setData({
            calendar: flag
        })
        //设置scroll-view的子容器的宽度
        that.setData({
            width: 186 * parseInt(that.data.calendar.length - cur_date <= 7 ? that.data.calendar.length : 7)
        })

        this.getGoodsInfo()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
    },
    //获取时间信息
    getGoodsInfo() {
        let that = this;
        console.log(that.data.service_id);
        util.request(api.AvailableReserveList,{ reserve_date: 1690778306,
            reserve_ids: [Number(that.data.service_id)]},'POST').then(function (res) {
            console.log(res);
              //循环接口数据进行时间戳转换
              for (var i = 0; i < res.data.availableReserveList.find(item => item.service_id === Number(that.data.service_id)).available_list.length; i++) {
                res.data.availableReserveList.find(item => item.service_id === Number(that.data.service_id)).available_list[i]["time"] = util.formatTimeNum(res.data.availableReserveList.find(item => item.service_id === Number(that.data.service_id)).available_list[i]["time"],'Y-M-D h:m:s')
           }
            that.setData({
                highLightItem: res.data.availableReserveList.find(item => item.service_id === Number(that.data.service_id)).available_list
            });
        });
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
    //选择日期
    select: function (event) {
        //为上半部分的点击事件
        this.setData({
            currentIndex: event.currentTarget.dataset.index,
            order_c_data: event.currentTarget.dataset.date
        })
        console.log(event.currentTarget.dataset.date)
    },
    //选择时间
    selectTime: function (event) {
        //为下半部分的点击事件
        this.setData({
            currentTime: event.currentTarget.dataset.tindex,
            order_c_time: event.currentTarget.dataset.time
        })
        console.log(event.currentTarget.dataset.time)
    },

    input_value1: function (event) {
        this.setData({
            order_c_name: event.detail.value
        })
    },
    input_value2: function (event) {
        this.setData({
            order_c_phone: event.detail.value
        })
    },
    input_value3: function (event) {
        this.setData({
            order_c_license: event.detail.value
        })
    },
    //提交预约
    onSubmit(e) {
        //存储页面信息
        let obj = new Object;
        let arr = new Array;
        obj.id = this.data.service_id
        obj.service_name = this.data.service_name
        obj.name = this.data.order_c_name
        obj.phone = this.data.order_c_phone
        obj.license = this.data.order_c_license
        obj.data = this.data.order_c_data
        obj.time = this.data.order_c_time
        console.log(obj);
        arr.push(obj);
        console.log(arr);
        // 跳转页面
        wx.navigateTo({
            url: '/pages/orderCart/orderCart',
            success:(res) => {
              // 通过eventChannel向被打开页面传送数据
               res.eventChannel.emit('array',arr)
            }
        });
        `      `
    }
})