const app = getApp()
const AV = require('../../utils/av-weapp-min.js');

Page({
  data: {
    name: '',
    tag: '',
    slang_id: '',
    sticker_url: [],
    imgList: [],
  },

  onLoad: function (options) {
    const id = options.id;
    const name = options.name;
    this.setData({
      name: name,
      slang_id: id
    })
  },

  slangTag: function (e) {
    console.log(e.detail.value)
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
            slang_id: page.data.slang_id,
            sticker_url: page.data.imgList
          },
          success: function (res) {
            console.log(res)
            console.log(page.data.slang_id)
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