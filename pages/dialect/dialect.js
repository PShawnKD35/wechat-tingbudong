// pages/dialect/dialect.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: true,
    DotStyle: true,
    slangs: [],
    ColorList: app.globalData.ColorList,
    searched: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.hideLoading()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.setData({
      searched: false
    })
    wx.request({
      url: `${app.globalData.url}` + 'slangs',
      header: app.globalData.header,
      method: 'GET',
      success: res => {
        console.log("****************GET FOR SLANGS************")
        this.tagsSpliter(res.data.slangs)
        console.log(this.data.slangs)
        // console.log(new Date(res.data.slangs.first["created_at"]))
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

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  }
})