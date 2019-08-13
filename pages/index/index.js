const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    DotStyle: true,
    slangs: [],
    ColorList: app.globalData.ColorList,
    favored: false,
    searched: false,
    CustomBar: app.globalData.CustomBar,
    TabCur: 1,
    scrollLeft: 0,
    tags: [],
    searchTags: [],
    value: ''
  },
///////////////// On load /////////////////
  onLoad: function (options) {
    // wx.hideLoading()
    wx.showShareMenu({
      withShareTicket: true
    }),
    console.log("***************Index on Load********************")
    var that = this;
    wx.request({
      url: `${app.globalData.url}` + 'slangs',
      header: app.globalData.header,
      method: 'GET',
      success: res => {
        console.log(res)
        that.setData({
          slangs: res.data.slangs
        })
      }
    })
    var that = this;
    wx.request({
      url: `${app.globalData.url}` + 'tags',
      header: app.globalData.header,
      method: 'GET',
      success: res => {
        console.log("Getting tagssssssssssssssss")
        console.log(res.data)
        that.insertChecker(res.data)
      }
    })
    this.setData({
      searched: false,
    })
    this.selectComponent("#slang-card")
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
          console.log(res)
        }
      })
  },
///////////////// search slang /////////////////
  onSearch: function(e) {
    console.log("SEARCHHHHHHHHINGGGGGGGGGG")
    console.log(e.detail)
    let page = this
    wx.request({
      url: `${app.globalData.url}slangs`,
      method: 'GET',
      header: app.globalData.header,
      data: { name: e.detail },
      success: function(res) {
        page.setData({
         searched: true,
         slangs: res.data.slangs
        })
        if (e.detail == '') {
          page.setData({
            searched: false
          })
        } 
      }
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
      value: searchTags
    })
    this.searchTags(searchTags)
  },
//////////////////////////// searching tags function /////////////////////////////
  searchTags(tags){
    let searchTags = tags.toString()
    let page = this
    let dialects = app.globalData.dialects
    console.log('this is the TAG Searcher!!!!!!!!!!!!!!!!!')
    console.log(tags.toString())
    wx.request({
      url: `${app.globalData.url}slangs`,
      method: 'GET',
      header: app.globalData.header,
      data: {
        tag: searchTags
      },
      success: function(res){
        console.log(res)
        page.setData({
          searched: true,
          slangs: res.data.slangs
        })
      }
    })
    tags.forEach((tag) => {
      if (dialects.includes(tag)) {
        wx.redirectTo({
          url: `/pages/dialect/dialect?dialect=${tag}&tags=${searchTags}`,
        })
      }
    })
  },
/////////////////////////// chooseing tags: function //////////////////////////////
  chooseTag(e) {
    console.log(e)
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
  }
})