// pages/baby-social/baby-social.js
Page({
  data: {
    currentDate: '',
    socialList: [],
    loading: false,
    noMore: false,
    page: 1,
    pageSize: 10,
    showPublish: false
  },

  onLoad(options) {
    this.initCurrentDate();
    this.loadSocialList();
  },

  onShow() {
    // 页面显示时可以刷新列表
  },

  onPullDownRefresh() {
    this.refreshList();
  },

  // 初始化当前日期
  initCurrentDate() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    this.setData({
      currentDate: `${month}月${day}日`
    });
  },

  // 加载社交圈列表
  loadSocialList() {
    if (this.data.loading || this.data.noMore) return;

    this.setData({ loading: true });

    // 模拟数据加载
    setTimeout(() => {
      const mockData = this.generateMockData();
      const newList = this.data.page === 1 ? mockData : [...this.data.socialList, ...mockData];

      this.setData({
        socialList: newList,
        loading: false,
        noMore: mockData.length < this.data.pageSize,
        page: this.data.page + 1
      });

      wx.stopPullDownRefresh();
    }, 500);
  },

  // 生成模拟数据
  generateMockData() {
    const mockList = [];
    const now = new Date();

    for (let i = 0; i < 5; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const age = Math.floor(Math.random() * 30) + 1;

      mockList.push({
        id: Date.now() + i,
        dateText: `${month}月${day}日 ${age}个月${Math.floor(Math.random() * 30)}天`,
        content: '如何\n定义下一代\nLLM?',
        mediaList: [
          {
            type: 'image',
            url: 'https://picsum.photos/200/300'
          }
        ],
        tags: ['日常记录'],
        author: `用户 ${Math.floor(Math.random() * 10000000000)}`,
        publishTime: `${Math.floor(Math.random() * 7) + 1}天前 ${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      });
    }

    return mockList;
  },

  // 刷新列表
  refreshList() {
    this.setData({
      socialList: [],
      page: 1,
      noMore: false
    });
    this.loadSocialList();
  },

  // 加载更多
  loadMore() {
    this.loadSocialList();
  },

  // 返回
  goBack() {
    wx.navigateBack();
  },


  // 打开发布弹窗
  openPublishModal() {
    this.setData({
      showPublish: true
    });
  },

  // 关闭发布弹窗
  closePublishModal() {
    this.setData({
      showPublish: false
    });
  },

  // 处理发布
  handlePublish(e) {
    const { content, mediaList, tags, location, visibility, recordTime } = e.detail;

    console.log('发布内容:', {
      content,
      mediaList,
      tags,
      location,
      visibility,
      recordTime
    });

    wx.showLoading({
      title: '发布中...'
    });

    // 模拟发布
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });

      // 关闭弹窗
      this.closePublishModal();

      // 刷新列表
      this.refreshList();
    }, 1000);
  },

  // 预览媒体
  previewMedia(e) {
    const index = e.currentTarget.dataset.index;
    const list = e.currentTarget.dataset.list;
    const urls = list.filter(item => item.type === 'image').map(item => item.url);

    if (urls.length > 0) {
      wx.previewImage({
        current: urls[index],
        urls: urls
      });
    }
  }
});
