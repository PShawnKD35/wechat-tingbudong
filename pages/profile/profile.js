const app = getApp()

Page({
  data: {
    // CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    userInfo: app.globalData.userInfo,
    tabNav: ['My slangs', 'My definitions', 'My stickers'],
    slangs: [{
      name: 'sdfsd',
      definitions: {
        content: 'dsafdsfsda',
        likes: 99
        }
      },
      {
        name: 'sdfsd',
        definitions: {
          content: 'dsafdsfsda',
          likes: 99
        }
      },
      {
        name: 'sdfsd',
        definitions: {
          content: 'dsafdsfsda',
          likes: 99
        }
      },
      {
        name: 'sdfsd',
        definitions: {
          content: 'dsafdsfsda',
          likes: 99
        }
      }
    ]
  },

  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: 'Loading',
    })
    setTimeout(function () {
      that.setData({
        userInfo: app.globalData.userInfo
      })
      wx.hideLoading()
    }, 1000)
    console.log(app.globalData.userInfo)
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