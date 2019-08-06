//app.js
App({
  onLaunch: function () {
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
    // userId: '',
    url: `http://localhost:3000/api/v1/`,
    // fake open_email for authentication

    header: '',
  }
})