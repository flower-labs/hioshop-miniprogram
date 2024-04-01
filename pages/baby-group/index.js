const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const moment = require('moment');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    dialogKey: '',
    creatDialogVisible: false,
    codeDialogVisible: false,
    joinDialogVisible: false,
    isGroupExist: false,
    inviteCode: '',
    // 加入群组输入的code
    acceptInviteCode: '',
    codeLoading: false,
    groupName: '',
    groupExtra: '',
    groupInfo: {
      id: '',
      name: '',
      extra: '',
      owner: '',
      members: '',
      createTime: '',
    },
  },
  showDialog(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [key]: true, dialogKey: key });
  },
  closeDialog() {
    const { dialogKey } = this.data;
    this.setData({ [dialogKey]: false });
  },
  /** 生成邀请码 */
  generateInviteCode() {
    // 传递当前的群组id，拿到生成的邀请码并保存到粘贴板
    if (!this.data.groupInfo.id) {
      return;
    }
    this.setData({ codeLoading: true });
    util
      .request(
        api.GenerateInviteCode,
        {
          group_id: this.data.groupInfo.id,
        },
        'POST',
      )
      .then(response => {
        this.setData({ codeLoading: false });
        if (response.data.success === 1) {
          util.showSuccessToast('生成成功');
          this.setData({
            inviteCode: response.data.code,
          });
          // this.closeDialog();
          // this.queryGroupList();
        }
      });
  },
  /** 复制邀请码到粘贴板 */
  copyToClipboard() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data);
          },
        });
      },
    });
  },
  /** 加入群组 */
  handleJoinGroup() {
    const { acceptInviteCode } = this.data;
    if (!acceptInviteCode) {
      util.showErrorToast('邀请码不能为空');
    }
    util.request(api.AcceptGroupInvite, { code: acceptInviteCode }, 'POST').then(response => {
      console.log('response', response);
      if (response.data?.success === 1) {
        util.showSuccessToast('创建成功');
      } else {
        util.showErrorToast(response.errmsg);
      }
      this.closeDialog();
      this.setData({ groupName: '', groupExtra: '' });
      this.queryGroupList();
    });
  },
  onInputChange(event) {
    const { key } = event.currentTarget.dataset;
    const { value } = event.detail;
    this.setData({ [key]: value });
  },
  /** 查询群组列表 */
  queryGroupList() {
    this.setData({ loading: true });
    util.request(api.BabyGroupList, 'POST').then(response => {
      this.setData({ loading: false });
      if (response.data.groupList.length > 0) {
        const { id, group_name, owner_id, user_ids, extra, create_time } = response.data.groupList[0];
        const formattedTime = moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss');
        this.setData({
          isGroupExist: true,
          groupInfo: { name: group_name, extra, owner: owner_id, members: user_ids, createTime: formattedTime, id },
        });
      } else {
        this.setData({ isGroupExist: false });
      }
    });
  },
  /** 创建群组 */
  handleGroupCreate() {
    const { groupName, groupExtra } = this.data;
    if (!this.data.groupName) {
      util.showErrorToast('群组名称不能为空');
    }
    util
      .request(
        api.AddBabyGroup,
        {
          group_name: groupName,
          extra: groupExtra,
        },
        'POST',
      )
      .then(response => {
        if (response.data.success === 1) {
          util.showSuccessToast('创建成功');
        }
        this.closeDialog();
        this.setData({ groupName: '', groupExtra: '' });
        this.queryGroupList();
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.queryGroupList();
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
