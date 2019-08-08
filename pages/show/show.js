const app = getApp()
Page({
  data: {
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
  giveItaLike: function (e) {
    console.log(e.currentTarget.dataset.id)
    let definition_id = e.currentTarget.dataset.id
    wx.request({
      url: `${app.globalData.url}likes`,
      method: 'POST',
      header: app.globalData.header,
      data: definition_id,
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
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/addDef/addDef?id=${id}&name=${name}`,
    })
  },

  addDefinition: function (e) {
    console.log(e.currentTarget.dataset.id)
    let slang_id = e.currentTarget.dataset.id
    wx.request({
      url: `${app.globalData.url}definitions`,
      method: 'POST',
      header: app.globalData.header,
      data: {
        content: page.data.content,
        slang_id: page.data.slang_id
      },
      success: function (res) {
        console.log(res)
      }
    })
    wx.navigateTo({
      url: `/pages/show/show?id=${page.data.slang_id}`,
    })
    wx.showToast({
      title: `Definition Added🥳`,
      icon: 'none'
    });
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  }
})