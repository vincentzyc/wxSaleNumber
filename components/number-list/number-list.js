import Api from '../../api/index'

const app = getApp()

const JingZhun = "精准"
const MoHu = "模糊"

Component({
  data: {
    type: MoHu,
    inputNum: "",
    boxInputNum: [],
    disableBtn: false,
    checked: false,
    focusIndex: -1,
    inputLenth: 11,
    selectRules: null,
    selectCity: [],
    curIpRegion: [],
    sortType: '',
    sortTypeArray: [
      { name: "默认", id: 0 },
      { name: "价格由高到低", id: 1 },
      { name: "价格由低到高", id: 2 }
    ],
    pageIndex: 1,
    pageSize: 12,
    numDataList: [],
    loadMore: true,
    loading: false,
    loadAll: false
  },
  methods: {
    handleSelect(e) {
      const selectNumber = e.currentTarget.dataset.selectNumber
      app.setGlobal('selectNumber', selectNumber)
      wx.navigateTo({
        url: '../../pages/form/form'
      })
    },
    async onReachBottom() {
      if (this.data.loading) return
      if (this.data.loadAll) return
      this.getNumPool(this.data.pageIndex + 1)
    },
    async getNumPool(pageIndex = 1) {
      const newList = pageIndex === 1 ? [] : this.data.numDataList
      this.setData({
        pageIndex: pageIndex,
        loadMore: true,
        loading: true,
        loadAll: false,
        disableBtn: true,
        numDataList: newList
      })
      const param = {
        pageIndex: pageIndex,
        pageSize: this.data.pageSize,
        province: this.data.selectCity?.[0] === "全国" ? "" : this.data.selectCity[0] || "",
        city: this.data.selectCity?.[1] === "默认全部" ? "" : this.data.selectCity[1] || "",
        prettyType: this.data.selectRules?.prettyType || "",    //规则
        operator: this.data.selectRules?.operator || "",      //规则-运营商
        priceSegment: this.data.selectRules?.priceSegment || "",  //规则-价格段
        searchBody: {
          isTail: this.data.checked ? 1 : 0,
          type: this.data.type === JingZhun ? 0 : 1,
          content: this.data.type === JingZhun ? this.data.boxInputNum?.map(v => v === '' ? '_' : v).join('') : this.data.inputNum,
        },
        sortType: this.data.sortType,
        hotLabel: "", //热搜
        vendorId: this.cmData.vendorId
      }
      if (app.getGlobal('templateId')) param.promotionPageId = app.getGlobal('templateId');
      const res = await Api.Common.getNumPool(param)
      if (Array.isArray(res.numItem) && res.numItem.length > 0) {
        this.data.numDataList.push(...res.numItem)
        this.setData({
          loadMore: true,
          loading: false,
          loadAll: false,
          disableBtn: false,
          numDataList: this.data.numDataList
        })
      } else {
        this.setData({
          loadMore: false,
          loadAll: true,
          loading: false,
          disableBtn: false
        })
      }
      wx.hideLoading()
    },
    handleSearch() {
      if (this.data.loading) return
      this.getNumPool()
    },
    boxInputComplete(event) {
      this.setData({ boxInputNum: event.detail })
    },
    openFilter() {
      if (!this.elNumberFilter) this.elNumberFilter = this.selectComponent('#numberFilter')
      if (this.elNumberFilter) this.elNumberFilter.showPopup()
    },
    onGetRules(e) {
      this.setData({ selectRules: e.detail })
      this.getNumPool()
    },
    onGetCity(e) {
      this.setData({ selectCity: e.detail })
      this.getNumPool()
    },
    bindSortTypeChange(e) {
      this.setData({ sortType: e.detail.value })
      this.getNumPool()
    },
    onChangeCheckbox(event) {
      this.setData({ checked: event.detail });
    },
    onNumInput(event) {
      this.setData({ inputNum: event.detail.value });
    },
    changeSearch() {
      if (this.data.type === MoHu) {
        if (!this.elBoxInput) this.elBoxInput = this.selectComponent('#boxInput')
        if (this.elBoxInput) this.elBoxInput.reset()
        this.setData({ type: JingZhun })
      } else {
        this.setData({ type: MoHu, inputNum: '', checked: false })
      }
    },
    resetRules() {
      if (!this.elNumberFilter) this.elNumberFilter = this.selectComponent('#numberFilter')
      if (this.elNumberFilter) this.elNumberFilter.reset()
      this.setData({
        type: MoHu,
        inputNum: "",
        boxInputNum: [],
        disableBtn: false,
        checked: false,
        sortType: '',
        selectRules: null
      })
    },
    async locationSearch(isLocation) {
      wx.showLoading({ title: '靓号加载中', mask: true })
      if (!this.elRegionPicker) this.elRegionPicker = this.selectComponent('#regionPicker')
      let locationCity = []
      if (isLocation) {
        if (this.data.curIpRegion.length > 0) {
          locationCity = this.data.curIpRegion
        } else {
          const res = await Api.Card.getIpRegion({})
          if (res.code === '0000') {
            if (res.data) {
              if (res.data.province) {
                locationCity.push(res.data.province)
                if (res.data.city) locationCity.push(res.data.city)
              }
            }
          }
          if (locationCity.length > 0) {
            this.setData({ curIpRegion: locationCity })
          } else {
            locationCity = ['全国', '默认全部']
          }
        }
      } else {
        locationCity = ['全国', '默认全部']
      }
      this.resetRules()
      if (this.elRegionPicker) {
        this.elRegionPicker.setMultiArr(locationCity)
        this.setData({ selectCity: locationCity })
      }
      this.handleSearch()
    }
  },
  async created() {
    app.eventBus.on('onReachBottom', () => this.onReachBottom())
    app.eventBus.on('onRefreshNumber', isLocation => this.locationSearch(isLocation))
    wx.showLoading({ title: '靓号加载中', mask: true })
    this.cmData = await Api.Common.getPidInfo({ pid: app.getGlobal('pid') })
    this.rulesList = await Api.Common.getRulesList()
    app.setGlobal('cmData', this.cmData)
    if (this.cmData?.headImg) app.eventBus.emit('onGetBanner', this.cmData.headImg)
    if (this.rulesList?.sideRules) app.eventBus.emit('onGetSideRules', this.rulesList.sideRules)
    this.locationSearch(true)
  }
})
