// pages/rela-group/rela-group.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 妈妈相关数据
        momAvatar: false,
        momIsInvite: false,
        // 可根据实际是否有头像设置 true/false
        // 爸爸相关数据
        dadAvatar: false,
        dadIsInvite: true,
        dadVisitCount: 55,
        isCurrentUser: true,
        dadLastVisitTime: '06-08 19:28',
        // 可添加的亲友类型
        relativeTypes: [{
                type: 'grandma',
                name: '奶奶'
            },
            {
                type: 'maternalGrandma',
                name: '姥姥'
            },
            {
                type: 'maternalGrandma2',
                name: '外婆'
            },
            {
                type: 'maternalGrandpa',
                name: '外公'
            },
            {
                type: 'maternalGrandpa2',
                name: '姥爷'
            },
            {
                type: 'grandpa',
                name: '爷爷'
            },
            {
                type: 'aunt',
                name: '阿姨'
            },
            {
                type: 'littleAunt',
                name: '小姨'
            },
            {
                type: 'paternalAunt',
                name: '姑姑'
            },
            {
                type: 'godmother',
                name: '干妈'
            },
            {
                type: 'uncle',
                name: '舅舅'
            },
            {
                type: 'paternalUncle',
                name: '叔叔'
            },
            {
                type: 'other',
                name: '其他'
            }
        ]
    },
    // 返回上一页
    onNavBack() {
        wx.navigateBack();
    },

    // 邀请妈妈
    onInviteMom() {
        wx.showToast({
            title: '去邀请妈妈',
            icon: 'none'
        });
        // 可拓展：跳转邀请页面或调用邀请接口
        wx.navigateTo({
            url: `/pages/addRelative/addRelative?type="mom"&name="妈妈"`
        });
    },
    onInviteDad() {
        wx.showToast({
            title: '去邀请爸爸',
            icon: 'none'
        });
        // 可拓展：跳转邀请页面或调用邀请接口
        wx.navigateTo({
            url: `/pages/addRelative/addRelative?type="mom"&name="妈妈"`
        });
    },


    // 添加亲友逻辑
    // 添加亲友
    onAddRelative(e) {
        const {
            type,
            index
        } = e.currentTarget.dataset;
        const selectedRelative = this.data.relativeTypes[index];

        wx.navigateTo({
            url: `/pages/addRelative/addRelative?type=${type}&name=${selectedRelative.name}`
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

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