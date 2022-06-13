// components/tabbar/tabbar.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeTabbar: {
      type: String,
      value: 'number'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeTabbar(e) {
      if(e.currentTarget.dataset.id===this.properties.activeTabbar) return;
      console.log(e.currentTarget.dataset.id);
      console.log(app.globalData);
      if(e.currentTarget.dataset.id==='number') {
        app.eventBus.emit('onRefreshNumber', true)
        wx.navigateTo({
          url: '../index/index',
          success: () => {
            this.timer = setTimeout(() => {
              this.onCloseCardTip()
            }, 1000);
          }
        })
      }
    }
  }
})
