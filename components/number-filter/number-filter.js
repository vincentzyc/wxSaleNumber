// components/number-filter.js

const app = getApp()

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
    show: false,
    sideRules: null,
    activeNames: [''],
    typeArray: [],
    prettyType: "",
    priceSegment: "",
    operator: "",
  },
  /**
   * 组件的方法列表
   */
  methods: {
    reset() {
      this.setData({ typeArray: [] })
    },
    confirm() {
      this.triggerEvent('getrules', {
        prettyType: this.data.prettyType,
        priceSegment: this.data.priceSegment,
        operator: this.data.operator,
      })
      this.onClose()
    },
    formatParam() {
      if (this.data.typeArray.length > 0) {
        this.data.operator = this.data.typeArray.filter((val => val.indexOf('中国') !== -1)).join(',')
        this.data.priceSegment = this.data.typeArray.filter((val => val.indexOf('~') !== -1 || val.indexOf('以及以上') !== -1)).join(',')
        this.data.prettyType = this.data.typeArray.filter((val => val.indexOf('中国') === -1 && val.indexOf('~') === -1 && val.indexOf('以及以上') === -1)).join(',')
        this.setData({
          prettyType: this.data.prettyType,
          priceSegment: this.data.priceSegment,
          operator: this.data.operator
        })
      } else {
        this.setData({
          prettyType: "",
          priceSegment: "",
          operator: ""
        })
      }
      this.confirm()
    },
    selectRules(e) {
      const val = e.currentTarget.dataset.tagvalue;
      if (this.data.typeArray.includes(val)) {
        const newArr = this.data.typeArray.filter((item) => item != val);
        this.setData({ typeArray: newArr })
      } else {
        this.data.typeArray.push(val);
        this.setData({ typeArray: this.data.typeArray })
      }
    },
    showPopup() {
      this.setData({ show: true });
    },
    onClose() {
      this.setData({ show: false });
    },
  },
  created() {
    app.eventBus.on('onGetSideRules', sideRules => {
      if (sideRules && !this.data.sideRules) {
        sideRules.splice(0, 1)
        this.setData({
          sideRules: sideRules,
          activeNames: sideRules.map(val => val.label)
        })
      }
    });
  },
  ready() {
    if (app.globalData?.rulesList?.sideRules && !this.data.sideRules) {
      app.globalData.rulesList.sideRules.splice(0, 1)
      this.setData({
        sideRules: app.globalData?.rulesList?.sideRules,
        activeNames: sideRules.map(val => val.label)
      })
    }
  }
})
