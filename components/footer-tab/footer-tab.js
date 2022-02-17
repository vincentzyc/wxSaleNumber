const app = getApp()

Component({
  timer: 0,
  data: {
    active: 1,
    oldTab: 1,
    showCardTip: false
  },
  // pageLifetimes: {
  //   show: function () {
  //     // 页面被展示
  //     this.onCloseCardTip()
  //   }
  // },
  methods: {
    onChange(event) {
      if (this.data.active === event.detail) return
      this.setData({ oldTab: this.data.active, active: event.detail });
      switch (event.detail) {
        case 0:
          app.eventBus.emit('onRefreshNumber', false)
          break;
        case 1:
          app.eventBus.emit('onRefreshNumber', true)
          break;
        case 2:
          this.setData({ showCardTip: true })
          break;
        case 3:
          this.toOrder()
          break;
        default:
          break;
      }
    },
    toOrder() {
      wx.navigateTo({
        url: '../order/order',
        success: () => {
          this.timer = setTimeout(() => {
            this.onCloseCardTip()
          }, 1000);
        }
      })
    },
    onCloseCardTip() {
      this.setData({
        showCardTip: false,
        oldTab: this.data.active,
        active: this.data.oldTab
      })
    }
  }
})
