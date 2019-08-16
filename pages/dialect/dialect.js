// pages/dialect/dialect.js
const app = getApp()
const utilApi = require('../../utils/util.js');

Page({
  data: {
    DotStyle: true,
    slangs: [],
    ColorList: app.globalData.ColorList,
    tags: [],
    dialect: '',
    slangs: {},
    offset: 10,
    searchTags: ''
  },

  toSlangShow: function (event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`,
    })
    this.triggerEvent("action");
  },
  ///////////////// cardSwiper /////////////////
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
    this.triggerEvent("action");
  },

  onLoad: function (options) {
    console.log(options)
    let page = this
    if (options.show != 'show'){
      let tags = options.tags.split(',')
      this.setData({
        dialect: options.dialect,
        searchTags: options.tags
      })
    }
    else {
      this.setData({
        dialect: options.tags
      })
    };
    let body = {tag: options.tags}

    utilApi.apiWithData('slangs', body).then(res=>{
      this.setData({
        slangs: utilApi.textFormatter(res.data.slangs, 85),
        body: { tag: options.tags }
      })
    });
  },

  tagsSpliter(slangs) {
    let splitedSlangs = slangs
    splitedSlangs.forEach(function (slang) {
      if (slang.tags[0] != undefined) {
        let tmptags = slang.tags
        slang.tags = tmptags[0].split(',')
      }
    })
    this.setData({
      slangs: splitedSlangs
    })
  },

  onPullDownRefresh: function () {

  },

  onShareAppMessage: function () {

  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  onReachBottom() {
    utilApi.apiWithData(`slangs?offset=${this.data.offset + 10}`, this.data.body).then(res => {
      let slangsTmp = this.data.slangs
      utilApi.textFormatter(res.data.slangs, 85).forEach((slang) => {
        slangsTmp.push(slang)
        console.log("okokok:     " + res.data.slangs)
      })
      this.setData({
        slangs: slangsTmp,
        offset: this.data.offset + 10
      })
    });
  }
})