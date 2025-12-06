// components/social-post/social-post.js
const api = require('../../config/api.js');
const util = require('../../utils/util.js');

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
    showTimePicker: false,
    qiniuToken: {
      token: '',
      url: ''
    }
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

    // 获取七牛云token
    async getQiniuToken() {
      try {
        const resp = await util.request(api.GetQiniuToken, {}, 'POST');
        if (resp && resp.data) {
          this.setData({
            qiniuToken: resp.data
          });
          return resp.data;
        }
      } catch (error) {
        console.error('获取七牛Token失败:', error);
        wx.showToast({
          title: '获取上传凭证失败',
          icon: 'none'
        });
        throw error;
      }
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
    async chooseMedia() {
      const that = this;
      const maxCount = 9 - this.data.formData.mediaList.length;
      
      if (maxCount <= 0) {
        wx.showToast({
          title: '最多只能添加9个媒体',
          icon: 'none'
        });
        return;
      }

      try {
        // 获取七牛云token
        await this.getQiniuToken();

        // 选择媒体
        const res = await new Promise((resolve, reject) => {
          wx.chooseMedia({
            count: maxCount,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            sizeType: ['compressed'],
            camera: 'back',
            success: resolve,
            fail: reject
          });
        });

        // 检查文件大小
        const validFiles = [];
        for (let file of res.tempFiles) {
          const fileSize = file.size / 1024 / 1024; // 转换为MB
          if (fileSize > 10) {
            wx.showToast({
              title: '文件过大，请选择小于10MB的文件',
              icon: 'none'
            });
            continue;
          }
          validFiles.push(file);
        }

        if (validFiles.length === 0) {
          return;
        }

        // 显示上传loading
        wx.showLoading({
          title: '上传中...',
          mask: true
        });

        // 上传文件到七牛云
        const uploadPromises = validFiles.map(file => this.uploadToQiniu(file));
        const uploadResults = await Promise.all(uploadPromises);

        // 过滤上传成功的文件
        const successFiles = uploadResults.filter(item => item !== null);
        console.log("🚀 ~ chooseMedia ~ successFiles:", successFiles)

        if (successFiles.length > 0) {
          // 添加到媒体列表
          that.setData({
            'formData.mediaList': [...that.data.formData.mediaList, ...successFiles]
          });

          wx.showToast({
            title: `成功上传${successFiles.length}个文件`,
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: '上传失败，请重试',
            icon: 'none'
          });
        }

      } catch (err) {
        console.error('选择媒体失败:', err);
        wx.hideLoading();
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    },

    // 上传文件到七牛云
    async uploadToQiniu(file) {
      const { token } = this.data.qiniuToken;
      const CDN_PREFIX = 'https://cdn.bajie.club/';

      try {
        const uploadRes = await new Promise((resolve, reject) => {
          wx.uploadFile({
            url: 'https://up-z0.qiniup.com',
            filePath: file.tempFilePath,
            name: 'file',
            formData: { token },
            success: resolve,
            fail: reject
          });
        });

        // 处理上传结果
        if (uploadRes.statusCode === 200) {
          const document = JSON.parse(uploadRes.data);
          if (document.key) {
            return {
              type: file.fileType, // 'image' 或 'video'
              url: CDN_PREFIX + document.key, // 使用七牛云返回的key构建完整URL
              poster: file.thumbTempFilePath || (CDN_PREFIX + document.key),
              key: document.key // 保存key以便后续使用
            };
          }
        }

        throw new Error('上传失败，状态码非200');
      } catch (error) {
        console.error('上传到七牛云失败:', error);
        return null;
      }
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
    async onSave() {
      const { content, mediaList, tags, location, visibility, recordTime } = this.data.formData;
      
      // 验证
      if (!content && mediaList.length === 0) {
        wx.showToast({
          title: '请输入内容或添加图片/视频',
          icon: 'none'
        });
        return;
      }

      try {
        wx.showLoading({
          title: '发布中...',
          mask: true
        });

        // 提取图片URL（只传图片，不传视频）
        const images = mediaList
          .filter(item => ['image'].includes(item.type))
          .map(item => item.url);

        const privacyType = visibility === 'self' ? 'PRIVATE' : 'FAMILY';

        const res = await util.request(api.AddBabySocialRecord, {
          content,
          location,
          privacy_type: privacyType,
          images
        }, 'POST');

        wx.hideLoading();

        if (res.errno === 0) {
          wx.showToast({
            title: '发布成功',
            icon: 'success'
          });

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
        } else {
          wx.showToast({
            title: res.errmsg || '发布失败',
            icon: 'none'
          });
        }
      } catch (error) {
        wx.hideLoading();
        console.error('发布失败:', error);
        wx.showToast({
          title: '发布失败，请重试',
          icon: 'none'
        });
      }
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
