const app = getApp()
Page({

  data: {
    name: '',
    definition_id: '',
    content: ''
  },

  onLoad: function (options) {
    const id = options.id;
    const name = options.name;
    const content = options.content;
    console.log(options)
    this.setData({
      name: name,
      content: content,
      definition_id: id
    })
  },

  definitionInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },

  submitEditDefinition(e) {
    let page = this
    wx.request({
      url: `${app.globalData.url}definitions/${page.data.definition_id}`,
      method: 'PUT',
      header: app.globalData.header,
      data: {
        content: page.data.content
      }
    })
  }

})