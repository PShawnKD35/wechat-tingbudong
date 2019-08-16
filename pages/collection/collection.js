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
          slangs: res.data.slangs,
          slangsAll :res.data.slangs
        })
      console.log(res.data)
      } 
    })
  },

  onShow: function() {
    this.onLoad
  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
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
    this.setData({
      slangs: this.data.slangsAll
    })
    this.hideModal()
  },

  goToslang(e){
    let slangid = e.currentTarget.dataset.slangid
    let slangtmp = []
    this.data.slangsAll.forEach((slang)=>{
      if (slang.id == slangid) {
        slangtmp.push(slang)
      }
      this.setData({
        slangs: slangtmp
      })
      this.hideModal()
    })
  },

  saveSlang(e) {
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.favorited)
    let page = this
    if (e.currentTarget.dataset.favorited === false) {
      wx.request({
        url: `${app.globalData.url}favorites`,
        method: 'POST',
        header: app.globalData.header,
        data: {
          slang_id: e.currentTarget.dataset.id
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
          slang_id: e.currentTarget.dataset.id
        },
        success: (res) => {
          page.onLoad(page.options)
        }
      })
    }
  },
})