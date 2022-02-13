// app.js
import EventBus from '/event-bus/index.js';

App({
  eventBus: new EventBus(),
  onLaunch(options) {
    this.globalData.pid = options.query.pid
    this.globalData.query = options.query
    // // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // {code: "053FumFa1Y7JCC0lCSHa1xbuD11FumFT" ,errMsg: "login:ok"}
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
  },
  setGlobal(key, value) {
    this.globalData[key] = value
  },
  getGlobal(key) {
    return this.globalData[key] || null
  },
  globalData: {
    pid: '23126',
    query: '',
    cmData: null,
    selectNumber: null
  }
})
