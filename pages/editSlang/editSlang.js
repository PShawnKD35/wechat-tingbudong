const app = getApp()
const AV = require('../../utils/av-weapp-min.js');

Page({
  data: {
    name: '',
    tag: '',
    sticker_url: '',
    slang_id: ''
  },

  onLoad: function (options) {
    const id = options.id;
    const name = options.name;
    this.setData({
      name: name,
      slang_id: id
    })
  },

  slangName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  submitNewSlang(e) {
    let page = this
    console.log(app.globalData.header)
    console.log(page.data.name)
    wx.request({
      url: `${app.globalData.url}slangs`,
      method: 'POST',
      header: app.globalData.header,
      data: { name: page.data.name },
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
  },

  takePhoto: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePath = res.tempFilePaths[0];
        new AV.File('file-name', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => console.log(file.url())
        ).catch(console.error);
        console.log('successfully uploaded')
      }
    });
  }
})