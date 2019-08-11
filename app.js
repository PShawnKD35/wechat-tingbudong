const AV = require('./utils/av-weapp-min.js')
const config = require('./key')

App({
  onLaunch: function () {
    let page = this
    // setTimeout(function () {
    //   wx.hideTabBar()
    // }, 500),
    console.log(123, page.globalData)
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    AV.init({
      appId: config.appId,
      appKey: config.appKey,
    });
    console.log("******************Starting the login Process*****************")
    wx.showLoading({
      title: 'Loading',
    }),
    wx.login({
      success: res => {
        console.log("**********************Getting User's Code**********************")
        console.log("用户的code:" + res.code);
        let code = res.code
        wx.request({
          url: `${page.globalData.url}` + 'login',
          method: 'POST',
          data: {
            code: code
          },
          success: res => {
            console.log("****************POST FOR OPEN-ID************")
            page.globalData.isHide = false
            console.log(page.globalData.isHide)
            page.globalData.userId = res.data.userId
            page.globalData.header = {
              'X-User-Email': `${res.data.email}`,
              'X-User-Token': `${res.data.userToken}`
            }
            console.log(page.globalData.header)
          }
        });
      },
    });



    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    userId: '',
    header: {},
    isHide: true,
    url: `http://localhost:3000/api/v1/`,
    // url: `https://tingbudong.wogengapp.cn/api/v1/`,
    header: '',
    ColorList: [{ name: 'red' }, { name: 'orange' }, { name: 'blue' }, { name: 'green' }, { name: 'olive' }, { name: 'yellow' }, { name: 'cyan' }, { name: 'purple' }, { name: 'mauve' }, { name: 'pink' }, { name: 'brown' }, { name: 'grey' }]
  }
})