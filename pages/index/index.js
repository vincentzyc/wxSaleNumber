import Api from '../../api/index'
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    active: 0,
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
      url: '../location/location'
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
    app.globalData.cmData = res
    this.setData({ bannerUrl: res.headImg })
  }
})
