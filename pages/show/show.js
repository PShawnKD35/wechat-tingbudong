const app = getApp()
const utilApi = require('../../utils/util.js');
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;

Page({
  data: {
    liked: false,
    slang: {},
    swiperList: [],
    cardCur: 0,
    userId: '',
    sticker_url: []
  },
  
  onLoad: function (options) {
    let page = this       
    wx.request({
      url: `${app.globalData.url}slangs/${options.id}`,
      method: 'GET',
      header: app.globalData.header,
      success: res => { 
        page.setData({
          userId: app.globalData.userId,
          slang: res.data.slang
        })
        if (res.data.slang.sticker_url != null) {
          page.setData({
            sticker_url: res.data.slang.sticker_url.split(',')
          })
          console.log(res.data.slang.sticker_url.split(','))
        }
      } 
    })
  },


  giveItaLike: function (e) {
    let page = this
    if (e.currentTarget.dataset.likeid == ""){
    let definition_id = e.currentTarget.dataset.id
      wx.request({
        url: `${app.globalData.url}likes`,
        method: 'POST',
        header: app.globalData.header,
        data: {like: {definition_id: definition_id}},
        success: function (res) {
          page.onLoad(page.options)
        }
      })
    }
    else {
      wx.request({
        url: `${app.globalData.url}likes/${e.currentTarget.dataset.likeid}`,
        method: 'DELETE',
        header: app.globalData.header,
        success: res => {
          page.onLoad(page.options)
        }
      })
    }
  },

// require slang-id
  editSlang: function (e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let url = e.currentTarget.dataset.url
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: `/pages/editSlang/editSlang?id=${id}&name=${name}&url=${url}`,
    })
  },

  editDefinition: function (e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let content = e.currentTarget.dataset.content
    let slangid = e.currentTarget.dataset.slangid
    wx.navigateTo({
      url: `/pages/editDef/editDef?id=${id}&name=${name}&content=${content}&slangid=${slangid}`
    })
  },

  addDefinition: function (e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/addDef/addDef?id=${id}&name=${name}`,
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  onShareAppMessage: function () {
    return {
      title: `Tingbudong, ${this.data.slang.name}?`,
      imageUrl: `${this.data.slang.sticker_url[0]}`,
      path: `/pages/show/show?id=${this.data.slang.id}`
    },
      wx.updateShareMenu({
        withShareTicket: true,
        success(res) { 
        }
      })
  },

  goTotag(e) {
    let tags = e.currentTarget.dataset.tag
    wx.navigateTo({
      url: `/pages/dialect/dialect?tags=${tags}&show=show`,
    })
  },

  saveSlang(e) {
    let page = this
    if (page.data.slang.favorited === false){
      wx.request({
        url: `${app.globalData.url}favorites`,
        method: 'POST',
        header: app.globalData.header,
        data: {
            slang_id: page.data.slang.id
        },
        success: (res) =>{
          page.onLoad(page.options)
        }
      })
    }
    else {
      wx.request({
        url: `${app.globalData.url}favorites`,
        method: 'DELETE',
        header: app.globalData.header,
        data: {
          slang_id: page.data.slang.id
        },
        success: (res) => {
          console.log(res)
          page.onLoad(page.options)
        }
      })
    }
  },
  
  deleteDefinition(e){
    let definitionId = e.currentTarget.dataset.id
    let slangId = e.currentTarget.dataset.slangid
    this.deleteDef(definitionId)
    this.onLoad(this.options)
  },

  deleteDef(id){
    wx.request({
      url: `${app.globalData.url}definitions/`+ id,
      method: 'DELETE',
      header: app.globalData.header,
      success: res => {
        console.log(res)
      }
    })
  },

  deleteSlang(e) {
    let slangId = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    wx.request({
      url: `${app.globalData.url}slangs/${slangId}`,
      method: 'DELETE',
      header: app.globalData.header,
      success: res => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  },
  //  on scrolling left go back
  onShow: function () {
    let that = this
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    // 向左滑动   
    if (touchMove - touchDot <= -40 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      console.log("向右滑动");
      wx.navigateTo({
        url: '/pages/index/index'
      })
    }
    // 向右滑动   
    if (touchMove - touchDot >= 40 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      console.log("向左滑动");
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
})