// pages/payconfirm/payconfirm.js
const app = getApp()
import Api from '../../api/index'
import checkForm from '../../assets/js/validate.js'

const successPgae = 'https://h5.lipush.com/h5/index.html?id=2022021416305100013'

Page({
  data: {
    radio: '1',
    orderCode: '',
    userCode: '',
    form: {
      name: '',
      contactNo: '',
      selectCity: [],
      address: '',
    },
    selectNum: null,
    submitForm: null,
    showForm: false
  },
  editForm() {
    if (!this.elCityPicker) this.elCityPicker = this.selectComponent('#cityPicker')
    if (this.elCityPicker) {
      this.elCityPicker.setMultiArr(this.data.submitForm.selectCity)
      this.elCityPicker.pickerChange()
    }
    this.data.form.name = this.data.submitForm.name
    this.data.form.contactNo = this.data.submitForm.contactNo
    this.data.form.selectCity = this.data.submitForm.selectCity
    this.data.form.address = this.data.submitForm.address
    this.setData({ showForm: true, form: this.data.form });
  },
  onChange(event) {
    this.setData({ radio: event.detail });
  },
  onChangeName(event) {
    this.data.form.name = event.detail
    this.setData({ form: this.data.form });
  },
  onChangePhone(event) {
    this.data.form.contactNo = event.detail
    this.setData({ form: this.data.form });
  },
  onChangeAddress(event) {
    this.data.form.address = event.detail
    this.setData({ form: this.data.form });
  },
  onGetCity(event) {
    this.data.form.selectCity = event.detail
    this.setData({ form: this.data.form });
  },
  onClosePopup() {
    if (!this.validate()) return
    this.data.submitForm.province = this.data.submitForm.selectCity[0] || '';
    this.data.submitForm.city = this.data.submitForm.selectCity[1] || '';
    this.data.submitForm.district = this.data.submitForm.selectCity[2] || '';
    this.setData({ showForm: false, submitForm: this.data.submitForm })
  },
  validate() {
    for (const key in this.data.form) {
      if (Object.hasOwnProperty.call(this.data.form, key)) {
        const val = this.data.form[key];
        if (checkForm[key]) {
          const checkRes = checkForm[key](val)
          if (checkRes === true) {
            this.data.submitForm[key] = val
          } else {
            wx.showToast({
              title: checkRes,
              icon: 'none',
              duration: 2000
            })
            return false
          }
        }
      }
    }
    return true
  },
  async handlePay() {
    const params = {
      payType: 'WXMINI',
      payKind: 'FRONT',
      updateType: 'PAY',
      userCode: this.data.userCode,
      orderCode: this.data.orderCode,
      name: this.data.submitForm.name,
      contactNo: this.data.submitForm.contactNo,
      address: this.data.submitForm.address,
      province: this.data.submitForm.selectCity[0] || '',
      city: this.data.submitForm.selectCity[1] || '',
      district: this.data.submitForm.selectCity[2] || ''
    }
    const payAccount = app.getGlobal('wxPayAccount')
    if (payAccount) params.payAccount = payAccount
    wx.showLoading({ title: '正在支付', mask: true })
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
        success: function () {
          const link = encodeURIComponent(successPgae)
          wx.navigateTo({
            url: '../webview/webview?link=' + link
          })
        },
        fail: function () {
          wx.showToast({
            title: '支付失败，请稍后重试',
            icon: 'none'
          })
        },
        complete: function (res) {
          console.log('complete', res)
        }
      })
    } else {
      wx.showToast({
        title: '支付失败，请稍后重试~',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const selectNum = app.getGlobal('selectNumber')
    const submitForm = app.getGlobal('submitForm')
    // const userCode = app.getGlobal('userCode')
    if (selectNum) this.setData({ selectNum: selectNum })
    if (submitForm) this.setData({ submitForm: submitForm })
    if (options.orderCode) this.setData({ orderCode: options.orderCode })
    // if (userCode) {
    //   this.setData({ userCode: userCode })
    // } else {
    // }
    wx.login({
      success: res => this.setData({ userCode: res.code })
    })
  }
})