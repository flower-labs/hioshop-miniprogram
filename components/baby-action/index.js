// components/baby-record-item/index.js
import moment from 'moment';
Component({
  /** 组件的属性列表 */
  properties: {
    newAction: {
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: ['milk'], // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    isCustomTime: {
      type: Boolean, 
      value: false,
    },
    isEditing: {
      type: Boolean, 
      value: false,
    },
    startTime: {
      type: String,
      value: moment().format('HH:mm'),
    },
    endTime: {
      type: String,
      value: moment().add(15, 'minutes').format('HH:mm'),
    },
    milkAmount: {
      type: String,
      value: '',
    },
    extra: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    mode: '',
    actionMap: [
      {
        key: 'milk',
        name: '喂奶',
        value: 'milk',
        image: 'http://cdn.bajie.club/babycare/milk.svg',
      },
      {
        key: 'pee',
        name: '嘘嘘',
        value: 'pee',
        image: 'http://cdn.bajie.club/babycare/pee.svg',
      },
      {
        key: 'shit',
        name: '拉粑粑',
        value: 'shit',
        image: 'http://cdn.bajie.club/babycare/shit1.svg',
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /** 是否自定义时间 */
    _handleCustomizeTime(e) {
      const { value } = e.detail;
      const newStart = moment().format('HH:mm');
      const newEnd = moment().add(15, 'minutes').format('HH:mm');
      const { startTime, endTime } = this.data;
      this.setData({
        isCustomTime: value,
        startTime: value ? newStart : startTime,
        endTime: value ? newEnd : endTime,
      });
    },
    /** 显示时间选择器 */
    _showPicker(e) {
      const { mode } = e.currentTarget.dataset;
      this.setData({
        mode: mode,
        [`${mode}Visible`]: true,
      });
    },
    /** 隐藏时间选择器 */
    _hidePicker() {
      const { mode } = this.data;
      this.setData({
        [`${mode}Visible`]: false,
      });
    },
    /** 确认时间选择 */
    _onConfirm(e) {
      const { value } = e.detail;
      const { mode } = this.data;
      this.setData({
        [`${mode}Time`]: value,
      });
      this._hidePicker();
    },
    /** 切换记录项目 */
    _handleActionChange(e) {
      this.setData({ newAction: e.detail.value });
    },
    /** 更新喝奶量 */
    _handleMilkInput: function (event) {
      this.setData({
        milkAmount: event.detail.value,
      });
    },
    /** 更新备注 */
    _handleExtraInput(e) {
      this.setData({
        extra: e.detail.value,
      });
    },
    /** 获取当前表单数据 */
    getCurrentFields() {
      return this.data;
    },
    clearExtra() {
      this.setData({
        extra: '',
      })
    }
  },
});
