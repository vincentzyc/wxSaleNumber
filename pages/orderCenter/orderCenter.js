// pages/orderCenter/orderCenter.js
const app = getApp()
import Api from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderActive: 'TO_PAY',
    typeList: [
      {id:'TO_PAY', title:'待付款'},
      {id:'TO_DELIVER', title:'待收货'},
      {id:'TO_ACTIVE', title:'待激活'},
      {id:'FINISH', title:'已完成'},
    ],
    orderList: []
  },
  activeChange(e) {
    let orderActive = e.detail.name
    this.setData({ orderActive: orderActive })
    this.getOrderList()
  },
  toDetail(e) {
    const orderItem = e.currentTarget?.dataset?.orderItem
    if (orderItem) {
      wx.navigateTo({
        url: '../orderdetail/orderdetail',
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', orderItem)
        }
      })
    }
  },
  async getOrderList() {
    let phoneNumber = app.getGlobal('userPhoneNo')
    let params = {
      pageIndex: 1,
      pageSize: 100,
      status: this.data.orderActive,
      phoneNumber
    }
    wx.showLoading({
      title: '列表加载中',
      mask: true
    })
    const res = await Api.Junpin.getOrderList(params)
    if (Array.isArray(res.list)) {
      this.setData({ orderList: res.list })
    }
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderType) {
      let orderType = options.orderType
      this.setData({ orderActive: orderType })
      this.getOrderList()
    }
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