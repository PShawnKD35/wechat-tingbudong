const app = getApp()

Page({
  data: {
    TabCur: 0,
    userInfo: {},
    tabNav: ['My slangs', 'My definitions'],
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
  },
  bindGetUserInfo: function (e) {
    console.log(e)
    let page = this;
    wx.getUserInfo({
      success: function (res) {
        let user_id = app.globalData.userId;
        if (e.detail.userInfo) {
          console.log("userinfo：");
          console.log(e.detail.userInfo);
          app.globalData.userInfo = e.detail.userInfo;
          console.log(app.globalData.header);
          wx.request({
            url: `${app.globalData.url}users/${user_id}`,
            method: 'PUT',
            header: app.globalData.header,
            data: {
              name: app.globalData.userInfo.nickName,
              avatar_url: app.globalData.userInfo.avatarUrl
            },
            success: function (res) {
              console.log("****************PUT FOR USERINFO************")
            }
          })
          page.onLoad()
        } 
      }
    });
  },
})