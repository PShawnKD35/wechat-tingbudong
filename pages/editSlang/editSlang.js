const app = getApp()
const AV = require('../../utils/av-weapp-min.js');

Page({
  data: {
    name: '',
    slang_id: '',
    sticker_url: [],
    imgList: [],
    dialects: [],
    tags: [],
    dialect_name: '',
    tag_name: ''
  },

  onLoad: function (options) {
    const id = options.id;
    const name = options.name;
    this.setData({
      name: name,
      slang_id: id,
      dialects: app.globalData.dialects
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


  editSlang(e) {
    let page = this
    page.data.dialectTag.forEach((dialect) => {
      console.log("*************Adding Tag****************")
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