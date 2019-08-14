const app = getApp()
Page({

  data: {
    slangs: []
  },

  onLoad: function () {
    let page = this
    console.log("favoritteeeeeeeeeeeeeeeeeee")
    wx.request({
      url: `${app.globalData.url}favorites`,
      method: 'GET',
      header: app.globalData.header,
      success: res => {
        page.setData({
          slangs: res.data.slangs
        })
      console.log(res.data)
      } 
    })
  },

  onPullDownRefresh: function () {

  }
})