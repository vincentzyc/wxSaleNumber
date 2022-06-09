// app.js
import EventBus from '/event-bus/index.js';
import '/weapp-cookie/index'
App({
  eventBus: new EventBus(),
  getUserInfo() {
    wx.login({
      success: res => {
        console.log('登录', res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId    
        this.globalData.userCode = res.code
      }
    });
  },
  onLaunch(options) {
    if (options.query.pid) this.globalData.pid = options.query.pid
    if (options.query.id) this.globalData.templateId = options.query.id
    this.globalData.query = options.query
    this.getUserInfo()
  },
  setGlobal(key, value) {
    this.globalData[key] = value
  },
  getGlobal(key) {
    return this.globalData[key] || null
  },
  globalData: {
    templateId: '',
    userCode: '',
    pid: '26058',
    query: '',
    cmData: null,
    wxPayAccount: null,
    selectNumber: null,
    submitForm: null,
    userInfo: {},
    userPhoneNo:''
  }
})
