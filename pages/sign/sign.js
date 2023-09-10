// pages/sign/sign.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img1: 'https://tdesign.gtimg.com/miniprogram/images/example1.png',
        img2: 'https://tdesign.gtimg.com/miniprogram/images/example2.png',
        img3: 'https://tdesign.gtimg.com/miniprogram/images/example3.png',
        calendar: [],
        signed: [],  // 保存签到状态的数组，签到为 true，未签到为 false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getCalendar();
    },
    getCalendar() {
        // 获取当前日期
        const today = new Date();
        // 创建一个数组，用于保存最近七天的日期
        const dates = [];
          // 初始化签到状态
  const signed = [];
        // 循环七次，依次计算日期并添加到数组中
        for (let i = -4; i < 3; i++) {
            const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
            dates.push(date);
                // 初始化签到状态为 false
    signed.push(false);
        }
        // 将日期数组按照时间顺序排列
        dates.sort((a, b) => a.getTime() - b.getTime());
        // 使用 map 方法将日期转换为字符串格式
        const dateStrings = dates.map(date => {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        });
        console.log(dateStrings);
        this.setData({
            signed: signed,
            calendar: dateStrings
        })

    },
    // 在 js 中定义 onSignTap 函数，用于处理签到事件
    onSignTap(e) {
        const index = e.currentTarget.dataset.index;
        const signed = this.data.signed;
        // 如果已经签到了，不做任何处理
        if (signed[index]) {
            return;
        }
        // 签到成功，更新签到状态
        signed[index] = true;
        this.setData({
            signed: signed
        });
        this.getCalendar();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})