// pages/user/user.js
Page({
  data: {
    // 用户信息
    userInfo: {
      avatarUrl: "",
      nickName: "",
      isVip: false, // true为VIP，false为普通
    },
    // 菜单配置
    menuList: [
      {
        id: 1,
        name: "我的课程",
        icon: "📚",
        path: "/pages/myCourses/myCourses",
        colorClass: "blue",
      },
      {
        id: 2,
        name: "我的订单",
        icon: "📦",
        path: "/pages/myOrders/myOrders",
        colorClass: "orange",
      },
      {
        id: 3,
        name: "优惠券",
        icon: "🎫",
        path: "/pages/coupons/coupons",
        colorClass: "red",
      },
      {
        id: 4,
        name: "收藏",
        icon: "⭐",
        path: "/pages/favorites/favorites",
        colorClass: "purple",
      },
      {
        id: 5,
        name: "客服",
        icon: "🎧",
        path: "/pages/customerService/customerService",
        colorClass: "green",
      },
      {
        id: 6,
        name: "设置",
        icon: "⚙️",
        path: "/pages/settings/settings",
        colorClass: "gray",
      },
    ],
  },

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    // 每次显示页面时刷新用户信息
    this.loadUserInfo();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const token = wx.getStorageSync("token");
    if (!token) {
      // 未登录，引导去登录页
      wx.redirectTo({
        url: "/pages/login/login",
      });
    }
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    // 模拟从本地存储或接口获取用户信息
    const localUser = wx.getStorageSync("userInfo");
    if (localUser) {
      this.setData({
        userInfo: localUser,
      });
    } else {
      // 如果没有本地数据，可以调用后端接口
      // this.fetchUserProfile();
    }
  },

  /**
   * 菜单点击事件
   */
  onMenuTap(e) {
    const path = e.currentTarget.dataset.path;
    if (path) {
      wx.navigateTo({
        url: path,
      });
    }
  },

  /**
   * 跳转到设置
   */
  goToSettings() {
    wx.navigateTo({
      url: "/pages/settings/settings",
    });
  },

  /**
   * 退出登录
   */
  handleLogout() {
    wx.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.clearStorageSync();
          // 跳转回登录页或首页
          wx.reLaunch({
            url: "/pages/login/login",
          });
        }
      },
    });
  },
});
