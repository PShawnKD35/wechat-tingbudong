const AV = require('./utils/av-weapp-min.js')
const config = require('./key')

App({
  onLaunch: function () {
    let page = this
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
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              // login check to get openID
              wx.login({
                success: res => {
                  console.log("用户的code:" + res.code);
                  let code = res.code
                  wx.request({
                    url: `${page.globalData.url}` + 'login',
                    method: 'POST',
                    data: {
                      code: code
                    },
                    // check with shawn
                    success: res => {
                      console.log("****************POST FOR OPEN-ID************")
                      page.globalData.userId = res.data.userId
                      page.globalData.header = {
                        'X-User-Email': `${res.data.email}`,
                        'X-User-Token': `${res.data.userToken}`
                      }
                      console.log(page.globalData.header)
                    }
                  });
                }
              });
            }
          });
        } 
      }
    });
  },

  globalData: {
    userInfo: null,
    userId: '',
    header: {},
    // url: `http://localhost:3000/api/v1/`,
    url: `https://tingbudong.wogengapp.cn/api/v1/`,
    header: '',
    ColorList: [{ name: 'red' }, { name: 'orange' }, { name: 'blue' }, { name: 'green' }, { name: 'olive' }, { name: 'yellow' }, { name: 'cyan' }, { name: 'purple' }, { name: 'mauve' }, { name: 'pink' }, { name: 'brown' }, { name: 'grey' }]
  }
})