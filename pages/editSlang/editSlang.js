const app = getApp()
const AV = require('../../utils/av-weapp-min.js');

Page({
  data: {
    name: '',
    tag: '',
    slang_id: '',
    sticker_url: [],
    imgList: [],
    dialectTag: [],
    categories: [{ dialect: '官话' }, { dialect: '广东话' }, { dialect: '东北话' }, { dialect: '台语' }, { dialect: '四川话' }, { dialect: '湖南话' }, { dialect: '客家话' }, { dialect: '闽南话' }]
  },

  onLoad: function (options) {
    const id = options.id;
    const name = options.name;
    this.setData({
      name: name,
      slang_id: id
    })
  },
  
  dialectTag: function (e) {
    let dialectTag = e.detail.value
    // this.setData({
    //   dialectTag: e.detail.value
    // })
    // console.log(this.data.dialectTag)
  },

  dialectSelect: function (e) {
    console.log(e.currentTarget.dataset.dialect)
    let dialect = e.currentTarget.dataset.dialect
    let dialectTag = this.data.dialectTag
    dialectTag.push(dialect)
    this.setData({
      dialectTag: dialectTag
    })
  },

  slangTag: function (e) {
    console.log(e.detail.value)
  },

  editSlang(e) {
    let page = this
    page.data.dialectTag.forEach((dialect) => {
      console.log("TAGGGGGGGGGGG")
      wx.request({
        url: `${app.globalData.url}tags`,
        method: 'POST',
        header: app.globalData.header,
        data: {
          tag: {
            dialect_name: dialect,
            slang_id: page.data.slang_id
          },
          // slang: page.data.name
        },
        success: function (res){
          console.log(res)
        }
      })
    }),
    wx.request({
      url: `${app.globalData.url}slangs/${page.data.slang_id}`,
      method: 'PUT',
      header: app.globalData.header,
      data: {
        content: page.data.content,
        slang_id: page.data.slang_id,
        sticker_url: page.data.imgList
      },
      success: function (res) {
        wx.navigateTo({
          url: `/pages/show/show?id=${page.data.slang_id}`,
        })
        wx.showToast({
          title: `New stuffs Added🥳`,
          icon: 'none'
        });
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