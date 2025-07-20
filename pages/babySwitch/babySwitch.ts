// pages/babySwitch/babySwitch.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userList: [
      {
        id: 1,
        avatarUrl:
          'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoQzK1icqDlJ9pQzY7iaQ9V7wib9H2wib9H2wib9H2wib9H2wib9H2wib9H2wib9H2wib9/132',
        nickName: '皮卡丘',
        description: '爱好，身高，体重',
        isActive: false,
      },
      {
        id: 2,
        avatarUrl: '',
        nickName: '元元',
        description: '爱好，身高，体重',
        isActive: true,
      },
      {
        id: 3,
        avatarUrl:
          'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoQzK1icqDlJ9pQzY7iaQ9V7wib9H2wib9H2wib9H2wib9H2wib9H2wib9H2wib9H2wib9/132',
        nickName: '戴维',
        description: '爱好，身高，体重',
        isActive: true,
      },
    ],
  },
  // 邀请功能
  onInvite() {
    wx.navigateTo({
      url: '/pages/baby-register/baby-register',
    });
  },
  // 扫码关注功能
  onScan() {
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        wx.showToast({
          title: `扫码成功: ${res.result}`,
          icon: 'none',
        });
      },
      fail: err => {
        console.error('扫码失败', err);
        wx.showToast({
          title: '扫码失败，请重试',
          icon: 'none',
        });
      },
    });
  },
  // 用户详情页
  onUserDetail(e) {
    const userId = e.currentTarget.dataset.id;
    wx.switchTab({
      url: `/pages/baby-setting/index?id=${userId}`,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 页面初始化时可以加载用户数据
    this.loadUserData();
  },
  // 加载用户数据
  loadUserData() {
    // 模拟从服务器获取用户数据
    // 实际开发中可以使用 wx.request 调用API
    setTimeout(() => {
      // 这里使用data中的模拟数据，实际项目中替换为API返回数据
      console.log('用户数据加载成功');
    }, 300);
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
});
