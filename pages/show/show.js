const app = getApp()
Page({
  data: {
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let page = this,
        slang
        
    console.log(app.globalData.header)
    wx.request({
      url: `${app.globalData.url}slangs/${options.id}`,
      method: 'GET',
      header: app.globalData.header,
      success(res) {
        page.setData({
          slang: res.data.slang
        })
      }
    })
  },
  BackPage(e) {
    wx.navigateBack({
      delta: 1
    })
  }
})