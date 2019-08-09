const app = getApp()

Page({
  data: {
// isHide is the user home page
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: true,
    DotStyle: true,
    slangs: [],
    ColorList: app.globalData.ColorList,
    categories: [{ dialect: '官话' },{ dialect: '广东话' }, { dialect: '东北话' }, { dialect: '台语' }, { dialect: '四川话' },{ dialect: '湖南话' }, { dialect: '客家话' }, { dialect: '闽南话' }],
    favored: false,
    searched: false
  },

  onLoad: function () {
    console.log("on load ======================")
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
    }, 200)

// check authorisation granted or not
    // wx.checkSession({
    //   success: function (res) {
    //   },
    //   fail: (res => {
        
    //   })
    // })
  },

  onShow: function (e) {
    this.setData({
      searched: false
    })
    wx.request({
      url: `${app.globalData.url}` + 'slangs',
      header: app.globalData.header,
      method: 'GET',
      success: res => {
        console.log("****************GET FOR SLANGS************")
        this.setData({
          slangs: res.data.slangs
        })
        console.log(this.data.slangs)
        // console.log(new Date(res.data.slangs.first["created_at"]))
      }
    })
  },

  bindGetUserInfo: function (e) {
    var page = this;
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
        console.log(res)
        page.setData({
        slangs: res.data.slangs,
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