import { handleBabyModify } from './utils';

Page({
  data: {
    /** 记录ID */
    uuid: '',
    /** 字段名 */
    field: '',
    /** 字段中 */
    value: '',
    /** 编辑页标题 */
    fieldTitle: '',
  },
  onLoad(options) {
    const { uuid, field, value, fieldTitle } = options;
    this.setData({
      uuid,
      field,
      value: decodeURIComponent(value),
      fieldTitle: decodeURIComponent(fieldTitle),
    });
    wx.setNavigationBarTitle({ title: decodeURIComponent(fieldTitle) });
  },
  handleInputChange(e) {
    this.setData({ value: e.detail.value });
  },
  async saveInfo() {
    const { uuid, field, value } = this.data;
    await handleBabyModify({ uuid, [field]: value });
    wx.navigateBack();
  },
});
