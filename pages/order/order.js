Page({
  data: {
    // 模拟订单商品数据
    orderItems: [
      {
        id: 101,
        title: "Python零基础入门到精通实战课程",
        cover: "https://via.placeholder.com/140x100",
        price: 99.0,
        quantity: 1,
        subtotal: 99.0,
      },
      {
        id: 102,
        title: "微信小程序全栈开发实战",
        cover: "https://via.placeholder.com/140x100",
        price: 128.0,
        quantity: 2,
        subtotal: 256.0,
      },
    ],
    // 优惠券状态
    hasCoupon: false,
    couponAmount: 0,

    // 金额计算
    originalPrice: 0,
    discountAmount: 0,
    finalPrice: 0,
  },

  onLoad(options) {
    // 可以在这里接收购物车传来的商品ID列表，并请求后端获取详细订单信息
    // this.fetchOrderDetail(options.ids);
    this.calculateAmount();
  },

  // 选择优惠券
  chooseCoupon() {
    // 跳转到优惠券选择页面，或者弹出选择框
    wx.navigateTo({
      url: "/pages/coupon/list?from=order",
    });

    // 模拟选择后的回调（实际项目中应在 onShow 中处理返回数据）
    // 这里仅做演示切换状态
    setTimeout(() => {
      this.setData({
        hasCoupon: !this.data.hasCoupon,
        couponAmount: this.data.hasCoupon ? 0 : 20, // 模拟选中20元优惠券
      });
      this.calculateAmount();
    }, 500);
  },

  // 计算金额
  calculateAmount() {
    let original = 0;
    this.data.orderItems.forEach((item) => {
      original += item.subtotal;
    });

    const discount = this.data.hasCoupon ? this.data.couponAmount : 0;
    let final = original - discount;

    if (final < 0) final = 0;

    this.setData({
      originalPrice: original.toFixed(2),
      discountAmount: discount.toFixed(2),
      finalPrice: final.toFixed(2),
    });
  },

  // 提交订单
  submitOrder() {
    wx.showLoading({
      title: "正在创建订单...",
    });

    // 模拟调用后端接口
    setTimeout(() => {
      wx.hideLoading();

      // 调用微信支付
      wx.requestPayment({
        timeStamp: "",
        nonceStr: "",
        package: "",
        signType: "MD5",
        paySign: "",
        success(res) {
          wx.showToast({
            title: "支付成功",
            icon: "success",
          });
          // 跳转到订单详情页或首页
          wx.redirectTo({
            url: "/pages/order/detail?id=123456",
          });
        },
        fail(err) {
          console.error("支付失败", err);
          wx.showToast({
            title: "支付取消或失败",
            icon: "none",
          });
        },
      });
    }, 1500);
  },
});
