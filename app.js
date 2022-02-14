// app.js
import EventBus from '/event-bus/index.js';

App({
  eventBus: new EventBus(),
  getUserInfo() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId    
        this.globalData.userCode = res.code
      }
    });
  },
  onLaunch(options) {
    if (options.query.pid) this.globalData.pid = options.query.pid
    this.globalData.query = options.query
    this.getUserInfo()
    // // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  setGlobal(key, value) {
    this.globalData[key] = value
  },
  getGlobal(key) {
    return this.globalData[key] || null
  },
  globalData: {
    userCode: '',
    pid: '23126',
    query: '',
    cmData: null,
    selectNumber: null,
    submitForm: null
  }
})
