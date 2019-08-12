// pages/dialect/dialect.js
const app = getApp()
Page({
  data: {
    DotStyle: true,
    slangs: [],
    ColorList: app.globalData.ColorList,
    tags: [],
    dialect: '',
    slangs: {}
  },

  onLoad: function (options) {
    console.log(options)
    let page = this
    if (options.show != 'show'){
      let tags = options.tags.split(',')
      this.setData({
        dialect: options.dialect
      })
    }
    else {
      this.setData({
        dialect: options.tags
      })
    };
    wx.request({
      url: `${app.globalData.url}slangs`,
      method: 'GET',
      header: app.globalData.header,
      data: {
        tag: options.tags
      },
      success: function (res) {
        page.tagsSpliter(res.data.slangs)
      }
    })
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
  }
})