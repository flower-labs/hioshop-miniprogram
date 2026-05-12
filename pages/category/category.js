// pages/category/category.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 1,
        title: "Python数据分析",
        category: "职场",
        price: 159,
        cover: "https://picsum.photos/400/300",
      },
      {
        id: 2,
        title: "Figma系统课程",
        category: "职场",
        price: 189,
        cover: "https://picsum.photos/400/301",
      },
      {
        id: 3,
        title: "教师资格证",
        category: "考试",
        price: 269,
        cover: "https://picsum.photos/400/302",
      },
      {
        id: 4,
        title: "手机摄影课",
        category: "兴趣",
        price: 99,
        cover: "https://picsum.photos/400/303",
      },
    ],
    activeTab: "全部", // 当前选中的分类
    searchText: "", // 搜索文本
    allList: [
      {
        id: 1,
        title: "Python数据分析",
        category: "职场",
        price: 159,
        cover: "https://picsum.photos/400/300",
      },
      {
        id: 2,
        title: "Figma系统课程",
        category: "职场",
        price: 189,
        cover: "https://picsum.photos/400/301",
      },
      {
        id: 3,
        title: "教师资格证",
        category: "考试",
        price: 269,
        cover: "https://picsum.photos/400/302",
      },
      {
        id: 4,
        title: "手机摄影课",
        category: "兴趣",
        price: 99,
        cover: "https://picsum.photos/400/303",
      },
    ], // 所有课程列表，用于过滤
  },
  // 分类标签点击事件
  onTabClick(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    this.filterCourses();
  },

  // 搜索输入事件
  onSearchInput(e) {
    this.setData({
      searchText: e.detail.value,
    });
  },
  // 搜索按钮点击事件
  onSearch() {
    this.filterCourses();
  },
  // 根据分类和搜索关键词过滤课程
  filterCourses() {
    const { activeTab, searchText, allList } = this.data;
    let filteredList = allList;

    // 根据分类过滤
    if (activeTab !== "全部") {
      filteredList = filteredList.filter((item) => item.category == activeTab);
    }

    // 根据搜索关键词过滤
    if (searchText.trim()) {
      filteredList = filteredList.filter((item) =>
        item.title.includes(searchText.trim())
      );
    }

    this.setData({
      list: filteredList,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

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
