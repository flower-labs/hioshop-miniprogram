// pages/baby-infoCenter/index.js
const api = require('../../config/api.js');
const util = require('../../utils/util.js');
import { ACTION_TITLE_MAP, calculateDateDifference } from './utils';
import ActionSheet, { ActionSheetTheme } from 'tdesign-miniprogram/action-sheet/index';
import { handleBabyModify } from '../edit/utils';
import { handleBackgroundSave } from './utils';

Page({
  data: {
    hasInfo: '',
    birthDate: '',
    babyInfo: {},
    babyBirth: {},
    actionPanelType: '',
    uuid: '',
    coverImage: '', // 封面图片地址
    mode: '',
    dateVisible: false,
    date: new Date().getTime(), // 支持时间戳传入
    dateText: '',
    qiniuToken: {
      token: '',
      url: '',
    },
  },

  async setCoverImage() {
    try {
      await this.getQiniuToken();

      const res = await new Promise((resolve, reject) => {
        wx.chooseMedia({
          count: 1,
          sizeType: ['compressed'],
          mediaType: ['image'],
          sourceType: ['album', 'camera'], // 修正原代码中的拼写错误soureType
          extensions: ['jpg', 'png', 'jpeg', 'gif'],
          success: resolve,
          fail: reject,
        });
      });

      const defaultImage = res.tempFiles[0];
      const fileSize = defaultImage.size / 1024 / 1024;

      if (fileSize > 1.5) {
        wx.showToast({ title: '图片过大，请切换后重试', icon: 'none' });
        return 
      }

      const { token } = this.data.qiniuToken;

      const uploadRes = await new Promise((resolve, reject) => {
        wx.uploadFile({
          url: 'https://up-z0.qiniup.com',
          filePath: defaultImage.tempFilePath,
          name: 'file',
          formData: { token },
          success: resolve,
          fail: reject,
        });
      });

      // 处理上传结果
      if (uploadRes.statusCode === 200) {
        const document = JSON.parse(uploadRes.data);
        if (document.key) {
          const saveResult = await handleBackgroundSave(document.key);
          if (saveResult) {
            this.getCoverImage();
          }
        }
      } else {
        throw new Error('上传失败，状态码非200');
      }
    } catch (error) {
      // 统一处理所有环节的错误
      console.error('设置封面失败:', error);
      wx.showToast({ title: '上传失败', icon: 'none' });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    this.getBabyDetail();
    this.getCoverImage();
  },

  async getCoverImage() {
    const resp = await util.request(api.GetBackground, 'POST');
    const content = resp.data;
    const prefix = `https://cdn.bajie.club/`;
    if (content.background_image) {
      this.setData({ coverImage: prefix + content.background_image });
    }
  },
  async getBabyDetail() {
    try {
      wx.showLoading({ title: '加载中…' });
      // 异步请求宝宝详情
      const resp = await util.request(api.GetBabyDetail, 'POST');
      wx.hideLoading();
      // 检查请求结果
      if (resp.errno === 0 && Array.isArray(resp.data) && resp.data.length > 0) {
        const defaultBabyId = wx.getStorageSync('defaultBabyId');
        const defaultBabyInfo = (resp.data || []).find(item => item.id === defaultBabyId);
        const babyInfo = defaultBabyInfo || resp.data[0];

        this.setData({
          hasInfo: true,
          babyInfo: babyInfo,
          uuid: babyInfo.uuid,
          date: new Date(babyInfo.baby_birth).getTime(),
          babyBirth: calculateDateDifference(babyInfo.baby_birth),
        });
      } else {
        wx.redirectTo({ url: '/pages/baby-register/baby-register' });
        return;
      }
    } catch (error) {
      console.error('请求宝宝详情失败:', error);
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none',
      });
    }
  },
  handleEdit(e) {
    const field = e.currentTarget.dataset.field;
    const value = encodeURIComponent(this.data.babyInfo[field]);
    const uuid = this.data.uuid;
    const fieldTitle = ACTION_TITLE_MAP.find(item => item.key === field)?.title || '';
    wx.navigateTo({
      url: `/pages/edit/edit?uuid=${uuid}&field=${field}&value=${value}&fieldTitle=${encodeURIComponent(fieldTitle)}`,
    });
  },

  handleBabySexModify() {
    this.setData({ actionPanelType: 'sex' });
    ActionSheet.show({
      theme: ActionSheetTheme.List,
      selector: '#t-opreation-sheet',
      context: this,
      description: '请选择宝宝性别',
      items: [
        {
          label: '小美女',
        },
        {
          label: '小帅哥',
        },
      ],
    });
  },
  gotoRelationPage() {
    wx.redirectTo({ url: '/pages/rela-group/rela-group' });
  },
  handleBabyBloodTypeModify() {
    this.setData({ actionPanelType: 'blood' });
    ActionSheet.show({
      theme: ActionSheetTheme.List,
      selector: '#t-opreation-sheet',
      context: this,
      description: '请选择宝宝血型',
      items: [
        {
          label: 'O型',
        },
        {
          label: 'A型',
        },
        {
          label: 'B型',
        },
        {
          label: 'AB型',
        },
        {
          label: '未知',
        },
      ],
    });
  },
  async handleActionSelected(e) {
    const { actionPanelType } = this.data;
    if (actionPanelType === 'sex') {
      const selectedLabel = e.detail.selected.label;
      wx.showLoading({ title: '修改中…' });
      await handleBabyModify({
        uuid: this.data.uuid,
        baby_sex: selectedLabel === '小美女' ? '2' : '1',
      });
      wx.hideLoading();
    } else if (actionPanelType === 'blood') {
      const selectedLabel = e.detail.selected.label;
      wx.showLoading({ title: '修改中…' });
      await handleBabyModify({
        uuid: this.data.uuid,
        baby_blood_type: selectedLabel,
      });
      wx.hideLoading();
    }
    this.getBabyDetail();
  },

  /** 展示生日选择器 */
  showPicker(e) {
    const { mode } = e.currentTarget.dataset;
    this.setData({
      mode,
      [`${mode}Visible`]: true,
    });
  },
  /** 隐藏生日选择器 */
  hidePicker() {
    const { mode } = this.data;
    this.setData({
      [`${mode}Visible`]: false,
    });
  },
  /** 选中生日 */
  async onConfirm(e) {
    const { value } = e.detail;
    const { mode } = this.data;

    this.setData({
      [mode]: value,
      [`${mode}Text`]: value,
    });

    wx.showLoading({ title: '修改中…' });
    await handleBabyModify({
      uuid: this.data.uuid,
      baby_birth: value,
    });
    wx.hideLoading();
    this.getBabyDetail();
  },

  async getQiniuToken() {
    const resp = await util.request(api.GetQiniuToken, 'POST');
    if (resp) {
      this.setData({
        qiniuToken: resp.data,
      });
    }
  },

  async getBackgroundImage() {
    const resp = await util.request(api.GetBackground, 'POST');
    console.log('getBackgroundImage, resp', resp.data);
    if (resp) {
      console.log('getBackgroundImage', resp.data);
      this.setData({
        qiniuToken: resp.data,
      });
    }
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
