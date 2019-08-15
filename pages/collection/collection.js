const app = getApp()
Page({

  data: {
    CustomBar: app.globalData.CustomBar,
    slangs: [],
    TabCur: 1,
    scrollLeft: 0
  },

  onLoad: function () {
    console.log("this is my collection onLoad")
    let page = this
    console.log("favoritteeeeeeeeeeeeeeeeeee")
    wx.request({
      url: `${app.globalData.url}favorites`,
      method: 'GET',
      header: app.globalData.header,
      success: res => {
        page.setData({
          slangs: res.data.slangs
        })
      console.log(res.data)
      } 
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  onPullDownRefresh: function () {

  },
  editSlang(e){
    wx.navigateTo({
      url: '/pages/test/test',
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
  },

  allCollection(e){
    console.log(e)
    this.onLoad
  },

  goToslang(e){
    console.log(e.data.slangId)
  },

  saveSlang(e) {
    let page = this
    if (page.data.slang.favorited === false) {
      wx.request({
        url: `${app.globalData.url}favorites`,
        method: 'POST',
        header: app.globalData.header,
        data: {
          slang_id: page.data.slang.id
        },
        success: (res) => {
          page.onLoad(page.options)
        }
      })
    }
    else {
      wx.request({
        url: `${app.globalData.url}favorites`,
        method: 'DELETE',
        header: app.globalData.header,
        data: {
          slang_id: page.data.slang.id
        },
        success: (res) => {
          page.onLoad(page.options)
        }
      })
    }
  },
})