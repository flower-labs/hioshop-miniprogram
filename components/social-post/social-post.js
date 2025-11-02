// components/social-post/social-post.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    formData: {
      content: '',
      mediaList: [],
      tags: [],
      location: '',
      visibility: 'family', // self: 自己, family: 家人
      visibilityText: '所有亲',
      recordTime: ''
    },
    showVisibility: false,
    showTimePicker: false
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      this.initRecordTime();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化记录时间
    initRecordTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      
      this.setData({
        'formData.recordTime': `${year}-${month}-${day}`
      });
    },

    // 阻止触摸穿透
    preventTouchMove() {
      return false;
    },

    // 内容输入
    onContentInput(e) {
      this.setData({
        'formData.content': e.detail.value
      });
    },

    // 选择媒体（图片/视频）
    chooseMedia() {
      const that = this;
      const maxCount = 9 - this.data.formData.mediaList.length;
      
      if (maxCount <= 0) {
        wx.showToast({
          title: '最多只能添加9个媒体',
          icon: 'none'
        });
        return;
      }

      wx.chooseMedia({
        count: maxCount,
        mediaType: ['image', 'video'],
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success(res) {
          const mediaList = res.tempFiles.map(file => ({
            type: file.fileType,
            url: file.tempFilePath,
            poster: file.thumbTempFilePath || file.tempFilePath
          }));
          
          that.setData({
            'formData.mediaList': [...that.data.formData.mediaList, ...mediaList]
          });
        },
        fail(err) {
          console.error('选择媒体失败:', err);
        }
      });
    },

    // 删除媒体
    deleteMedia(e) {
      const index = e.currentTarget.dataset.index;
      const mediaList = [...this.data.formData.mediaList];
      mediaList.splice(index, 1);
      
      this.setData({
        'formData.mediaList': mediaList
      });
    },

    // 添加"第一次"标签
    addFirstTag() {
      const tags = [...this.data.formData.tags];
      const tagName = '日常记录';
      
      if (tags.includes(tagName)) {
        wx.showToast({
          title: '标签已存在',
          icon: 'none'
        });
        return;
      }
      
      tags.push(tagName);
      this.setData({
        'formData.tags': tags
      });
    },

    // 添加自定义标签
    addCustomTag() {
      const that = this;
      wx.showModal({
        title: '添加标签',
        editable: true,
        placeholderText: '请输入标签名称',
        success(res) {
          if (res.confirm && res.content) {
            const tags = [...that.data.formData.tags];
            const tagName = res.content.trim();
            
            if (!tagName) {
              return;
            }
            
            if (tags.includes(tagName)) {
              wx.showToast({
                title: '标签已存在',
                icon: 'none'
              });
              return;
            }
            
            tags.push(tagName);
            that.setData({
              'formData.tags': tags
            });
          }
        }
      });
    },

    // 移除标签
    removeTag(e) {
      const index = e.currentTarget.dataset.index;
      const tags = [...this.data.formData.tags];
      tags.splice(index, 1);
      
      this.setData({
        'formData.tags': tags
      });
    },

    // 选择位置
    chooseLocation() {
      const that = this;
      wx.chooseLocation({
        success(res) {
          that.setData({
            'formData.location': res.name || res.address
          });
        },
        fail(err) {
          if (err.errMsg.indexOf('auth deny') !== -1) {
            wx.showModal({
              title: '提示',
              content: '需要授权位置信息',
              success(res) {
                if (res.confirm) {
                  wx.openSetting();
                }
              }
            });
          }
        }
      });
    },

    // 选择可见性
    chooseVisibility() {
      this.setData({
        showVisibility: true
      });
    },

    // 隐藏可见性弹窗
    hideVisibilityModal() {
      this.setData({
        showVisibility: false
      });
    },

    // 选择可见性选项
    selectVisibility(e) {
      const value = e.currentTarget.dataset.value;
      const visibilityText = value === 'self' ? '自己' : '所有亲';
      
      this.setData({
        'formData.visibility': value,
        'formData.visibilityText': visibilityText,
        showVisibility: false
      });
    },

    // 选择时间
    chooseTime() {
      console.log('trigger')
      this.setData({
        showTimePicker: true
      });
      
      // 触发picker
      setTimeout(() => {
        this.setData({
          showTimePicker: false
        });
      }, 100);
    },

    // 时间改变
    onTimeChange(e) {
      this.setData({
        'formData.recordTime': e.detail.value
      });
    },

    // 取消
    onCancel() {
      this.triggerEvent('cancel');
      this.resetForm();
    },

    // 保存
    onSave() {
      const { content, mediaList, tags, location, visibility, recordTime } = this.data.formData;
      
      // 验证
      if (!content && mediaList.length === 0) {
        wx.showToast({
          title: '请输入内容或添加图片/视频',
          icon: 'none'
        });
        return;
      }

      // 触发保存事件
      this.triggerEvent('save', {
        content,
        mediaList,
        tags,
        location,
        visibility,
        recordTime
      });

      // 重置表单
      this.resetForm();
    },

    // 重置表单
    resetForm() {
      this.setData({
        'formData.content': '',
        'formData.mediaList': [],
        'formData.tags': [],
        'formData.location': '',
        'formData.visibility': 'family',
        'formData.visibilityText': '所有亲'
      });
      this.initRecordTime();
    }
  }
});
