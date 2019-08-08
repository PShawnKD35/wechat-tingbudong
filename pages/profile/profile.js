const app = getApp()

Page({
  data: {
    userInfo: app.globalData.userInfo,
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
  }
})