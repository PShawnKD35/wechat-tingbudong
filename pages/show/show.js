const app = getApp()
Page({
  data: {
    favored: false
  },
  
  onLoad: function (options) {
    let page = this        
    wx.request({
      url: `${app.globalData.url}slangs/${options.id}`,
      method: 'GET',
      header: app.globalData.header,
      success(res) {
        page.setData({
          slang: res.data.slang
        })
      }
    })
  },
// definition id required
// param missing
  giveItaLike: function (e) {
    console.log(e.currentTarget.dataset.id)
    let definition_id = e.currentTarget.dataset.id
    wx.request({
      url: `${app.globalData.url}likes`,
      method: 'POST',
      header: app.globalData.header,
      data: {like: {definition_id: definition_id}},
      success: function (res) {
        console.log(res)
      }
    })
  },
// require slang-id
  editSlang: function (e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/editSlang/editSlang?id=${id}&name=${name}`,
    })
  },

  editDefinition: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let content = e.currentTarget.dataset.content
    let slangid = e.currentTarget.dataset.slangid
    wx.navigateTo({
      url: `/pages/editDef/editDef?id=${id}&name=${name}&content=${content}&slangid=${slangid}`
    })
  },

  addDefinition: function (e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/addDef/addDef?id=${id}&name=${name}`,
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  saveSlang(e) {
    console.log(e)
    const favored = !this.data.favored
    this.setData({ favored: favored })
  }
})