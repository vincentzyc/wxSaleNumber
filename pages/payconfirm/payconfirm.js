// pages/payconfirm/payconfirm.js
const app = getApp()
import Api from '../../api/index'

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
      payType: '4',
      userCode: this.data.userCode,
      orderId: this.data.orderCode
    }
    console.log(params);
    let res = await Api.Pay.pay('param=' + JSON.stringify(params))
    if (res.code === '0') {
      let payData = JSON.parse(res.data)
      wx.requestPayment({
        nonceStr: payData.Nonce,
        package: payData.Package,
        paySign: payData.Sign,
        timeStamp: payData.Timestamp,
        signType: "MD5",
        success: function (res) {
          console.log('success', res)
          wx.showToast({
            title: '支付成功！',
            icon: 'none',
            duration: 1000
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
      console.log(res.msg)
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
    console.log(options);
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