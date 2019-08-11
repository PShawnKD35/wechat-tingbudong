const app = getApp()

Page({
  data: {
// isHide is the user home page
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // isHide: getApp().globalData.isHide,
    isHide: true,
    DotStyle: true,
    slangs: [],
    ColorList: app.globalData.ColorList,
    dialects: [],
    favored: false,
    searched: false,
    preSortedTagsSlangs: []
  },

  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    }),
    this.setData({
      dialects: app.globalData.dialects
    }),
    console.log("***************Index on Load********************")
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
      wx.request({
        url: `${app.globalData.url}` + 'slangs',
        header: app.globalData.header,
        method: 'GET',
        success: res => {
          console.log(res)
          that.setData({
            preSortedTagsSlangs: res.data.slangs,
            slangs: that.tagsSpliter(res.data.slangs)
          })
          // if (this.slangReadyCallback) {
          //   this.slangReadyCallback(res)
          // }
        }
    })
    this.setData({
      searched: false,
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        isHide: false
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          isHide: false
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            isHide: false
          })
        }
      })
    }
  },

  tagsSpliter(slangs) {
    let splitedSlangs = slangs
    splitedSlangs.forEach( function(slang){
      if (slang.tags[0] != undefined){
        let tmptags = slang.tags
        slang.tags = tmptags[0].split(',')
      }
    })
    this.setData({
      slangs: splitedSlangs
    })
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
    console.log(e)
    wx.getUserInfo({
      success: function (res) {
        let user_id = app.globalData.userId;
        if (e.detail.userInfo) {
          console.log("userinfo：");
          console.log(e.detail.userInfo);
          page.setData({
            isHide: false
          });
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
            success: function(res) {
              console.log("****************PUT FOR USERINFO************")
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

      }
    });
  },
// search
  onSearch: function(e) {
    console.log("SEARCHHHHHHHHINGGGGGGGGGG")
    console.log(e.detail)
    let page = this
    wx.request({
      url: `${app.globalData.url}slangs`,
      method: 'GET',
      header: app.globalData.header,
      data: { name: e.detail },
      success: function(res) {
        page.tagsSpliter(res.data.slangs)        
        page.setData({
         searched: true
        })
        if (e.detail == '') {
          page.setData({
            searched: false
          })
        } 
      }
    });

  },
// to show
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