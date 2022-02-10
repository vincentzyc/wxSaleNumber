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
    wx.showLoading()
    const cmData = await Api.Common.getPidInfo({ pid: "23126" })
    const rulesList = await Api.Common.getRulesList()
    app.globalData.cmData = cmData
    app.globalData.rulesList = rulesList
    this.setData({ bannerUrl: cmData.headImg })
    if (rulesList?.sideRules) app.eventBus.emit('get-sideRules', rulesList.sideRules)
    wx.hideLoading()
  }
})
