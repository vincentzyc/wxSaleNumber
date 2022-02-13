// pages/form/form.js
const app = getApp()
import Api from '../../api/index'
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
      link: 'https://qq.com'
    }, {
      name: '《个人信息收集证明》、',
      link: 'https://baidu.com'
    }, {
      name: '《单独同意书》、',
      link: 'https://www.sina.com.cn'
    }, {
      name: '《入网许可协议》',
      link: 'https://bilibili.com'
    }],
    selectNum: { "pid": "无", "num": "13205617333", "item": [{ "numChar": "1", "highlight": false }, { "numChar": "3", "highlight": false }, { "numChar": "2", "highlight": false }, { "numChar": "0", "highlight": false }, { "numChar": "5", "highlight": false }, { "numChar": "6", "highlight": false }, { "numChar": "1", "highlight": false }, { "numChar": "7", "highlight": false }, { "numChar": "3", "highlight": true }, { "numChar": "3", "highlight": true }, { "numChar": "3", "highlight": true }], "id": 66838830, "salePrice": "108", "marketPrice": "1080", "areaInfo": "淮北联通", "chargesStr": "此号码为淮北市联通，129元/月套餐，30G全国高速流量，500分钟全国通话，主叫0.1元/分钟，被叫免费，套餐承诺最低消费199元/月，合约期不低于180个月", "preferential": "享24个月套餐7折优惠，仅限本地上门办理", "prestore": "0", "numProvince": "安徽省", "numCity": "淮北市", "phoneStatus": 1, "phoneStatusStr": "未占用" }
  },
  onLoad: function () {
    const selectNum = app.getGlobal('selectNumber')
    if (selectNum) this.setData({ selectNum: selectNum })
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
    // console.log(app.getGlobal('query')); //获取页面参数
    // let homeUrl = this.$util.getSessionStorage("homeUrl");
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
    this.data.form['templateUrl'] = JSON.stringify(app.getGlobal('query'))
    wx.showLoading({ title: '提交中...' })
    console.log(this.data.form);
    let res = await Api.Common.addOrder(this.data.form)
    wx.hideLoading()
    console.log(res);
    // {orderCode: "GN20220213172205144219008"}
    // if (this.selectNum.PID === '23149' || this.selectNum.PID === '24943' || this.selectNum.PID === '24944') {
    //   this.formData['templateUrl'] = homeUrl.replace('clickid', 'CK')   //不走api上报，走js上报
    // }
    // this.$util.showLoading()
    // let res = await Api.Common.addOrder(this.formData)
    // this.$util.closeLoading()
    if (res.code === '0000') {
      // if (this.selectNum.PID === '23149') {
      //   _baq.track("form", { assets_id: "1721736203707464", product_name: '靓号', product_price: 0 })
      // }
      // this.$toast('订单提交成功！')
      // let orderCode = res.data.orderCode
      // 跳转订单提交
      // window.location.href = url
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
  }
})