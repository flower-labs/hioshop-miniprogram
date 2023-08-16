// pages/orderDetail/orderDetail.js
var api = require("../../config/api.js");
var util = require("../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    service_id: "",
    service_name: "",
    servicePrice: "",
    order_c_name: "",
    orderPhone: "",
    orderRemark: "",
    orderPlate: "",
    selectedDate: "",
    selectedTime: "",
    myObject: {},
    calendar: [],
    width: 0,
    currentIndex: 0,
    currentTime: 0,
    availableReserveList: [],
    highLightItem: [],
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
      servicePrice: options.service_price,
    });

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
    const weeks_ch = ["日", "一", "二", "三", "四", "五", "六"];
    //利用构造函数创建对象
    function calendar(date, week) {
      this.date = cur_year + "-" + cur_month + "-" + date;
      if (date == cur_date) {
        this.week = "今天";
      } else if (date == cur_date + 1) {
        this.week = "明天";
      } else {
        this.week = "星期" + week;
      }
    }
    //当前月份的天数
    var monthLength = getThisMonthDays(cur_year, cur_month);
    //当前月份的第一天是星期几
    var week = getFirstDayOfWeek(cur_year, cur_month);
    var x = week;
    for (var i = 1; i <= monthLength; i++) {
      //当循环完一周后，初始化再次循环
      if (x > 6) {
        x = 0;
      }
      //利用构造函数创建对象
      that.data.calendar[i] = new calendar(i, [weeks_ch[x]][0]);
      x++;
    }
    //限制要渲染的日历数据天数为7天以内（用户体验）
    var flag = that.data.calendar.splice(
      cur_date,
      that.data.calendar.length - cur_date <= 7 ? that.data.calendar.length : 7,
    );
    console.log("flag", flag);
    that.setData({
      calendar: flag,
    });
    //设置scroll-view的子容器的宽度
    that.setData({
      width: 186 * parseInt(that.data.calendar.length - cur_date <= 7 ? that.data.calendar.length : 7),
    });
    const current = Math.floor(Date.now() / 1000);
    this.getReserveList(current);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  //获取时间信息
  getReserveList(reservTime) {
    let that = this;
    console.log(that.data.service_id);
    util
      .request(
        api.AvailableReserveList,
        {
          reserve_date: reservTime,
          reserve_ids: [Number(that.data.service_id)],
        },
        "POST",
      )
      .then(function (res) {
        console.log(res);
        //循环接口数据进行时间戳转换
        for (
          var i = 0;
          i <
          res.data.availableReserveList.find(item => item.service_id === Number(that.data.service_id)).available_list
            .length;
          i++
        ) {
          res.data.availableReserveList.find(item => item.service_id === Number(that.data.service_id)).available_list[
            i
          ]["time"] = util.formatTimeNum(
            res.data.availableReserveList.find(item => item.service_id === Number(that.data.service_id)).available_list[
              i
            ]["time"],
            "Y-M-D h:m:s",
          );
        }
        that.setData({
          highLightItem: res.data.availableReserveList.find(item => item.service_id === Number(that.data.service_id))
            .available_list,
        });
      });
  },
  /** 将字符串时间转为10位时间戳 */
  convertToTimestamp(datetimeString) {
    // 将日期时间字符串转换为标准格式
    const formattedDatetime = datetimeString.replace(" ", "T") + "Z";

    // 使用 Date.parse() 方法将日期时间字符串转换为时间戳
    const timestamp = Date.parse(formattedDatetime) / 1000;

    // 返回时间戳
    return timestamp;
  },
  convertToTimestamp(dateString) {
    // 将日期字符串转换为标准格式
    const formattedDate = dateString.replace(/-/g, "/");

    // 使用 Date.parse() 方法将日期字符串转换为时间戳
    const timestamp = Date.parse(formattedDate) / 1000;

    // 返回时间戳
    return timestamp;
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
  handleDateSelect: function (event) {
    //为上半部分的点击事件
    const currentIndex = event.currentTarget.dataset.index;
    const currentDate = event.currentTarget.dataset.date;
    this.setData({
      currentIndex: currentIndex,
      selectedDate: currentDate,
    });
    if (currentIndex === 0) {
      const current = Math.floor(Date.now() / 1000);
      this.getReserveList(current);
    } else {
      this.getReserveList(this.convertToTimestamp(currentDate));
    }
  },
  //选择时间
  selectTime: function (event) {
    //为下半部分的点击事件
    this.setData({
      currentTime: event.currentTarget.dataset.tindex,
      selectedTime: event.currentTarget.dataset.time,
    });
  },

  input_phone: function (event) {
    this.setData({
      orderPhone: event.detail.value,
    });
  },
  input_plate: function (event) {
    this.setData({
      orderPlate: event.detail.value,
    });
  },
  input_remark: function (event) {
    this.setData({
      orderRemark: event.detail.value,
    });
  },

  // 判断输入是否正确
  validateInput(name, phone, plateNumber) {
    const phoneReg = /^1[3-9]\d{9}$/;
    const plateNumberReg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
    if (phoneReg.test(phone) && plateNumberReg.test(plateNumber)) {
      // 跳转页面
      wx.navigateTo({
        url: "/pages/orderCart/orderCart",
        success: res => {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit("array", arr);
        },
      });
    } else {
      if (!phoneReg.test(phone)) {
        wx.showModal({
          title: "提示",
          content: "请输入正确的电话号码",
          success(res) {
            if (res.confirm) {
              console.log("用户点击确定");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          },
        });
      }

      if (!plateNumberReg.test(plateNumber)) {
        wx.showModal({
          title: "提示",
          content: "请输入正确的车牌号码",
          success(res) {
            if (res.confirm) {
              console.log("用户点击确定");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          },
        });
      }
      return "输入格式正确";
    }
  },
  //提交预约
  onSubmit(e) {
    if (!this.data.selectedTime) {
      wx.showModal({
        title: "提示",
        content: "请选择预约时间",
      });
    }

    // const result = validateInput(obj.name, obj.phone, obj.license);
    // console.log(result); // 输出：输入格式正确

    util
      .request(
        api.AddReserveOrder,
        {
          reserve_id: Number(this.data.service_id),
          reserve_time: this.convertToTimestamp(this.data.selectedTime),
          reserve_price: this.data.servicePrice,
          phone_number: this.data.orderPhone,
          plate_number: this.data.orderPlate,
          remark: this.data.orderRemark,
        },
        "POST",
      )
      .then(function (res) {
        console.log("AddReserveOrder", res);
        if (res.data.success) {
          // 跳转页面
          wx.navigateTo({
            url: "/pages/orderCart/orderCart",
            success: res => {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit("array", arr);
            },
          });
        }
      });
  },
});
