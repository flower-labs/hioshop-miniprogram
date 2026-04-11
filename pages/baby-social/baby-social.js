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
    showPublish: false,
    currentUserId: 0,
    showCommentEditor: false,
    commentEditorMode: 'add',
    commentContent: '',
    commentTextLength: 0,
    activeSocialId: null,
    activeCommentId: null,
    commentSubmitting: false,
    showBackToTop: false,
    screenHeight: 0,
  },

  onLoad() {
    this.initCurrentDate();
    this.syncCurrentUser();
    this.loadSocialList();

    // 获取屏幕高度
    const sysInfo = wx.getSystemInfoSync();
    this.setData({ screenHeight: sysInfo.windowHeight });
  },

  onShow() {
    this.syncCurrentUser();
  },

  onPullDownRefresh() {
    this.refreshList();
  },

  onPageScroll(e) {
    const threshold = this.data.screenHeight * 0.8;
    const shouldShow = e.scrollTop > threshold;
    // 避免频繁 setData
    if (shouldShow !== this.data.showBackToTop) {
      this.setData({ showBackToTop: shouldShow });
    }
  },

  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  },

  handleFloatingBtnTap() {
    if (this.data.showBackToTop) {
      this.scrollToTop();
    } else {
      this.openPublishModal();
    }
  },

  initCurrentDate() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    this.setData({
      currentDate: `${month}月${day}日`,
    });
  },

  syncCurrentUser() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    const currentUserId = Number(userInfo.id || userInfo.user_id || 0);
    this.setData({ currentUserId });
  },

  async loadSocialList(isRefresh = false) {
    if (this.data.loading || (!isRefresh && this.data.noMore)) return;

    this.setData({ loading: true });

    try {
      const params = {
        page: this.data.page,
        page_size: this.data.pageSize,
      };

      const res = await util.request(api.BabySocialList, params, 'POST');

      if (res.errno === 0) {
        const list = res.data.list || [];
        const pagination = res.data.pagination || {};
        const totalCount = pagination.totalCount || 0;
        const formattedList = this.formatSocialList(list);

        const socialList =
          isRefresh || this.data.page === 1 ? formattedList : [...this.data.socialList, ...formattedList];

        const hasMore = socialList.length < totalCount && list.length === this.data.pageSize;

        this.setData({
          socialList,
          loading: false,
          noMore: !hasMore,
          totalCount,
          page: hasMore ? this.data.page + 1 : this.data.page,
        });
      } else {
        wx.showToast({
          title: res.errmsg || '加载失败',
          icon: 'none',
        });
        this.setData({ loading: false });
      }
    } catch (error) {
      console.error('加载相册列表失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none',
      });
      this.setData({ loading: false });
    } finally {
      wx.stopPullDownRefresh();
    }
  },

  getCommentToggleText(item = {}) {
    if (item.commentsVisible) {
      return '收起评论';
    }

    if (item.commentTotalCount > 0) {
      return `查看评论（${item.commentTotalCount}）`;
    }

    return '查看评论';
  },

  normalizeSocialItem(item = {}) {
    return {
      ...item,
      commentToggleText: this.getCommentToggleText(item),
    };
  },

  formatSocialList(list) {
    return list.map(item => {
      let mediaList = [];
      if (item.images) {
        try {
          const images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
          mediaList = images.map(url => ({
            type: 'image',
            url,
          }));
        } catch (e) {
          console.error('解析图片失败:', e);
        }
      }

      const createTime = item.create_time || '';
      const timeText = this.formatTimeText(createTime);

      // 如果接口返回了 comment_count 字段，则作为评论数初始值
      const commentTotalCount = (item.comment_count != null) ? Number(item.comment_count) : 0;

      return this.normalizeSocialItem({
        id: item.id,
        dateText: this.formatDateText(createTime),
        content: item.content || '',
        mediaList,
        tags: item.tags || [],
        location: item.location || '',
        author: item.author || '当前用户',
        publishTime: timeText,
        comments: [],
        commentsVisible: false,
        commentsLoaded: false,
        commentLoading: false,
        commentPage: 1,
        commentPageSize: 10,
        commentNoMore: false,
        commentTotalCount,
      });
    });
  },

  formatCommentList(list) {
    const currentUserId = Number(this.data.currentUserId || 0);
    return (list || []).map(item => {
      const userInfo = item.user_info || {};
      return {
        ...item,
        displayName: userInfo.nickname || userInfo.name || `用户${item.user_id}`,
        timeText: this.formatTimeText(item.create_time),
        canEdit: Number(item.user_id) === currentUserId,
      };
    });
  },

  formatDateText(timeStr) {
    if (!timeStr) return '';

    const date = new Date(timeStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  },

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
    }

    if (diffDays === 1) {
      return `昨天 ${hours}:${minutes}`;
    }

    if (diffDays < 7) {
      return `${diffDays}天前 ${hours}:${minutes}`;
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日 ${hours}:${minutes}`;
  },

  getSocialIndexById(socialId) {
    return this.data.socialList.findIndex(item => Number(item.id) === Number(socialId));
  },

  updateSocialItem(socialId, updater) {
    const index = this.getSocialIndexById(socialId);
    if (index === -1) return null;

    const socialList = [...this.data.socialList];
    const currentItem = socialList[index];
    const nextItem = typeof updater === 'function' ? updater({ ...currentItem }) : { ...currentItem, ...updater };

    socialList[index] = this.normalizeSocialItem(nextItem);
    this.setData({ socialList });
    return socialList[index];
  },

  getSocialItem(socialId) {
    const index = this.getSocialIndexById(socialId);
    return index === -1 ? null : this.data.socialList[index];
  },

  refreshList() {
    this.setData({
      socialList: [],
      page: 1,
      noMore: false,
      totalCount: 0,
    });
    this.loadSocialList(true);
  },

  loadMore() {
    if (!this.data.loading && !this.data.noMore) {
      this.loadSocialList(false);
    }
  },

  goBack() {
    wx.navigateBack();
  },

  openPublishModal() {
    this.setData({
      showPublish: true,
    });
  },

  closePublishModal() {
    this.setData({
      showPublish: false,
    });
  },

  /** 评论发布 */
  handlePublish() {
    this.closePublishModal();
    this.refreshList();
  },

  async loadCommentList(socialId, options = {}) {
    const { refresh = false, show = true } = options;
    const currentItem = this.getSocialItem(socialId);
    if (!currentItem) return;

    if (currentItem.commentLoading || (!refresh && currentItem.commentNoMore)) {
      return;
    }

    const requestPage = refresh ? 1 : currentItem.commentPage || 1;

    this.updateSocialItem(socialId, item => ({
      ...item,
      commentLoading: true,
      commentsVisible: show ? true : item.commentsVisible,
    }));

    try {
      const res = await util.request(
        api.BabySocialCommentList,
        {
          social_id: socialId,
          page: requestPage,
          page_size: currentItem.commentPageSize || 10,
        },
        'POST',
      );

      if (res.errno === 0) {
        const pagination = res.data.pagination || {};
        const commentList = this.formatCommentList(res.data.list || []);
        const latestItem = this.getSocialItem(socialId) || currentItem;
        const mergedComments =
          refresh || requestPage === 1 ? commentList : [...(latestItem.comments || []), ...commentList];
        const hasMore =
          typeof pagination.hasNext === 'boolean'
            ? pagination.hasNext
            : mergedComments.length < (pagination.totalCount || 0);

        this.updateSocialItem(socialId, item => ({
          ...item,
          comments: mergedComments,
          commentsVisible: show ? true : item.commentsVisible,
          commentsLoaded: true,
          commentLoading: false,
          commentNoMore: !hasMore,
          commentPage: hasMore ? requestPage + 1 : requestPage,
          commentTotalCount: pagination.totalCount || mergedComments.length,
        }));
      } else {
        this.updateSocialItem(socialId, { commentLoading: false });
        wx.showToast({
          title: res.errmsg || '评论加载失败',
          icon: 'none',
        });
      }
    } catch (error) {
      console.error('加载评论失败:', error);
      this.updateSocialItem(socialId, { commentLoading: false });
      wx.showToast({
        title: '评论加载失败',
        icon: 'none',
      });
    }
  },

  async toggleCommentList(e) {
    const socialId = Number(e.currentTarget.dataset.socialId);
    const currentItem = this.getSocialItem(socialId);
    if (!currentItem) return;

    if (currentItem.commentsVisible) {
      this.updateSocialItem(socialId, { commentsVisible: false });
      return;
    }

    if (currentItem.commentsLoaded) {
      this.updateSocialItem(socialId, { commentsVisible: true });
      return;
    }

    await this.loadCommentList(socialId, { refresh: true, show: true });
  },

  async loadMoreComments(e) {
    const socialId = Number(e.currentTarget.dataset.socialId);
    await this.loadCommentList(socialId, { refresh: false, show: true });
  },

  onCommentInput(e) {
    const commentContent = e.detail.value;
    this.setData({
      commentContent,
      commentTextLength: commentContent.length,
    });
  },

  preventTouchMove() {
    return false;
  },

  resetCommentEditor() {
    this.setData({
      showCommentEditor: false,
      commentEditorMode: 'add',
      commentContent: '',
      commentTextLength: 0,
      activeSocialId: null,
      activeCommentId: null,
      commentSubmitting: false,
    });
  },

  closeCommentEditor() {
    if (this.data.commentSubmitting) return;
    this.resetCommentEditor();
  },

  async openCommentEditor(e) {
    const socialId = Number(e.currentTarget.dataset.socialId);
    const mode = e.currentTarget.dataset.mode || 'add';
    const commentId = Number(e.currentTarget.dataset.commentId || 0);
    let commentContent = e.currentTarget.dataset.content || '';

    if (!socialId) {
      wx.showToast({
        title: '记录信息异常',
        icon: 'none',
      });
      return;
    }

    if (mode === 'edit' && commentId) {
      try {
        wx.showLoading({
          title: '加载中...',
          mask: true,
        });
        const res = await util.request(api.BabySocialCommentDetail, { id: commentId }, 'POST');
        wx.hideLoading();

        if (res.errno !== 0) {
          wx.showToast({
            title: res.errmsg || '加载评论失败',
            icon: 'none',
          });
          return;
        }

        commentContent = (res.data && res.data.content) || commentContent;
      } catch (error) {
        wx.hideLoading();
        console.error('获取评论详情失败:', error);
        wx.showToast({
          title: '加载评论失败',
          icon: 'none',
        });
        return;
      }
    }

    this.setData({
      showCommentEditor: true,
      commentEditorMode: mode,
      commentContent,
      commentTextLength: commentContent.length,
      activeSocialId: socialId,
      activeCommentId: commentId || null,
      commentSubmitting: false,
    });
  },

  async submitComment() {
    if (this.data.commentSubmitting) return;

    const content = (this.data.commentContent || '').trim();
    if (!content) {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none',
      });
      return;
    }

    if (content.length > 300) {
      wx.showToast({
        title: '评论内容不能超过300个字符',
        icon: 'none',
      });
      return;
    }

    const mode = this.data.commentEditorMode;
    const socialId = this.data.activeSocialId;
    const commentId = this.data.activeCommentId;

    this.setData({ commentSubmitting: true });

    try {
      const requestUrl = mode === 'edit' ? api.UpdateBabySocialComment : api.AddBabySocialComment;
      const requestData = mode === 'edit' ? { id: commentId, content } : { social_id: socialId, content };

      const res = await util.request(requestUrl, requestData, 'POST');

      if (res.errno === 0) {
        wx.showToast({
          title: mode === 'edit' ? '评论已更新' : '评论成功',
          icon: 'success',
        });
        this.resetCommentEditor();
        await this.loadCommentList(socialId, { refresh: true, show: true });
      } else {
        this.setData({ commentSubmitting: false });
        wx.showToast({
          title: res.errmsg || '操作失败',
          icon: 'none',
        });
      }
    } catch (error) {
      console.error('提交评论失败:', error);
      this.setData({ commentSubmitting: false });
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none',
      });
    }
  },

  deleteComment(e) {
    const socialId = Number(e.currentTarget.dataset.socialId);
    const commentId = Number(e.currentTarget.dataset.commentId);
    const that = this;

    if (!socialId || !commentId) {
      wx.showToast({
        title: '评论信息异常',
        icon: 'none',
      });
      return;
    }

    wx.showModal({
      title: '提示',
      content: '确定要删除这条评论吗？',
      success: async function (res) {
        if (!res.confirm) return;

        try {
          wx.showLoading({
            title: '删除中...',
            mask: true,
          });
          const result = await util.request(
            api.DeleteBabySocialComment,
            {
              id: commentId,
            },
            'POST',
          );
          wx.hideLoading();

          if (result.errno === 0) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
            });
            await that.loadCommentList(socialId, { refresh: true, show: true });
          } else {
            wx.showToast({
              title: result.errmsg || '删除失败',
              icon: 'none',
            });
          }
        } catch (error) {
          wx.hideLoading();
          console.error('删除评论失败:', error);
          wx.showToast({
            title: '删除失败',
            icon: 'none',
          });
        }
      },
    });
  },

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
              mask: true,
            });

            const result = await util.request(
              api.DeleteBabySocialRecord,
              {
                id,
              },
              'POST',
            );

            wx.hideLoading();

            if (result.errno === 0) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
              });
              that.refreshList();
            } else {
              wx.showToast({
                title: result.errmsg || '删除失败',
                icon: 'none',
              });
            }
          } catch (error) {
            wx.hideLoading();
            console.error('删除失败:', error);
            wx.showToast({
              title: '删除失败',
              icon: 'none',
            });
          }
        }
      },
    });
  },

  previewMedia(e) {
    const index = e.currentTarget.dataset.index;
    const list = e.currentTarget.dataset.list;
    const urls = list.filter(item => item.type === 'image').map(item => item.url);
    const formattedUriList = urls.map(item => item.image_url);

    if (formattedUriList.length > 0) {
      wx.previewImage({
        current: formattedUriList[index],
        urls: formattedUriList,
      });
    }
  },
});
