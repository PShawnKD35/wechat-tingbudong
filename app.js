const AV = require('./utils/av-weapp-min.js')
const config = require('./key')

App({
  onLaunch: function () {
    let page = this
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
    // wx.showLoading({
    //   title: 'Loading',
    // }),
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
            console.log(res)
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
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
        else {
          // wx.hideLoading()
          console.log("im in get setting's elseeeeeeeeeeeee")
          wx.redirectTo({
            url: 'landing',
          })
          this.globalData.isLoad = true
          console.log(this.globalData.isLoad)
        }
      }
    })
  },

  globalData: {
    isLoad: false,
    userInfo: null,
    userId: '',
    header: {},
    url: `http://localhost:3000/api/v1/`,
    // url: `https://tingbudong.wogengapp.cn/api/v1/`,
    regions: [{ name: '中文'}, { name: 'English' }],
    dialects: ['官话', '广东话', '东北话', '台语', '四川话', '湖南话', '客家话', '闽南话'],
    ColorList: [{ name: 'red' }, { name: 'orange' }, { name: 'blue' }, { name: 'green' }, { name: 'olive' }, { name: 'yellow' }, { name: 'cyan' }, { name: 'purple' }, { name: 'mauve' }, { name: 'pink' }, { name: 'brown' }, { name: 'grey' }]
  },
})