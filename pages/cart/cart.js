Page({
  data: {
    isEditMode: false, // 是否处于编辑模式
    allChecked: false, // 全选状态
    totalPrice: "0.00", // 合计金额
    selectedCount: 0, // 选中商品数量
    // 模拟购物车数据
    cartList: [
      {
        id: 1,
        title: "Python零基础入门到精通实战课程",
        cover: "https://via.placeholder.com/160x120", // 替换为真实图片URL
        price: 99.0,
        quantity: 1,
        checked: false,
      },
      {
        id: 2,
        title: "微信小程序全栈开发实战",
        cover: "https://via.placeholder.com/160x120",
        price: 128.0,
        quantity: 2,
        checked: true,
      },
    ],
  },

  onLoad() {
    this.calculateTotal();
  },

  // 切换编辑/完成模式
  toggleEditMode() {
    this.setData({
      isEditMode: !this.data.isEditMode,
    });
  },

  // 单个商品选中状态改变
  onItemCheckChange(e) {
    const id = e.currentTarget.dataset.id;
    const index = this.data.cartList.findIndex((item) => item.id === id);

    if (index !== -1) {
      const list = this.data.cartList;
      list[index].checked = !list[index].checked;

      this.setData({
        cartList: list,
      });
      this.checkAllStatus();
      this.calculateTotal();
    }
  },

  // 检查全选状态
  checkAllStatus() {
    const list = this.data.cartList;
    const allChecked = list.length > 0 && list.every((item) => item.checked);
    this.setData({
      allChecked: allChecked,
    });
  },

  // 全选/取消全选
  toggleSelectAll() {
    const newAllChecked = !this.data.allChecked;
    const list = this.data.cartList.map((item) => ({
      ...item,
      checked: newAllChecked,
    }));

    this.setData({
      cartList: list,
      allChecked: newAllChecked,
    });
    this.calculateTotal();
  },

  // 增加数量
  increaseQty(e) {
    const id = e.currentTarget.dataset.id;
    const index = this.data.cartList.findIndex((item) => item.id === id);

    if (index !== -1) {
      const list = this.data.cartList;
      list[index].quantity += 1;
      this.setData({
        cartList: list,
      });
      this.calculateTotal();
    }
  },

  // 减少数量
  decreaseQty(e) {
    const id = e.currentTarget.dataset.id;
    const index = this.data.cartList.findIndex((item) => item.id === id);

    if (index !== -1) {
      const list = this.data.cartList;
      if (list[index].quantity > 1) {
        list[index].quantity -= 1;
        this.setData({
          cartList: list,
        });
        this.calculateTotal();
      } else {
        wx.showToast({
          title: "数量最少为1",
          icon: "none",
        });
      }
    }
  },

  // 删除商品 (编辑模式下)
  deleteItem(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确定要删除该课程吗？",
      success: (res) => {
        if (res.confirm) {
          const newList = this.data.cartList.filter((item) => item.id !== id);
          this.setData({
            cartList: newList,
          });
          this.checkAllStatus();
          this.calculateTotal();
        }
      },
    });
  },

  // 计算总金额和选中数量
  calculateTotal() {
    let total = 0;
    let count = 0;

    this.data.cartList.forEach((item) => {
      if (item.checked) {
        total += item.price * item.quantity;
        count += item.quantity;
      }
    });

    this.setData({
      totalPrice: total.toFixed(2),
      selectedCount: count,
    });
  },

  // 去结算
  handleCheckout() {
    if (this.data.selectedCount === 0) {
      wx.showToast({
        title: "请选择要结算的课程",
        icon: "none",
      });
      return;
    }

    // 这里添加跳转至订单确认页面的逻辑
    wx.navigateTo({
      url: "/pages/order/order?ids=" + this.getSelectedIds(),
    });
  },

  // 获取选中商品的ID字符串
  getSelectedIds() {
    return this.data.cartList
      .filter((item) => item.checked)
      .map((item) => item.id)
      .join(",");
  },

  // 去逛逛
  goToShop() {
    wx.switchTab({
      url: "/pages/index/index", // 假设首页是课程列表页
    });
  },
});
