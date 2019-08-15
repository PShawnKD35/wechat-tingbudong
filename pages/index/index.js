const app = getApp()
const utilApi = require('../../utils/util.js');

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    DotStyle: true,
    slangs: [],
    ColorList: app.globalData.ColorList,
    searched: false,
    CustomBar: app.globalData.CustomBar,
    TabCur: 1,
    scrollLeft: 0,
    tags: [],
    searchTags: [],
    value: '',
    offset: 10,
    body: {}
  },
//////////////////////////// On load ////////////////////////////
  onLoad: function (options) {
    // wx.hideLoading()
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    let body = { name: this.data.search }
    utilApi.apiCall('slangs').then(res => {
      this.setData({
        slangs: utilApi.textFormatter(res.data.slangs, 55),
      })
    });
    var that = this;
    wx.request({
      url: `${app.globalData.url}` + 'tags',
      header: app.globalData.header,
      method: 'GET',
      success: res => {
        that.insertChecker(res.data)
      }
    })
    this.setData({
      searched: false,
    })
    this.selectComponent("#slang-card")
  },

  toSlangShow: function (event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`,
    })
    this.triggerEvent("action");
  },
  ///////////////// cardSwiper /////////////////
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
    this.triggerEvent("action");
  },
///////////////// Insert keys to tags /////////////////
  insertChecker(tags){
    let temptags = tags
    let i = 0
    temptags.forEach((tag)=>{
      tag['value'] = i
      tag['checked'] = false
      i++
    })

    this.setData ({
      tags: temptags
    })
  },
///////////////// enable share app /////////////////
  onShareAppMessage: function () {
    return {
      title: `Tingbudong? 不用怕！`,
      imageUrl: ``,
      path: `/pages/index/index`
    },
      wx.updateShareMenu({
        withShareTicket: true,
        success(res) {
        }
      })
  },
///////////////// search slang /////////////////
  onSearch: function(e) {
    let body = { name: e.detail }
    utilApi.apiWithData('slangs', body).then(res => {
      this.setData({
        slangs: utilApi.textFormatter(res.data.slangs, 55),
        body: body
      })
    });
  },
///////////////// cardSwiper /////////////////
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
///////////////// modal: tag selector /////////////////
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  /////////////////////// setting search tags values ////////////////////////////
  hideModal(e) {
    let tags = this.data.tags;
    let searchTags = []
    this.setData({
      modalName: null
    })
    tags.forEach((tag)=>{
      if(tag.checked){
        searchTags.push(tag.name)
      }
    })
    this.setData({
      searchTags: searchTags,
      value: searchTags,
    })
    this.searchTags(searchTags)
  },
//////////////////////////// searching tags function /////////////////////////////
  searchTags(tags){
    let searchTags = tags.toString()
    let page = this
    let dialects = app.globalData.dialects
    let body = { tag: searchTags}
    tags.forEach((tag) => {
    if (dialects.includes(tag)) {
        wx.redirectTo({
          url: `/pages/dialect/dialect?dialect=${tag}&tags=${searchTags}`,
        })
      } 
      else {
        utilApi.apiWithData('slangs', body).then(res => {
          this.setData({
            slangs: utilApi.textFormatter(res.data.slangs, 55),
            body: body
          })
        });
      }
    })
  },
/////////////////////////// chooseing tags: function //////////////////////////////
  chooseTag(e) {
    let tags = this.data.tags;
    let selectedTag = e.currentTarget.dataset.selected;
    tags.forEach((tag)=> {
      if (tag.name == selectedTag){
        tag.checked = !tag.checked
      }
    })
    this.setData({
      tags: tags,
    })
  },
  
  onReachBottom(){
    utilApi.apiWithData(`slangs?offset=${this.data.offset + 10}`, this.data.body).then(res => {
      let slangsTmp = this.data.slangs
      utilApi.textFormatter(res.data.slangs, 55).forEach((slang) => {
        slangsTmp.push(slang)
      })
      this.setData({
        slangs: slangsTmp,
        offset: this.data.offset + 10
      })
    });
  }
})