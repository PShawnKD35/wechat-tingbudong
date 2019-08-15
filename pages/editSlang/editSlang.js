const app = getApp()
const AV = require('../../utils/av-weapp-min.js');
const utilApi = require('../../utils/util.js');

Page({
  data: {
    name: '',
    slang_id: '',
    sticker_url: [],
    imgList: [],
    dialects: [],
    tags: [],
    dialect_name: '',
    tag_name: '',
    url: ''
  },

  onLoad: function (options) {
    console.log(options)
    const id = options.id;
    const name = options.name;
    const url = options.url;
    this.setData({
      name: name,
      slang_id: id,
      dialects: app.globalData.dialects,
      url: url
    })
  },
  
  dialectSelect: function (e) {
    let selected = e.currentTarget.dataset.dialect
    let dialects = []
    dialects.push(selected)
    this.setData({
      dialects: dialects,
      dialects_name: selected,
      tagHolder: ''
    })
  },

  cancelTag: function (e) {
    let selected = e.currentTarget.dataset.tag
    let tags = this.data.tags
    let filteredTags = tags.filter(function (value, index, arr) {
      return value != selected;
    });
    this.setData({
      tags: filteredTags,
    })
  },

  slangTag(e) {
    let selected = e.detail.value.trim()
    let tags = this.data.tags
    tags.push(selected)
    this.setData({
      tags: tags,
      tagHolder: ''
    })
  },

  disabledClick: function (e) {
    this.setData({
      dialects: app.globalData.dialects
    })
  },


  editSlang(e) {
    let page = this
    wx.showLoading({
      title: 'Updating Slang🤩',
    })
    if (this.data.imgList.length != 0) {
      utilApi.uploadPromise(this.data.imgList).then(sticker_url=>{
        let page = this
        let newSticker_url = sticker_url.toString().concat(',', page.data.url)
        console.log("*************Adding Tag****************")
        console.log(page.data.dialect_name)
        wx.request({
          url: `${app.globalData.url}tags`,
          method: 'POST',
          header: app.globalData.header,
          data: {
            tag: {
              dialect_name: page.data.dialect_name.toString(),
              tag_name: page.data.tags.toString(),
              slang_id: page.data.slang_id
            },
          },
          success: res =>{
            console.log(res)
          }
        })
        wx.request({
          url: `${app.globalData.url}slangs/${page.data.slang_id}`,
          method: 'PUT',
          header: app.globalData.header,
          data: {
            slang_id: page.data.slang_id,
            sticker_url: newSticker_url
          },
          success: function (res) {
            wx.navigateTo({
              url: `/pages/show/show?id=${page.data.slang_id}`,
            })
            wx.hideLoading()
            wx.showToast({
              title: `New stuffs Added🥳`,
              icon: 'none'
            });
          }
        })
      })
    }
    else {
      wx.request({
        url: `${app.globalData.url}tags`,
        method: 'POST',
        header: app.globalData.header,
        data: {
          tag: {
            dialect_name: page.data.dialect_name,
            tag_name: page.data.tags.toString(),
            slang_id: page.data.slang_id
          },
        },
        success: function (res) {
          wx.navigateTo({
            url: `/pages/show/show?id=${page.data.slang_id}`,
          })
        }
      })
      wx.hideLoading()
      wx.showToast({
        title: `New tags Added🥳`,
        icon: 'none'
      });
    } 
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