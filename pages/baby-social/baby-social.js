// pages/baby-social/baby-social.js
const api = require('../../config/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    currentDate: '',
    socialList: [],
    loading: false,
    noMore: false,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    showPublish: false
  },

  onLoad() {
    this.initCurrentDate();
    this.loadSocialList();
  },

  onShow() {
    // 页面显示时可以刷新列表
  },

  onPullDownRefresh() {
    this.refreshList();
  },

  // onReachBottom() {
  //   console.log('页面滚动到底部');
  //   // 页面滚动到底部时自动加载更多
  //   if (!this.data.loading && !this.data.noMore) {
  //     this.loadSocialList(false);
  //   }
  // },

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
  async loadSocialList(isRefresh = false) {
    if (this.data.loading || (!isRefresh && this.data.noMore)) return;

    this.setData({ loading: true });

    try {
      const params = {
        page: this.data.page,
        page_size: this.data.pageSize
      };


      const res = await util.request(api.BabySocialList, params, 'POST');
      
      if (res.errno === 0) {
        const list = res.data.list || [];
        const pagination = res.data.pagination || {};
        const totalCount = pagination.totalCount || 0;

        // 格式化数据
        const formattedList = this.formatSocialList(list);

        let socialList = [];
        if (isRefresh || this.data.page === 1) {
          // 刷新或首次加载，直接替换数据
          socialList = formattedList;
        } else {
          // 加载更多，追加数据
          socialList = [...this.data.socialList, ...formattedList];
        }

        // 判断是否还有更多数据
        const hasMore = socialList.length < totalCount && list.length === this.data.pageSize;

        this.setData({
          socialList: socialList,
          loading: false,
          noMore: !hasMore,
          totalCount: totalCount,
          page: hasMore ? this.data.page + 1 : this.data.page
        });
      } else {
        wx.showToast({
          title: res.errmsg || '加载失败',
          icon: 'none'
        });
        this.setData({ loading: false });
      }
    } catch (error) {
      console.error('加载社交圈列表失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    } finally {
      wx.stopPullDownRefresh();
    }
  },

  // 格式化社交圈列表数据
  formatSocialList(list) {
    return list.map(item => {
      // 解析图片数组
      let mediaList = [];
      if (item.images) {
        try {
          const images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
          mediaList = images.map(url => ({
            type: 'image',
            url: url
          }));
        } catch (e) {
          console.error('解析图片失败:', e);
        }
      }

      // 格式化时间
      const createTime = item.create_time || '';
      const timeText = this.formatTimeText(createTime);

      return {
        id: item.id,
        dateText: this.formatDateText(createTime),
        content: item.content || '',
        mediaList: mediaList,
        tags: item.tags || [],
        location: item.location || '',
        author: item.author || '当前用户',
        publishTime: timeText
      };
    });
  },

  // 格式化日期文本（如：12月5日 3个月15天）
  formatDateText(timeStr) {
    if (!timeStr) return '';
    
    const date = new Date(timeStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 这里可以根据宝宝生日计算月龄，暂时简化处理
    return `${month}月${day}日`;
  },

  // 格式化时间文本（如：1天前 14:30）
  formatTimeText(timeStr) {
    if (!timeStr) return '';
    
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    if (diffDays === 0) {
      return `今天 ${hours}:${minutes}`;
    } else if (diffDays === 1) {
      return `昨天 ${hours}:${minutes}`;
    } else if (diffDays < 7) {
      return `${diffDays}天前 ${hours}:${minutes}`;
    } else {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}月${day}日 ${hours}:${minutes}`;
    }
  },

  // 刷新列表
  refreshList() {
    this.setData({
      socialList: [],
      page: 1,
      noMore: false,
      totalCount: 0
    });
    this.loadSocialList(true);
  },

  // 加载更多（手动点击触发）
  loadMore() {
    if (!this.data.loading && !this.data.noMore) {
      this.loadSocialList(false);
    } else {
      console.log('当前状态不允许加载:', { loading: this.data.loading, noMore: this.data.noMore });
    }
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
    console.log('发布成功，刷新列表');

    // 关闭弹窗
    this.closePublishModal();

    // 刷新列表
    this.refreshList();
  },

  // 删除记录
  deleteSocialRecord(e) {
    const id = e.currentTarget.dataset.id;
    const that = this;

    wx.showModal({
      title: '提示',
      content: '确定要删除这条记录吗？',
      success: async function (res) {
        if (res.confirm) {
          try {
            wx.showLoading({
              title: '删除中...',
              mask: true
            });

            const result = await util.request(api.DeleteBabySocialRecord, {
              id: id
            }, 'POST');

            wx.hideLoading();

            if (result.errno === 0) {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });

              // 刷新列表
              that.refreshList();
            } else {
              wx.showToast({
                title: result.errmsg || '删除失败',
                icon: 'none'
              });
            }
          } catch (error) {
            wx.hideLoading();
            console.error('删除失败:', error);
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 预览媒体
  previewMedia(e) {
    const index = e.currentTarget.dataset.index;
    const list = e.currentTarget.dataset.list;
    const urls = list.filter(item => item.type === 'image').map(item => item.url);
    const formattedUriList = urls.map(item => item.image_url);

    if (urls.length > 0) {
      wx.previewImage({
        current: formattedUriList?.[index],
        urls: formattedUriList
      });
    }
  }
});