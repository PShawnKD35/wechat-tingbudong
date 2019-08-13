const app = getApp()
const AV = require('../../utils/av-weapp-min.js');

Page({
  data: {
    name: '',
    content: '',
    dialect_name: '',
    tag_name: '',
    sticker_url: [],
    slang_id: '',
    imgList: [],
    disabled: false,
    dialects: [],
    tags: []
  },

  onLoad: function () {
    this.setData({
      dialects: app.globalData.dialects
    })
  },

  dialectSelect: function (e) {
    let selected = e.currentTarget.dataset.dialect
    let dialects = []
    dialects.push(selected)
    this.setData({
      dialects: dialects,
      dialect_name: selected,
      tagHolder: ''
    })
  },

  cancelTag: function (e) {
    let selected = e.currentTarget.dataset.tag
    let tags = this.data.tags
    let filteredTags = tags.filter(function(value, index, arr){
      return value != selected;
    });
    this.setData({
      tags: filteredTags,
    })
  },

  slangTag(e) {
    let selected = e.detail.value.trim()
    let tags = this.data.tags
    // tags.forEach((tag)=>{
    //   if(tag != selected)
    //     tags.push(selected)
    // })
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

  slangName(e) {
    this.setData({
      name: e.detail.value
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
    page.data.imgList.forEach(function(img){
      new AV.File('file-name', {
        blob: {
          uri: img,
        },
      }).save().then(
        file => {
          sticker_url.push(file.url())
          console.log(sticker_url)
          console.log('successfully uploaded stickers')
        }
      ).catch(console.error);
    });
    // posting slang
    wx.request({
      url: `${app.globalData.url}slangs`,
      method: 'POST',
      header: app.globalData.header,
      data: { name: page.data.name,
              sticker_url: page.data.imgList[0],
              },
      success: function (res) {
        console.log("Response from slang request:")
        console.log(res)
        page.data.slang_id = res.data.slang_id
        console.log("this is the tag posteddddddddddddddddddddddddddd")
        console.log(page.data.tags.toString())
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
            console.log("Response from tag request:")
            console.log(res)
            // console.log(page.data.slang_id)
            // posting definition
            wx.request({
              url: `${app.globalData.url}definitions`,
              method: 'POST',
              header: app.globalData.header,
              data: {
                content: page.data.content,
                slang_id: page.data.slang_id,
              },
              success: function (res) {
                console.log("Response from definition request:")
                console.log(res)
                wx.reLaunch({
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