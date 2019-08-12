const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: app.globalData.isHide,
    DotStyle: true,
    slangs: [],
    ColorList: app.globalData.ColorList,
    dialects: [],
    favored: false,
    searched: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 1,
    scrollLeft: 0,
    regions: ['China', 'Hong Kong', 'Taiwan', 'Macau']
  },

  onLoad: function (options) {
    wx.hideLoading()
    wx.showShareMenu({
      withShareTicket: true
    }),
    this.setData({
      dialects: app.globalData.dialects
    }),
    console.log("***************Index on Load********************")
    var that = this;
    wx.request({
      url: `${app.globalData.url}` + 'slangs',
      header: app.globalData.header,
      method: 'GET',
      success: res => {
        console.log(res)
        that.setData({
          slangs: that.tagsSpliter(res.data.slangs)
        })
      }
    })
    this.setData({
      searched: false,
    })
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
// share app
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
  },
  showModal(e) {
  this.setData({
    modalName: e.currentTarget.dataset.target
  })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  }
})