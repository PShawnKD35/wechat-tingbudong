const app = getApp()
const AV = require('../../utils/av-weapp-min.js');

Page({
  data: {
    name: '',
    content: '',
    tag: '',
    sticker_url: [],
    slang_id: '',
    imgList: []
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
    let sticker_url = page.data.sticker_url
    console.log("userid")
    console.log(app.globalData.header)
    console.log(page.data.name)
    page.data.imgList.forEach(function(img){
      new AV.File('file-name', {
        blob: {
          uri: img,
        },
        // please set upload file valid domain name
        // check how to push file.url
      }).save().then(
        file => {
          sticker_url.push(file.url())
          console.log(sticker_url)
          console.log('successfully uploaded')
        }
      ).catch(console.error);
    });
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
            slang_id: page.data.slang_id,
            sticker_url: page.data.imgList
          },
          success: function (res) {
            console.log(res)
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
  },

  ChooseImage() {
    wx.chooseImage({
      count: 4,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: 'Hello',
      content: 'Are you sure you want to delete this sticker?',
      cancelText: 'Not sure',
      confirmText: 'Yes',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
})