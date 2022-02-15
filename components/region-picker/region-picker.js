// components/city-picker.js
import AllCity from './city.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fullcity: { // 属性名
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    hadCityInfo: false,
    cityInfo: [],
    ipRegion: [],
    region: [],
    regions: '',
    multiIndex: [0, 0, 0],
    multiArr: [],
    multiText: [],
    multiStr: ''
  },
  // observers: {
  //   multiText(value) {
  //   }
  // },
  /**
   * 组件的方法列表
   */
  methods: {
    pickerChange() {
      if (Array.isArray(this.data.multiText)) {
        this.triggerEvent('getcity', this.data.multiText)
      }
    },
    getMultiText(multiIndex) {
      if (Array.isArray(this.data.multiArr) && this.data.multiArr.length === 0) return []
      const province = this.data.multiArr[0][multiIndex[0]]
      const city = multiIndex[1] == 0 || multiIndex[1] ? this.data.multiArr[1][multiIndex[1]] : ''
      let multiText = []
      if (province) multiText.push(province)
      if (city) multiText.push(city)
      return multiText
    },
    setMultiArr(defaultCity) {
      if (this.data.cityInfo.length === 0) return
      const cityInfo = this.data.cityInfo
      if (Array.isArray(defaultCity) && defaultCity.length > 0) {
        const province = defaultCity[0] ? defaultCity[0] : ''
        const city = defaultCity[1] ? defaultCity[1] : ''
        let provinces = [], provinceIndex = 0, citys = [], cityIndex = 0
        for (let index1 = 0; index1 < cityInfo.length; index1++) {
          const element1 = cityInfo[index1];
          provinces.push(element1.n)
          if (element1.n === province) {
            provinceIndex = index1
          }
        }
        const provinceObj = cityInfo[provinceIndex];
        for (let index2 = 0; index2 < provinceObj.c.length; index2++) {
          const element2 = provinceObj.c[index2];
          citys.push(element2.n)
          if (element2.n === city) {
            cityIndex = index2
          }
        }
        this.setData({
          multiArr: [provinces, citys],
          multiIndex: [provinceIndex, cityIndex],
          multiText: [provinces[provinceIndex], citys[cityIndex]],
          multiStr: this.data.fullcity ? [provinces[provinceIndex], citys[cityIndex]].join(' ') : citys[cityIndex]
        })
      } else {
        const provinces = cityInfo.map(v => v.n) || []
        const citys = cityInfo[0].c.map(v => v.n) || []
        this.setData({
          multiArr: [provinces, citys],
          multiIndex: [0, 0],
          multiText: [provinces[0], citys[0]],
          multiStr: this.data.fullcity ? [provinces[0], citys[0]].join(' ') : citys[0]
        })
      }
    },
    pickerColumnMulti(e) {
      switch (e.detail.column) {
        case 0:
          this.setMultiArr(this.getMultiText([e.detail.value]))
          break;
        case 1:
          this.setMultiArr(this.getMultiText([this.data.multiIndex[0], e.detail.value]))
          break;
      }
    },
  },
  attached() {
    this.setData({ cityInfo: AllCity })
    this.setMultiArr()
  }
})
