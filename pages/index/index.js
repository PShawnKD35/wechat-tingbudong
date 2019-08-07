const app = getApp()

Page({
  data: {
// isHide is the user home page
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    DotStyle: true,
    slangs: []
  },

  onLoad: function () {
    var that = this;
// check authorisation granted or not
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
// login check to get openID
              wx.login({
                success: res => {
                  console.log("用户的code:" + res.code);
                  wx.request({
                      url: `${app.globalData.url}` + 'login',
                      method: 'POST',
                      data: {
                        code: res.code
                      },
                      success: res => {
                        app.globalData.userId = res.data.userId
                        app.globalData.header = {
                          'X-User-Email': `${res.data.email}`,
                          'X-User-Token': `${res.data.userToken}`}
                      }
                  });
                }
              });
            }
          });
        } else {
          that.setData({
            isHide: true
          });
        }
      }
    });
    wx.request({
      url: `${app.globalData.url}` + 'slangs',
      header: app.globalData.header,
      method: 'GET',
      success: res => {
        this.setData({
          slangs: res.data.slangs
        })
        console.log(this.data.slangs)
      }
    })
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      var page = this;
      console.log("userinfo：");
      console.log(e.detail.userInfo);
      page.setData({
        isHide: false
      });
      app.globalData.userInfo = e.detail.userInfo;
      console.log(app.globalData.header);
      wx.request({
        url: `${app.globalData.url}users/${app.globalData.userId}`,
        method: 'PUT',
        header: app.globalData.header,
        data: {
          name: app.globalData.userInfo.nickName,
          avatar_url: app.globalData.userInfo.avatarUrl
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: 'Warning',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  toSlangShow: function(event) {
    console.log(event)
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`,
    })
  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  }
})