const app = getApp()

Page({
  data: {
    TabCur: 0,
    userInfo: {},
    tabNav: ['My slangs', 'My definitions', 'My stickers'],
    slangs: [],
    definitions: []
  },

  onLoad: function (options) {
    let page = this
    page.setData({
      userInfo: app.globalData.userInfo
    })
    wx.request({
      url: `${app.globalData.url}users/${app.globalData.userId}`,
      method: 'GET',
      header: app.globalData.header,
      success: function(res){
        page.setData({
          slangs: res.data.slangs,
          definitions: res.data.definitions
        })
      }
    })
  },
  
  toSlangShow: function (event) {
    console.log(event)
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`,
    })
    this.triggerEvent("action");
  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  }
})