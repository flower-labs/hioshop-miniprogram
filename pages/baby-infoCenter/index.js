// pages/baby-infoCenter/index.js
const api = require('../../config/api.js');
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasInfo: '',
    birthDate: '',
    years: '',
    days: '',
    months: '',
    babyInfo: {},
    uuid: '',
    coverImage: '', // 封面图片地址
  },
  validateGender(e) {
    const gender = e.detail.value;
    const isValid = gender === '男' || gender === '女';
    this.setData({
      validGender: isValid,
    });
    if (!isValid) {
      wx.showToast({
        title: '性别只能输入男或女',
        icon: 'none',
      });
    }
  },
  validateBirthday(e) {
    const birthday = e.detail.value;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const isValid = regex.test(birthday);
    this.setData({
      validBirthday: isValid,
    });
    if (!isValid) {
      wx.showToast({
        title: '生日格式应为 nnnn-mm-dd',
        icon: 'none',
      });
    }
  },
  submitForm(e) {
    const newInfo = e.detail.value;
    const { baby_sex, baby_birth } = newInfo;
    console.log(baby_sex);
    console.log(baby_birth);
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const flag = baby_sex == '男' || baby_sex == '女' ? (regex.test(baby_birth) ? true : false) : false;
    console.log(flag);
    if (flag) {
      util
        .request(
          api.EditBabyDetail,
          {
            uuid: this.data.uuid,
            baby_name: newInfo.baby_name,
            baby_sex: newInfo.baby_sex,
            extra: newInfo.extra,
            baby_birth: newInfo.baby_birth,
            baby_height: newInfo.baby_height,
            baby_weight: newInfo.baby_weight,
            baby_blood_type: newInfo.baby_blood_type,
          },
          'POST',
        )
        .then(res => {
          console.log('res', res);
          this.setData({
            babyInfo: newInfo,
          });
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000,
          });
        });
    } else {
      wx.showToast({
        title: '请输入正确的格式',
        icon: 'none',
      });
    }
  },
  // 设置封面图片的方法
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
            //   缓存到本地
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
  async onLoad(options) {
    try {
      // 异步请求宝宝详情
      const resp = await util.request(api.GetBabyDetail, 'POST');

      // 检查请求结果
      if (resp.errno === 0 && Array.isArray(resp.data) && resp.data.length > 0) {
        // 如果有宝宝信息，设置到页面数据中
        this.setData({
          hasInfo: true,
          babyInfo: resp.data[0],
          uuid: resp.data[0].uuid,
        });
      } else {
        // 如果没有宝宝信息，跳转到注册页面
        wx.redirectTo({
          url: '/pages/baby-register/baby-register',
        });
        return; // 跳转后无需继续执行
      }
    } catch (error) {
      // 捕获请求异常
      console.error('请求宝宝详情失败:', error);
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none',
      });
    }

    // 从缓存中获取封面图片并设置到页面数据中
    const coverImage = wx.getStorageSync('coverImage');
    this.setData({
      coverImage,
    });
    // 计算宝宝年龄
    const birthDate = new Date(this.data.babyInfo.baby_birth);
    const currentDate = new Date();

    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
      days += lastMonthDays;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    this.setData({
      years,
      months,
      days,
    });
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
