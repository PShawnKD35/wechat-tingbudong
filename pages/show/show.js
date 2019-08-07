const app = getApp()
Page({
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let page = this
    wx.request({
      url: `${app.globalData.url}slangs/${options.id}`,
      method: 'GET',
      success(res) {
        console.log(res)
      }
    })
  }
})