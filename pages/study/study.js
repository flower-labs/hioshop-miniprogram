// pages/study/study.js
Page({
  data: {
    currentTab: "learning", // 默认选中“学习中”
    totalStudyTime: "2h30m",
    completedCoursesCount: 5,

    // 原始完整数据源
    allCourses: [
      {
        id: 1,
        coverUrl: "/images/course1.png",
        title: "宝典备考-导游导览",
        date: "2023-11-01/21",
        progress: 60,
        status: "learning",
      },
      {
        id: 2,
        coverUrl: "/images/course2.png",
        title: "宝典备考-初级导览",
        date: "2023-11-01/21",
        progress: 30,
        status: "learning",
      },
      {
        id: 3,
        coverUrl: "/images/course3.png",
        title: "宝典备考-中级导览",
        date: "2023-11-01/21",
        progress: 80,
        status: "learning",
      },
      {
        id: 4,
        coverUrl: "/images/course4.png",
        title: "宝典备考-高级导览",
        date: "2023-11-01/21",
        progress: 100,
        status: "completed",
      },
      {
        id: 5,
        coverUrl: "/images/course5.png",
        title: "宝典备考-终极导览",
        date: "2023-11-01/21",
        progress: 0,
        status: "notStarted",
      },
    ],

    // 当前展示的课程列表（初始化为加载中状态的数据）
    courses: [],
  },

  onLoad() {
    this.loadUserData();
    // 初始化时根据默认tab筛选数据
    this.filterCoursesByTab(this.data.currentTab);
  },

  /**
   * 切换标签页
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab,
    });
    // 切换后重新筛选数据
    this.filterCoursesByTab(tab);
  },

  /**
   * 根据Tab类型筛选课程
   */
  filterCoursesByTab(tab) {
    let filteredList = [];

    if (tab === "all") {
      // 全部：显示所有课程
      filteredList = this.data.allCourses;
    } else if (tab === "notStarted") {
      // 未学：进度为0或状态为notStarted
      filteredList = this.data.allCourses.filter(
        (item) => item.status === "notStarted" || item.progress === 0
      );
    } else if (tab === "learning") {
      // 学习中：进度大于0且小于100，或状态为learning
      filteredList = this.data.allCourses.filter(
        (item) =>
          item.status === "learning" && item.progress > 0 && item.progress < 100
      );
    } else if (tab === "completed") {
      // 已完成：进度为100或状态为completed
      filteredList = this.data.allCourses.filter(
        (item) => item.status === "completed" || item.progress === 100
      );
    }

    this.setData({
      courses: filteredList,
    });
  },

  /**
   * 继续学习按钮点击
   */
  onContinueTap(e) {
    const courseId = e.currentTarget.dataset.courseId;
    console.log("继续学习课程:", courseId);
    // 跳转到课程详情或播放页
    wx.navigateTo({
      url: `/pages/courseDetail/courseDetail?id=${courseId}`,
    });
  },

  /**
   * 加载用户数据
   */
  loadUserData() {
    // 模拟从本地存储或接口获取数据
    const userData = wx.getStorageSync("userData");
    if (userData) {
      this.setData({
        totalStudyTime: userData.totalStudyTime || "2h30m",
        completedCoursesCount: userData.completedCoursesCount || 5,
      });
    }
  },
});
