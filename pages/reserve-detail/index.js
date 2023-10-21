// pages/reserve-detail/index.js
import Toast from "tdesign-miniprogram/toast/index";
var api = require("../../config/api.js");
var util = require("../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    service_id: "",
    service_name: "",
    scrollHeight: 0,
    servicePrice: "",
    order_c_name: "",
    orderPhone: "",
    orderPlate: "",
    orderRemark: "",
    selectedDate: "",
    selectedTime: "",
    myObject: {},
    calendar: [],
    width: 0,
    currentIndex: 0,
    currentTime: 0,
    availableTime: "",
    availableReserveList: [],
    highLightItem: [],
    dialogVisible: false,
    dialogContent: "",
    dialogConfirmBtn: { content: "知道了", variant: "base" },
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
      availableTime: options.timestamp,
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
    const cur_minutes = date.getMinutes();
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

    const diffDays = util.getDateDiffInDays(that.data.availableTime);
    console.log("diffDays", diffDays);

    //限制要渲染的日历数据天数为7天以内（用户体验）
    const processedCalendar = that.data.calendar
      .splice(cur_date, that.data.calendar.length - cur_date <= 7 ? that.data.calendar.length : 7)
      .slice(diffDays);

    that.setData({
      calendar: processedCalendar,
    });
    //设置scroll-view的子容器的宽度
    that.setData({
      width: 186 * parseInt(that.data.calendar.length - cur_date <= 7 ? that.data.calendar.length : 7),
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.computeScrollViewHeight();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryReserveList(this.data.currentIndex);
  },

  queryReserveList(currentIndex) {
    let that = this;
    if (currentIndex === 0) {
      // 如果diff > 0 需要请求n天后数据
      const diffDays = util.getDateDiffInDays(that.data.availableTime);
      if (diffDays === 0) {
        const current = Math.floor(Date.now() / 1000);
        that.getReserveList(current);
      } else {
        const timestamp = util.getTimestampAfterDays(diffDays);
        that.getReserveList(timestamp);
      }
    } else {
      this.getReserveList(this.convertToTimestamp(this.data.selectedDate));
    }
  },
  //获取时间信息
  getReserveList(reservTime) {
    this.setData({
      isLoading: true,
    });
    let that = this;
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
        that.setData({
          isLoading: false,
        });
        //循环接口数据进行时间戳转换
        const availableList = res.data.availableReserveList.find(
          item => item.service_id === Number(that.data.service_id),
        ).available_list;

        // 转换时间 & 排除已经预约完时间点
        const formatedAvailableList = availableList
          .map(item => ({
            ...item,
            formatedTime: util.formatTimeNum(item.time, "Y-M-D h:m:s"),
          }))
          .filter(item => item.available_position !== 0);

        that.setData({
          highLightItem: formatedAvailableList,
        });
        // TOOD: 如果返回数据长度为0，则切换activeIndex并请求数据
        if (!that.data.selectTime && formatedAvailableList.length) {
          that.setData({
            selectedTime: formatedAvailableList[0].formatedTime,
          });
        }
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
  onUnload: function () {
    // wx.redirectTo({
    //   url: "/pages/auth/login/login",
    // });
  },
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
  //计算 scroll-view 的高度
  computeScrollViewHeight() {
    let that = this;
    let query = wx.createSelectorQuery().in(this);
    query.select(".reserve_type_title").boundingClientRect();
    query.select(".input_area_wrapper").boundingClientRect();
    query.select(".scroll-view_day").boundingClientRect();
    query.exec(res => {
      const titleHeight = res[0].height;
      const inputHeight = res[1].height;
      const dayHeight = res[2].height;
      const windowHeight = wx.getSystemInfoSync().windowHeight;
      const scrollHeight = windowHeight - titleHeight - inputHeight - dayHeight;
      console.log("debug value", scrollHeight, titleHeight, inputHeight, dayHeight);
      this.setData({ scrollHeight: scrollHeight });
    });
  },
  //选择日期
  handleDateSelect: function (event) {
    const { isLoading } = this.data;
    if (isLoading) {
      return;
    }
    //为上半部分的点击事件
    const currentIndex = event.currentTarget.dataset.index;
    const currentDate = event.currentTarget.dataset.date;
    this.setData({
      currentIndex,
      selectedDate: currentDate,
    });
    this.queryReserveList(currentIndex);
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
  showDialog(value) {
    console.log("content", value);
    this.setData({ dialogVisible: true, dialogContent: value });
  },

  closeDialog() {
    this.setData({ dialogVisible: false, dialogContent: "" });
  },

  showModalInfo(content) {
    wx.showModal({
      title: content,
      showCancel: false,
      content: "请更新重新重新提交",
    });
  },
  choosePlate() {
    wx.chooseLicensePlate({
      success: e => {
        this.setData({ orderPlate: e.plateNumber });
      },
    });
  },
  // 判断输入是否正确
  validateInput(time, phone, plateNumber) {
    const phoneReg = /^1[3-9]\d{9}$/;
    const plateReg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
    if (!time) {
      this.showDialog("请选择预约时间");
      return false;
    }
    if (!phone) {
      this.showDialog("请输入手机号");
      return false;
    }
    if (!plateNumber) {
      this.showDialog("请输入车牌号");
      return false;
    }
    if (!phoneReg.test(phone)) {
      this.showDialog("请输入正确的手机号");
      return false;
    }
    if (!plateReg.test(plateNumber)) {
      this.showDialog("请输入正确的车牌号");
      return false;
    }
    return true;
  },
  //提交预约
  onSubmit(e) {
    const that = this;
    const { isLoading } = that.data;
    if (isLoading) {
      return;
    }

    const { service_id, selectedTime, servicePrice, orderPhone, orderPlate, orderRemark } = this.data;

    const isValid = this.validateInput(selectedTime, orderPhone, orderPlate);
    console.log("isValid", isValid);
    if (isValid) {
      util
        .request(
          api.AddReserveOrder,
          {
            reserve_id: Number(service_id),
            reserve_time: this.convertToTimestamp(selectedTime),
            reserve_price: servicePrice,
            phone_number: orderPhone,
            plate_number: orderPlate,
            remark: orderRemark,
          },
          "POST",
        )
        .then(function (res) {
          console.log("AddReserveOrder", res);
          if (res.data.success) {
            that.showSuccessAlert();
            setTimeout(() => {
              // 跳转页面
              wx.redirectTo({
                url: "/pages/reserve-result/index",
              });
            }, 1000);
          }
        });
    }
  },

  showSuccessAlert() {
    Toast({
      context: this,
      selector: "#t-toast",
      message: "预约成功",
      icon: "check-circle",
      direction: "column",
    });
  },
});
