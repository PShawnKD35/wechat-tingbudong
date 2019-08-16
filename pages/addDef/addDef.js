const app = getApp()
Page({

  data: {
    name: '',
    slang_id: '',
    content: ''
  },

  onLoad: function (options) {
    const id = options.id;
    const name = options.name;
    this.setData({
      name: name,
      slang_id: id
    })
  },

  definitionInput: function (e){
    console.log(e.detail.value)
    this.setData({
      content: e.detail.value
    })
    console.log(this.data.content)
  },

  submitAddDefinition (e){
    let page = this
    if (page.data.content == '') {
      wx.showToast({
        title: 'Definition can\'t be blank',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
    }
    else {
      wx.request({
        url: `${app.globalData.url}definitions`,
        method: 'POST',
        header: app.globalData.header,
        data: {
          slang_id: page.data.slang_id,
          content: page.data.content
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
    }
  }
})