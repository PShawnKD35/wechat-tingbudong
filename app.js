// app.js
const AV = require('./utils/av-weapp-min.js')
// const config = require('./key')
// Initialization of the app


App({
  onLaunch: function () {
    AV.init({
      appId: config.appId,
      appKey: config.appKey,
    });
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

  },
  globalData: {
    userInfo: null,
    userId: '',
    header: {},
    url: `http://localhost:3000/api/v1/`,
    // url: `https://tingbudong.wogengapp.cn/api/v1/`,
    header: '',
  }
})