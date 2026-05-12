Page({
  data: {
    course: null,
    activeTab: 0, // 当前选中的tab索引
    tabs: ['课程介绍', '课程目录', '讲师', '评价'],
    // 课程详情数据
    courseDetail: {
      id: 1,
      title: "Python数据分析",
      cover: "https://picsum.photos/400/300",
      originalPrice: 299,
      price: 159,
      rating: 4.8,
      duration: "24课时",
      teacher: {
        name: "张老师",
        avatar: "https://picsum.photos/100/100",
        title: "资深数据分析师"
      },
      description: "本课程从零开始，系统讲解Python数据分析的核心技术，包括NumPy、Pandas、Matplotlib等常用库的使用方法，以及实际项目案例分析。",
      chapters: [
        { title: "第一章：Python基础", free: true },
        { title: "第二章：NumPy入门", free: true },
        { title: "第三章：Pandas数据处理", free: false },
        { title: "第四章：数据可视化", free: false }
      ]
    }
  },

  onLoad(options) {
    const id = options.id;
    this.loadCourseDetail(id);
  },

  // 加载课程详情
  loadCourseDetail(id) {
    // 实际项目中这里应该从服务器获取数据
    this.setData({ course: this.data.courseDetail });
  },

  // 切换Tab
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeTab: index });
  },

  // 加入购物车
  addToCart() {
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },

  // 立即购买
  buyNow() {
    wx.navigateTo({
      url: '/pages/order/order?id=' + this.data.course.id
    });
  }
});
