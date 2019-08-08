const AV = require('./utils/av-weapp-min.js')
const config = require('./key')


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
    AV.init({
      appId: config.appId,
      appKey: config.appKey,
    });
  },

  globalData: {
    userInfo: null,
    userId: '',
    header: {},
    url: `http://localhost:3000/api/v1/`,
    // url: `https://tingbsudong.wogengapp.cn/api/v1/`,
    header: '',
    ColorList: [{ name: 'red' }, { name: 'orange' }, { name: 'blue' }, { name: 'green' }, { name: 'olive' }, { name: 'yellow' }, { name: 'cyan' }, { name: 'purple' }, { name: 'mauve' }, { name: 'pink' }, { name: 'brown' }, { name: 'grey' }]
  }
})