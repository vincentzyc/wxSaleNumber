// 获取应用实例
const app = getApp()

Page({
  data: {
    bannerUrl: ''
  },
  onReachBottom() {
    app.eventBus.emit('onReachBottom')
  },
  onGetBanner(url) {
    if (url) this.setData({ bannerUrl: url })
  },
  onLoad() {
    console.log('onLoad');
    app.eventBus.on('onGetBanner', url => this.onGetBanner(url))
  },
  onShow: function () {
    // this.setData({ oldTab: this.data.active, active: this.data.oldTab });
  }
})
