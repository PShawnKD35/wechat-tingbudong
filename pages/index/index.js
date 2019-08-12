const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    DotStyle: true,
    slangs: [],
    ColorList: app.globalData.ColorList,
    tagShow: [],
    favored: false,
    searched: false,
    CustomBar: app.globalData.CustomBar,
    TabCur: 1,
    scrollLeft: 0,
    tags: [],
    // checkbox: [{
    //   name: '官话',
    //   checked: false,
    //   hot: false,
    // }, {
    //   // value: ,
    //   name: '官话',
    //   checked: true,
    //   hot: false,
    // }, {
    //   value: 2,
    //   name: '',
    //   checked: true,
    //   hot: true,
    // }, {
    //   value: 3,
    //   name: '',
    //   checked: false,
    //   hot: true,
    // }, {
    //   value: 4,
    //   name: '80元',
    //   checked: false,
    //   hot: false,
    // }, {
    //   value: 5,
    //   name: '',
    //   checked: false,
    //   hot: false,
    // }]
  },

  onLoad: function (options) {
    wx.hideLoading()
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
          slangs: that.tagsSpliter(res.data.slangs)
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
        console.log(res)
        that.checkBoxTagsTransformer(res.data)
      }
    })
    this.setData({
      searched: false,
    })
  },

  checkBoxTagsTransformer(tags){
    let tagStorage = []
    tags.forEach((tag)=>{
      tagStorage.push({
        name: tag,
        checked: false,
        hot: false
      })
    })
    this.setData({
      tags: tagStorage
    })
  },

  tagsSpliter(slangs) {
    let splitedSlangs = slangs
    splitedSlangs.forEach( function(slang){
      if (slang.tags[0] != undefined){
        let tmptags = slang.tags
        slang.tags = tmptags[0].split(',')
      }
    })
    this.setData({
      slangs: splitedSlangs
    })
  },
// share app
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
// search
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
        page.tagsSpliter(res.data.slangs)        
        page.setData({
         searched: true
        })
        if (e.detail == '') {
          page.setData({
            searched: false
          })
        } 
      }
    });

  },

  // tagSearch: function
// to show
  toSlangShow: function(event) {
    console.log(event)
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`,
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items
    })
  }
})