import Api from '../../api/index'
// location.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    active: 1,
    motto: 'Hello World',
    bannerUrl: ''
  },
  onChange(event) {
    console.log(event.detail);
    this.setData({ active: event.detail });

  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  async onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    const res = await Api.Common.getPidInfo({ pid: "23126" })
    console.log(res);
    app.setGlobal('cmData', res)
    this.setData({ bannerUrl: res.headImg })
  }
})
