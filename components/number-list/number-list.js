// pages/NumberList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    value: '',
    type: "精准",
    inputNum: "",
    disableBtn: false,
    checked: false,
    focusIndex: -1,
    inputLenth: 11,
    numArray: [{
      value: '',
      id: 'ref1',
      highlight: false
    }, {
      value: '',
      id: 'ref2',
      highlight: false
    }, {
      value: '',
      id: 'ref3',
      highlight: false
    }, {
      value: '',
      id: 'ref4',
      highlight: true
    }, {
      value: '',
      id: 'ref5',
      highlight: true
    }, {
      value: '',
      id: 'ref6',
      highlight: true
    }, {
      value: '',
      id: 'ref7',
      highlight: true
    }, {
      value: '',
      id: 'ref8',
      highlight: false
    }, {
      value: '',
      id: 'ref9',
      highlight: false
    }, {
      value: '',
      id: 'ref10',
      highlight: false
    }, {
      value: '',
      id: 'ref11',
      highlight: false
    }],
    selectRules: null,
    selectCity: [],
    sortType: 0,
    sortTypeArray: [
      { name: "默认", id: 0 },
      { name: "价格由高到低", id: 1 },
      { name: "价格由低到高", id: 2 }
    ]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    setupPasswordComplete(event) {
      this.setData({ 'dev': event.detail })
      console.log(this.data.dev)
    },
    openFilter() {
      const childNumberFilter = this.selectComponent('#numberFilter');
      if (childNumberFilter) childNumberFilter.showPopup()
    },
    onGetRules(e) {
      console.log(e.detail);
      this.setData({ selectRules: e.detail })
    },
    onGetCity(e) {
      this.setData({ selectCity: e.detail })
    },
    bindSortTypeChange(e) {
      this.setData({ sortType: e.detail.value })
    },
    inputListener(event) {
      let currentIndex = event.currentTarget.dataset.inputIndex
      this.data.numArray[currentIndex].value = event.detail.value
      if (event.detail.value != '') {
        this.setData({
          numArray: this.data.numArray,
          focusIndex: currentIndex + 1
        })
      } else {
        this.setData({
          numArray: this.data.numArray,
          focusIndex: currentIndex - 1
        })
      }
    },
    onChangeCheckbox(event) {
      this.setData({
        checked: event.detail,
      });
    },
    onNumInput(event) {
      console.log(event.detail);
      this.setData({
        inputNum: event.detail.value,
      });
    },
    changeSearch() {
      if (this.data.type === "模糊") {
        for (let i = 0; i < this.data.numArray.length; i++) {
          this.data.numArray[i].value = "";
        }
        this.setData({ type: "精准", numArray: this.data.numArray, focusIndex: 0 })
      } else {
        this.setData({ type: "模糊", inputNum: '', checked: false })
      }
    },
  }
})
