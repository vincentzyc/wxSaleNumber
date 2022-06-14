// 获取应用实例
import Api from '../../api/index'

const app = getApp()

Page({
  data: {
    activeTabbar: 'number',
    bannerUrl: '',
    hiddenBackTop: true
  },
  back2top() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 300) {
      this.setData({
        hiddenBackTop: false
      });
    } else {
      this.setData({
        hiddenBackTop: true
      });
    }
  },
  back2top() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  async getTemplateInfo() {
    const templateId = app.getGlobal('templateId')
    if (templateId) {
      try {
        const res = await Api.wxGet(Api.CommonBaseUrl + '/api/promotionPage/' + templateId)
        const pageData = JSON.parse(res.promotionPageValue)
        if (pageData && pageData.wxPayAccount) app.setGlobal('wxPayAccount', pageData.wxPayAccount)
      } catch (error) {
        console.log(error);
      }
    }
  },
  onReachBottom() {
    app.eventBus.emit('onReachBottom')
  },
  onGetBanner(url) {
    if (url) this.setData({ bannerUrl: url })
  },
  onLoad() {
    app.eventBus.on('onGetBanner', url => this.onGetBanner(url))
    this.getTemplateInfo()
  },
  onShareAppMessage() {
    return {
      title: '一店联精品号',
      path: '/pages/index/index?pid=' + app.getGlobal('pid')
    }
  },
  onShareTimeline() {
    return {
      title: '一店联精品号',
      query: 'pid=' + app.getGlobal('pid')
    }
  }
})
