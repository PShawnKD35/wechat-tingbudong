const app = getApp()

Page({
  data: {
// isHide is the user home page
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false
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
// Respond with userId, header
                      success: res => {
                        console.log(res)
                        // app.globalData.userId = res.data.userId
                        // app.globalData.header = res.data.X-User-Email
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
  },

// get: index page @slangs
  // onShow: function () {
  //   let page = this
  //   wx.request({
  //     url: `${app.globalData.url}` + 'slangs',
  //     get: 'GET',
  //     success: res => {
  //       console.log(res)
  //     }
  //   })
  // },


  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      var page = this;
      console.log("userinfo：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      page.setData({
        isHide: false
      });
      app.globalData.userInfo = e.detail.userInfo;
      console.log(app.globalData.userInfo);
      wx.request({
        url: `${app.globalData.url}users/${userId}`,
        method: 'PUT',
        data: app.globalData.userInfo
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
  }
})