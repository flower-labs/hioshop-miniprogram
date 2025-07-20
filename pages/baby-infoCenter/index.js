// pages/baby-infoCenter/index.js
const api = require('../../config/api.js');
const util = require('../../utils/util.js');
import { ACTION_TITLE_MAP, calculateDateDifference } from './utils';
import ActionSheet, { ActionSheetTheme } from 'tdesign-miniprogram/action-sheet/index';
import { handleBabyModify } from '../edit/utils';

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
  },
  setCover() {
    let that = this;
    wx.chooseMedia({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      soureType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        //  对上传文件的格式进行校验
        console.log(res);
        var picType = false;
        for (var i = 0; i < res.tempFiles.length; i++) {
          if (
            res.tempFiles[i].tempFilePath.includes('.png') ||
            res.tempFiles[i].tempFilePath.includes('.jpg') ||
            res.tempFiles[i].tempFilePath.includes('.jpeg') ||
            res.tempFiles[i].tempFilePath.includes('.gif')
          ) {
            picType = true;
            that.setData({
              coverImage: res.tempFiles[i].tempFilePath,
            });
            wx.setStorageSync('coverImage', that.data.coverImage);
          } else {
            picType = false;
            break;
          }
        }
        if (!picType) {
          wx.showToast({
            title: '支持.png/ .jpg/ .jpeg/ .gif 格式图片',
            icon: 'none',
          });
          return;
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '上传失败',
          icon: 'none',
        });
      },
      complete: function () {
        // complete
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    this.getBabyDetail();

    const coverImage = wx.getStorageSync('coverImage');
    this.setData({ coverImage });
  },

  async getBabyDetail() {
    try {
      wx.showLoading({ title: '加载中…' });
      // 异步请求宝宝详情
      const resp = await util.request(api.GetBabyDetail, 'POST');
      wx.hideLoading();
      // 检查请求结果
      if (resp.errno === 0 && Array.isArray(resp.data) && resp.data.length > 0) {
        const babyInfo = resp.data[0];
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getBabyDetail();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },
});
