// pages/show/show.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let page = this
    wx.request({
      url: `${app.globalData.url}slangs/${option.id}`,
      method: 'GET',
      success(res) {
        console.log(res)
      }
    })
  }
})