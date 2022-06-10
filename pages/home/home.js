// pages/home/home.js
const app = getApp()
import Api from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTabbar: 'home',
    num: '15622122628',
    userInfo: {
      nickName: '用户昵称',
      avatarUrl: '/assets/images/head.png'
    },
    showBtn: true,
    loginStatus: '授权登录'
  },

  toOrder(e) {
    if(this.data.loginStatus === '授权登录') {
      wx.showToast({
        icon: 'none',
        title: '请先授权登录！'
      })
      return;
    }
    let orderType = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../orderCenter/orderCenter?orderType='+orderType
    })
  },
  toSetAddress() {
    if(this.data.loginStatus === '授权登录') {
      wx.showToast({
        icon: 'none',
        title: '请先授权登录！'
      })
      return;
    }
    wx.navigateTo({
      url: '../addressForm/addressForm'
    })
  },
  toService() {
    let link = 'https://h5.lipush.com/h5/index.html?id=2022022417190700012'
    wx.navigateTo({
      url: '../webview/webview?link=' + encodeURIComponent(link)
    })
  },
  toAllOrderList() {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  getUserProfile() {
    let userInfo = app.getGlobal('userInfo')
    if(userInfo.hasOwnProperty('nickName')) return;
    wx.getUserProfile({
      desc: '获取昵称头像', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        let nickName = res.userInfo.nickName
        let avatarUrl = res.userInfo.avatarUrl
        this.setData({
          ['userInfo.avatarUrl']: avatarUrl
        })
        if(!this.data.showBtn) {
          this.setData({
            ['userInfo.nickName']: nickName
          })
        }
        app.setGlobal('userInfo', res.userInfo)
      }
    })
  },
  //判断是否登录
  async getUserLogin() {
    let userCode = app.getGlobal('userCode')
    let params = {code:userCode}
    const res = await Api.Junpin.getOpenId(params)
    //登录 已登录-获取手机号码 无-需授权绑定手机
    if(res.data==='SUCCESS') {
      app.setGlobal('userPhoneNo',res.message)
      this.setData({
        showBtn: false,
        loginStatus: '已登录'
      })
      let userInfo = app.getGlobal('userInfo')
      if(userInfo.hasOwnProperty('nickName')) {
        this.setData({
          ['userInfo.nickName']: userInfo.nickName,
        })
      }else {
        this.setData({
          ['userInfo.nickName']: '用户昵称',
        })
      }
    }else {
      this.setData({
        showBtn: true,
        loginStatus: '授权登录'
      })
      //重新调用微信登录获取code
      app.getUserInfo()
      this.setData({
        ['userInfo.nickName']: '点击登录',
      })
    }
  },
  async getPhoneNumber(e) {
    //授权手机号码
    if ("getPhoneNumber:ok" !== e.detail.errMsg) {
      wx.showToast({
        icon: 'none',
        title: '无法获取手机号，登录失败！'
      })
      return;
    }else {
      let userCode = app.getGlobal('userCode')
      let params = {
        code: userCode,
        iv: e.detail.iv,
        encrypted: e.detail.encryptedData
      }
      let res = await Api.Junpin.getPhone(params)
      if(res) {
        app.setGlobal('userPhoneNo',res.phoneNumber)
        this.setData({
          showBtn: false,
          loginStatus: '已登录'
        })
        wx.showToast({
          icon: 'none',
          title: '登录成功！'
        })
        let userInfo = app.getGlobal('userInfo')
        if(userInfo.hasOwnProperty('nickName')) {
          this.setData({
            ['userInfo.nickName']: userInfo.nickName,
          })
        }else {
          this.setData({
            ['userInfo.nickName']: '用户昵称',
          })
        }
      }else {
        console.log(res,'手机号码绑定失败');
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //判断用户是否登录 有无手机号码
    let userPhoneNo =  app.getGlobal('userPhoneNo')
    if(!userPhoneNo) {
      this.getUserLogin()
    }else {
      this.setData({
        showBtn: false,
        loginStatus: '已登录'
      })
    }
    //获取微信头像昵称授权
    let userInfo = app.getGlobal('userInfo')
    if(userInfo.hasOwnProperty('nickName')) {
      this.setData({
        ['userInfo.avatarUrl']: userInfo.avatarUrl
      })
      if(!this.data.showBtn) {
        this.setData({
          ['userInfo.nickName']: userInfo.nickName
        })
      }
    }else {
      this.getUserProfile()
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})