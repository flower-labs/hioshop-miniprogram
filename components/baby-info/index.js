// components/baby-info/index.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
import Message from 'tdesign-miniprogram/message/index';
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    // 出生数据
    mode: '',
    dateVisible: false,
    date: new Date('2021-12-23').getTime(), // 支持时间戳传入
    dateText: '',
    genderTagList: [
      { id: 'male', text: '男', image: 'http://cdn.bajie.club/babycare/baby-head-boy.png', isSelected: true },
      { id: 'female', text: '女', image: 'http://cdn.bajie.club/babycare/baby-head-girl.png', isSelected: false },
    ],
    relationTagList: [
      { id: 'mother', text: '妈妈', image: '', isSelected: true },
      { id: 'father', text: '爸爸', image: '', isSelected: false },
      { id: 'other', text: '其他', image: '', isSelected: false },
    ],
    // 指定选择区间起始值
    start: '2000-01-01 00:00:00',
    end: '2030-09-09 12:12:12',
    filter(type, options) {
      if (type === 'year') {
        return options.sort((a, b) => b.value - a.value);
      }
      return options;
    },
    popupProps: {
      usingCustomNavbar: true,
    },
    // 宝宝基础数据
    babyInfo: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初次提交宝宝昵称
    handleInput: function (e) {
      const field = e.currentTarget.dataset.field;
      const value = e.detail.value;
      const babyInfo = this.data.babyInfo;
      babyInfo[field] = value;
      this.setData({ babyInfo });
    },

    // 出生日期选择方法
    showPicker(e) {
      const { mode } = e.currentTarget.dataset;
      this.setData({
        mode,
        [`${mode}Visible`]: true,
      });
    },
    handleClose(e) {
      console.log('handleClose:', e);
    },
    onConfirm(e) {
      const { value } = e.detail;
      const { mode } = this.data;

      console.log('confirm', value);

      this.setData({
        [mode]: value,
        [`${mode}Text`]: value,
      });
      const babyInfo = this.data.babyInfo;
      babyInfo['babyBirth'] = value;
      this.setData({ babyInfo });
    },
    onColumnChange(e) {
      console.log('pick', e.detail.value);
    },

    /** 处理tag选中逻辑 */
    handleTagClick(e) {
      const type = e.currentTarget.dataset.type;
      const currentId = e.currentTarget.dataset.id;

      const targetTagList = type === 'gender' ? this.data.genderTagList : this.data.relationTagList;
      console.log(type, currentId, targetTagList);
      const newTagList = targetTagList.map((tag, i) => {
        if (tag.id === currentId) {
          return { ...tag, isSelected: !tag.selected };
        }
        return { ...tag, isSelected: false };
      });

      if (type === 'gender') {
        this.setData({
          genderTagList: newTagList,
        });
      } else {
        this.setData({
          relationTagList: newTagList,
        });
      }
    },

    // 初次提交宝宝信息
    saveBabyInfo: function () {
      console.log('save baby info', this.data);
      const babyInfo = this.data.babyInfo;
      const { babyBirth, babyName } = babyInfo;
      const genderId = this.data.genderTagList.find(item => item.isSelected)?.id;
      const relationId = this.data.relationTagList.find(item => item.isSelected)?.id;

      if (babyBirth && babyName && genderId && relationId) {
        util
          .request(
            api.AddBabyDetail,
            {
              baby_name: babyName,
              baby_sex: genderId,
              baby_birth: babyBirth,
              baby_height: '',
              baby_weight: '',
              baby_relation: relationId,
              baby_blood_type: '',
              extra: '',
            },
            'POST',
          )
          .then(res => {
            if (res.data?.success) {
              Message.success({
                context: this,
                offset: [20, 32],
                duration: 3000,
                content: '宝贝信息添加成功',
              });
              wx.redirectTo({ url: '/pages/baby-setting/index' });
            } else {
              Message.warning({
                context: this,
                offset: [20, 32],
                duration: 3000,
                content: res.errmsg,
              });
              // 异常情况下也尝试跳转
              wx.redirectTo({ url: '/pages/baby-setting/index' });
            }
          });
      } else {
        Message.warning({
          context: this,
          offset: [20, 32],
          duration: 3000,
          content: '请输入姓名及出生日期',
        });
      }
    },
  },
});
