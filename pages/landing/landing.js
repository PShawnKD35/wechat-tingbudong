const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    DotStyle: true,
    slangs: [],
    ColorList: app.globalData.ColorList,
    dialects: [],
    favored: false,
    searched: false,
    preSortedTagsSlangs: [],
    isLoad: app.globalData.isLoad
  },

  onLoad: function (options) {
    console.log("landing loading!!!!!!!!!!!!!!!!")
    this.setData({
      isLoad: app.globalData.isLoad
    })
    wx.showShareMenu({
      withShareTicket: true
    }),
      console.log("***************Landing on Load********************")
    var that = this;
    var story = "听不懂-解锁更多城市用语";
    var i = 0;
    var time = setInterval(function () {
      var text = story.substring(0, i);
      i++;
      that.setData({
        text: text
      });
      if (text.length == story.length) {
        //   console.log("定时器结束！");
        clearInterval(time);
      }
    }, 200);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        isLoad: true
      })
      wx.request({
        url: `${app.globalData.url}users/${user_id}`,
        method: 'PUT',
        header: app.globalData.header,
        data: {
          name: that.userInfo.nickName,
          avatar_url: that.userInfo.avatarUrl
        },
        success: function (res) {
          console.log("****************PUT FOR USERINFO************")
        }
      })
      wx.switchTab({
        url: `/pages/index/index`,
      })
    } else if (this.data.canIUse) {
      console.log("elseeeeeeeeeeee if")
      app.userInfoReadyCallback = res => {
        this.setData({
          isLoad: true,
          userInfo: res.userInfo,
        })
        wx.switchTab({
          url: `/pages/index/index`,
        })
      }
    } else {
      console.log("elseeeeeeeeeeeeeeeee")
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
      wx.switchTab({
        url: `/pages/index/index`,
      })
    }
  },

  onShareAppMessage: function () {
    return {
      title: `Tingbudong? 不用怕！`,
      imageUrl: ``,
      path: `/pages/index/index`
    },
      wx.updateShareMenu({
        withShareTicket: true,
        success(res) {
          console.log(res)
        }
      })
  },

  bindGetUserInfo: function (e) {
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
          wx.switchTab({
            url: '/pages/index/index',
          })
        } else {
          wx.showModal({
            title: 'Warning',
            content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!',
            showCancel: false,
            confirmText: '返回授权',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击了“返回授权”');
              }
            }
          });

        }

      }
    });
  },
})