// pages/addressForm/addressForm.js
const app = getApp()
import Api from '../../api/index'
import checkForm from '../../assets/js/validate.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      selectCity: [],
      address: '',
      name: '',
      contactNo: '',
    }
  },

  onGetCity(event) {
    this.data.form.selectCity = event.detail
    this.setData({ selectCity: event.detail })
  },
  onChangeAddress(event) {
    this.data.form.address = event.detail
    this.setData({ address: this.data.form.address });
  },
  onChangeName(event) {
    this.data.form.name = event.detail
    this.setData({ name: this.data.form.name });
  },
  onChangePhone(event) {
    this.data.form.contactNo = event.detail
    this.setData({ contactNo: this.data.form.contactNo });
  },

  async getAddress() {
    wx.showLoading({ title: '加载中...', mask: true })
    let phoneNumber = app.getGlobal('userPhoneNo')
    let res = await Api.Junpin.getAddress({phoneNumber})
    wx.hideLoading()
    if(res) {
      let data = res
      let selectCity = [data.province, data.city, data.district]
      this.setData({
        ['form.name']: data.consignee,
        ['form.address']: data.address,
        ['form.contactNo']: data.phone,
        ['form.selectCity']: selectCity,
      })
      this.selectComponent('#cityPicker').setMultiArr(selectCity)
      this.selectComponent('#cityPicker').pickerChange()
    }
  },
  validate() {
    for (const key in this.data.form) {
      if (Object.hasOwnProperty.call(this.data.form, key)) {
        const val = this.data.form[key];
        if (checkForm[key]) {
          const checkRes = checkForm[key](val)
          if (checkRes !== true) {
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
  async submit() {
    if (!this.validate()) return
    let phoneNumber = app.getGlobal('userPhoneNo')
    let params = {
      address: this.data.form.address,
      phone: this.data.form.contactNo,
      consignee: this.data.form.name,
      province: this.data.form.selectCity[0],
      city: this.data.form.selectCity[1],
      district: this.data.form.selectCity[2],
      phoneNumber
    }
    wx.showLoading({ title: '提交中...', mask: true })
    let res = await Api.Junpin.setAddress(params)
    wx.hideLoading()
    if(res) {
      wx.showToast({
        title: '收货地址保存成功！',
        icon: 'none',
        duration: 1000,
        success: ()=>{
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },1000)
        }
      })
    }else {
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddress()
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