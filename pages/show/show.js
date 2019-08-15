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
    userId: ''
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
        if(page.data.slang.sticker_url != null){
          page.swiperListFormatter(page.data.slang.sticker_url.toString().split(','))
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
// require slang-id
  editSlang: function (e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/editSlang/editSlang?id=${id}&name=${name}`,
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
      imageUrl: `${this.data.slang.sticker_url}`,
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
          page.onLoad(page.options)
        }
      })
    }
  },
  ///////////////// Insert keys to tags /////////////////
  swiperListFormatter(sticker_url) {
    let urls = sticker_url
    let i = 0
    let swiperList = []
    if (urls != null){ 
      urls.forEach((url) => {
        swiperList.push({id: i,
          type: 'images',
          url: url})
        i++
      });
      this.setData({
        swiperList: swiperList
      });
    };
    this.towerSwiper('swiperList');
  },

  deleteSlang(e) {
    let slangId = e.currentTarget.id
    wx.request({
      url: `${app.globalData.url}slangId`,
      method: 'DELETE',
      header: app.globalData.header,
      success: res => {
      }
    })
  },

  // towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }
})