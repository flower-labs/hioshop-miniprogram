// components/baby-info/index.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        // 出生数据
        mode: '',
        dateVisible: false,
        date: new Date('2021-12-23').getTime(), // 支持时间戳传入
        dateText: '',

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
        babyInfo: {}
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
            console.log(babyInfo);
            this.setData({
                babyInfo: babyInfo
            });
        },

        // 出生日期选择方法
        showPicker(e) {
            const {
                mode
            } = e.currentTarget.dataset;
            this.setData({
                mode,
                [`${mode}Visible`]: true,
            });
        },
        handleClose(e) {
            console.log('handleClose:', e);
        },
        onConfirm(e) {
            const {
                value
            } = e.detail;
            const {
                mode
            } = this.data;

            console.log('confirm', value);

            this.setData({
                [mode]: value,
                [`${mode}Text`]: value,
            });
            const babyInfo = this.data.babyInfo;
            let key='baby_birth';
            babyInfo[key] = value;
            console.log(babyInfo);
            this.setData({
                babyInfo: babyInfo
            });
        },
        onColumnChange(e) {
            console.log('pick', e.detail.value);
        },

        //   性别选择方法,提交宝宝性别
        selectGender: function(e) {
            const gender = e.currentTarget.dataset.gender;
            const babyInfo = this.data.babyInfo;
            let key='baby_sex';
            babyInfo[key] = gender;
            console.log(babyInfo);
            this.setData({
                babyInfo: babyInfo
            });
          },

        // 初次提交宝宝信息
        saveBabyInfo: function () {
            const babyInfo = this.data.babyInfo;
            // 调用后端接口将宝宝信息保存到数据库，这里假设后端接口地址为 /saveBabyInfo
            wx.request({
                url: 'https://yourdomain.com/saveBabyInfo',
                method: 'POST',
                data: babyInfo,
                success: (res) => {
                    if (res.data.success) {
                        // 保存成功后，将信息存储到本地缓存一份（可选操作）
                        wx.setStorageSync('babyInfo', babyInfo);
                        this.setData({
                            isFirstRegister: false
                        });
                    } else {
                        // 处理保存失败的情况，比如提示用户
                        wx.showToast({
                            title: '保存信息失败，请稍后再试',
                            icon: 'none'
                        });
                    }
                },
                fail: (err) => {
                    // 处理请求失败情况，比如提示网络错误等
                    wx.showToast({
                        title: '网络连接失败，请检查网络',
                        icon: 'none'
                    });
                }
            });
        }
    }
})