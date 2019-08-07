const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {

    name: '',
    content: '',
    tag: '',
    sticker_url:'',
    slang_id: ''
  },

  onLoad: function (options) {

  },

  slangName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  definitionTag(e) {
    this.setData({
      tag: e.detail.value
    })
  },

  definitionContent(e) {
    this.setData({
      content: e.detail.value
    })
  },

  submitNewSlang(e) {
    let page = this
    console.log("userid")
    console.log(app.globalData.header)
    console.log(page.data.name)
    wx.request({
      url: `${app.globalData.url}slangs`,
      method: 'POST',
      header: app.globalData.header,
      data: {name: page.data.name},
      success: function (res) {
        page.data.slang_id = res.data.slang_id
        console.log(page.data.slang_id)
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
          title: `Slang Added🥳`,
          icon: 'none'
        });
      }
    })
  }
})