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
    show: true,
    sideRules: null,
    activeNames: [''],
    typeArray: []
  },
  observers: {
    typeArray: (nval) => {
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      console.log(nval);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
    app.eventBus.on('get-sideRules', sideRules => {
      if (sideRules && !this.data.sideRules) {
        console.log('111', sideRules);
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
      console.log('222', app.globalData);
    }
  }
})
