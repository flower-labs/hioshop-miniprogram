var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
    data: {
        list: [{
                id: 1,
                title: "Python数据分析",
                category: "职场",
                price: 159,
                cover: "https://picsum.photos/400/300",
            },
            {
                id: 2,
                title: "Figma系统课程",
                category: "职场",
                price: 189,
                cover: "https://picsum.photos/400/301",
            },
            {
                id: 3,
                title: "教师资格证",
                category: "考试",
                price: 269,
                cover: "https://picsum.photos/400/302",
            },
            {
                id: 4,
                title: "手机摄影课",
                category: "兴趣",
                price: 99,
                cover: "https://picsum.photos/400/303",
            },
        ],
        couresList:{},
    },
    onLoad() {
        this.test();
    },
    test() {
        util
            .request(
                api.CoureseList
            ).then(
                res => {
                    // 后端正常返回
                    console.log(res);
                    if (res.data.code === 200) {
                        this.setData({
                            couresList: res.data.data
                        })
                    } else {
                        wx.showToast({
                            title: res.data.msg || '数据获取失败',
                            icon: 'none'
                        })
                    }
                }
            )
    },
    goDetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/detail/detail?id=" + id
        });
    },
});