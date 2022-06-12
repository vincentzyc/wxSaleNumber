// pages/form/form.js
const app = getApp()
import Api from '../../api/index'
import { objParam2Str } from '../../utils/index'
import checkForm from '../../assets/js/validate.js'
Page({
  data: {
    form: {
      name: '',
      contactNo: '',
      selectCity: [],
      address: '',
      checked: false,
    },
    agrList: [{
      name: '《个人信息保护政策》、',
      link: 'https://h5.lipush.com/h5/index.html?id=2022021416293400014'
    }, {
      name: '《个人信息收集证明》、',
      link: 'https://h5.lipush.com/h5/index.html?id=2022021416295200011'
    }, {
      name: '《单独同意书》、',
      link: 'https://h5.lipush.com/h5/index.html?id=2022021416294000006'
    }, {
      name: '《入网许可协议》',
      link: 'https://h5.lipush.com/h5/index.html?id=2022021416295900012'
    }],
    selectNum: null
  },
  onLoad() {
    const selectNum = app.getGlobal('selectNumber')
    if (selectNum) this.setData({ selectNum: selectNum })
    //获取默认收货地址
    let phoneNumber = app.getGlobal('userPhoneNo')
    if(phoneNumber) {
      this.getAddress(phoneNumber)
    }
  },
  onChangeName(event) {
    this.data.form.name = event.detail
    this.setData({ name: this.data.form.name });
  },
  onChangePhone(event) {
    this.data.form.contactNo = event.detail
    this.setData({ contactNo: this.data.form.contactNo });
  },
  onChangeAddress(event) {
    this.data.form.address = event.detail
    this.setData({ address: this.data.form.address });
  },
  onGetCity(event) {
    this.data.form.selectCity = event.detail
    this.setData({ selectCity: event.detail })
  },
  onChangeCheckbox(event) {
    this.data.form.checked = event.detail
    this.setData({ form: this.data.form });
  },
  showAgr(event) {
    const link = event.currentTarget.dataset.agrlink
    wx.navigateTo({
      url: '../webview/webview?link=' + encodeURIComponent(link)
    })
  },
  onPopupClose() {
    this.setData({ popupShow: false })
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
    this.data.form['handleNo'] = this.data.selectNum.num
    this.data.form['numberPid'] = this.data.selectNum.pid
    this.data.form['wishCity'] = this.data.selectNum.areaInfo
    this.data.form['pid'] = app.getGlobal('pid')
    this.data.form['numProvince'] = this.data.selectNum.numProvince
    this.data.form['numCity'] = this.data.selectNum.numCity
    this.data.form['numberId'] = this.data.selectNum.id
    this.data.form['activity'] = this.data.selectNum.activity ? this.data.selectNum.activity : ''
    this.data.form['province'] = this.data.form.selectCity[0] || '';
    this.data.form['city'] = this.data.form.selectCity[1] || '';
    this.data.form['district'] = this.data.form.selectCity[2] || '';
    this.data.form['templateUrl'] = objParam2Str(app.getGlobal('query'), 'pages/index/index')
    if (app.getGlobal('templateId')) this.data.form['promotionPageId'] = app.getGlobal('templateId');
    wx.showLoading({ title: '提交中...', mask: true })
    app.setGlobal('submitForm', this.data.form)
    let res = await Api.Common.addOrder(this.data.form)
    wx.hideLoading()
    console.log(res);
    if (res.code === '0000') {
      wx.navigateTo({
        url: '../payconfirm/payconfirm?orderCode=' + res.data.orderCode
      })
    } else {
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000
      })
    }
  },
  //获取默认收货地址
  async getAddress(phoneNumber) {
    let res = await Api.Junpin.getAddress({phoneNumber})
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
      console.log(this.data.form);
    }
  }
})