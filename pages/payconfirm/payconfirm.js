// pages/payconfirm/payconfirm.js
const app = getApp()
import Api from '../../api/index'

const successPgae = 'https://h5.lipush.com/h5/index.html?id=2022021416305100013'

Page({
  data: {
    radio: '1',
    orderCode: '',
    userCode: '',
    selectNum: null,
    submitForm: null
  },

  onChange(event) {
    this.setData({ radio: event.detail });
  },
  async handlePay() {
    const params = {
      payType: 'WXMINI',
      payKind: 'FRONT',
      updateType: 'PAY',
      userCode: this.data.userCode,
      orderCode: this.data.orderCode
    }
    wx.showLoading({ title: '正在支付' })
    const res = await Api.Common.orderUpdate(params)
    wx.hideLoading()
    const payData = res.payParam
    if (payData && payData.payParam) {
      wx.requestPayment({
        nonceStr: payData.payParam.Nonce,
        package: payData.payParam.Package,
        paySign: payData.payParam.Sign,
        timeStamp: payData.payParam.Timestamp,
        signType: "MD5",
        success: function (res) {
          const link = encodeURIComponent(successPgae)
          wx.navigateTo({
            url: '../webview/webview?link=' + link
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '支付失败，请重试！',
            icon: 'none',
            duration: 1000
          })
        },
        complete: function (res) {
          console.log('complete', res)
        }
      })
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const selectNum = app.getGlobal('selectNumber')
    const submitForm = app.getGlobal('submitForm')
    const userCode = app.getGlobal('userCode')
    if (selectNum) this.setData({ selectNum: selectNum })
    if (submitForm) this.setData({ submitForm: submitForm })
    if (options.orderCode) this.setData({ orderCode: options.orderCode })
    if (userCode) {
      this.setData({ userCode: userCode })
    } else {
      wx.login({
        success: res => this.setData({ userCode: res.code })
      })
    }
  }
})