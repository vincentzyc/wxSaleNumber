// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    active: 0,
    bannerUrl: ''
  },

  onChange(event) {
    console.log(event.detail);
    this.setData({ active: event.detail });

  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../location/location'
    })
  },
  onReachBottom() {
    app.eventBus.emit('onReachBottom')
  },
  onGetBanner(url) {
    if (url) this.setData({ bannerUrl: url })
  },
  onLoad() {
    app.eventBus.on('onGetBanner', url => this.onGetBanner(url))
  }
})
