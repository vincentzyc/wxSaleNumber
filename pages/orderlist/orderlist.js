// pages/order.js
import Api from '../../api/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    phone: ''
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    if (options.phone) {
      this.setData({ phone: options.phone })
      this.getOrderList()
    }
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
    if (this.data.phone) {
      let params = {
        pageIndex: 1,
        pageSize: 100,
        contactNo: this.data.phone
      }
      wx.showLoading({
        title: '列表加载中',
        mask: true
      })
      const res = await Api.Common.getOrderList(params)
      if (Array.isArray(res.list) && res.list.length > 0) {
        this.setData({ orderList: res.list })
      }
      wx.hideLoading()
    }
  }
})