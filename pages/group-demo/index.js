// pages/group/group.js
const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const moment = require('moment');
Page({
    data: {
        isGroupExist: false,
        loading: false,
        dialogKey: '',
        creatDialogVisible: false,
        codeDialogVisible: false,
        joinDialogVisible: false,
        searchDialogVisible: false,
        isGroupExist: false,
        inviteCode: '',
        // 加入群组输入的code
        acceptInviteCode: '',
        codeLoading: false,
        groupName: '',
        groupExtra: '',
        groups: [], // 所有群组数据
        groupInfo: {
            id: '',
            name: '',
            extra: '',
            owner: '',
            members: '',
            createTime: '',
        },
        searchedGroup: null, // 查询到的单个群组
        searchMode: false, // 是否处于查询模式
        searchKeyword: '', // 搜索关键词

    },
    showDialog(e) {
        const {
            key
        } = e.currentTarget.dataset;
        this.setData({
            [key]: true,
            dialogKey: key
        });
    },

    closeDialog() {
        const {
            dialogKey
        } = this.data;
        this.setData({
            [dialogKey]: false
        });
    },
    /** 生成邀请码 */
    generateInviteCode() {
        // 传递当前的群组id，拿到生成的邀请码并保存到粘贴板
        if (!this.data.groupInfo.id) {
            return;
        }
        this.setData({
            codeLoading: true
        });
        util
            .request(
                api.GenerateInviteCode, {
                    group_id: this.data.groupInfo.id,
                },
                'POST',
            )
            .then(response => {
                this.setData({
                    codeLoading: false
                });
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
        const {
            acceptInviteCode
        } = this.data;
        if (!acceptInviteCode) {
            util.showErrorToast('邀请码不能为空');
        }
        util.request(api.AcceptGroupInvite, {
            code: acceptInviteCode
        }, 'POST').then(response => {
            console.log('response', response);
            if (response.data?.success === 1) {
                util.showSuccessToast('创建成功');
            } else {
                util.showErrorToast(response.errmsg);
            }
            this.closeDialog();
            this.setData({
                groupName: '',
                groupExtra: ''
            });
            this.queryGroupList();
        });
    },
    onInputChange(event) {
        const {
            key
        } = event.currentTarget.dataset;
        const {
            value
        } = event.detail;
        this.setData({
            [key]: value
        });
    },
    /** 查询群组列表 */
    queryGroupList() {
        this.setData({
            loading: true
        });
        util.request(api.BabyGroupList, 'POST').then(response => {
            this.setData({
                loading: false
            });
            if (response.data.groupList.length > 0) {
                const {
                    id,
                    group_name,
                    owner_id,
                    user_ids,
                    extra,
                    create_time
                } = response.data.groupList[0];
                const formattedTime = moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss');
                this.setData({
                    isGroupExist: true,
                    groupInfo: {
                        name: group_name,
                        extra,
                        owner: owner_id,
                        members: user_ids,
                        createTime: formattedTime,
                        id
                    },
                });
            } else {
                this.setData({
                    isGroupExist: false
                });
            }
        });
    },
    /** 创建群组 */
    handleGroupCreate() {
        const {
            groupName,
            groupExtra
        } = this.data;
        if (!this.data.groupName) {
            util.showErrorToast('群组名称不能为空');
        }
        util
            .request(
                api.AddBabyGroup, {
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
                this.setData({
                    groupName: '',
                    groupExtra: ''
                });
                this.queryGroupList();
            });
    },
    onLoad() {
        // 加载用户已加入的群组
        this.loadGroups();
        // this.queryGroupList();
        console.log(this.data.groups);
    },

    // 加载群组数据
    loadGroups() {
        // 这里应该是从服务器获取数据的实际逻辑

        // 模拟数据
        const mockGroups = [{
            id: 1,
            name: '群名1',
            extra: '描述',
            owner: '小猫',
            members: '小明、小刚',
            createTime: ''
        }, {
            id: 2,
            name: '花花2',
            extra: '描述',
            owner: '小猫',
            members: '小明、小刚',
            createTime: ''
        }, {
            id: 3,
            name: '花花',
            extra: '描述',
            owner: '小猫',
            members: '小明、小刚',
            createTime: ''
        }, ];
        this.setData({
            groups: mockGroups
        });
    },



    // 退出群组
    exitGroup(e) {
        const groupId = e.currentTarget.dataset.id;
        wx.showModal({
            title: '提示',
            content: '确定要退出该群组吗？',
            success: (res) => {
                if (res.confirm) {
                    // 这里应该是调用API退出群组的实际逻辑
                    this.setData({
                        groups: this.data.groups.filter(group => group.id !== groupId),
                        searchedGroup: null,
                        searchMode: false
                    });
                    wx.showToast({
                        title: '已退出'
                    });
                }
            }
        });
    },

    // 切换查询模式
    toggleSearchMode(e) {
        if (this.data.searchMode) {
            this.setData({
                searchMode: false,
                searchDialogVisible: false,
                searchedGroup: null
            });
        } else {
            this.setData({
                searchDialogVisible: true,
            });
        }
    },


    // 查询群组
    searchGroup() {
        const {
            searchKeyword,
            groups
        } = this.data;
        if (!searchKeyword.trim()) {
            wx.showToast({
                title: '请输入搜索关键词',
                icon: 'none'
            });
            return;
        }

        const foundGroup = groups.filter(group => 
            group.name.includes(searchKeyword));

        this.setData({
            searchedGroup: foundGroup || null,
            searchMode: true,
            searchKeyword: ''
        });

        if (!foundGroup) {
            wx.showToast({
                title: '未找到匹配的群组',
                icon: 'none'
            });
        }
    }
});