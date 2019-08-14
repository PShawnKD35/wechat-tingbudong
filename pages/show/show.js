const app = getApp()
const utilApi = require('../../utils/util.js');

Page({
  data: {
    favored: false,
    liked: false,
    likedNum: 0,
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
      success(res) { 
        page.setData({

          slang: res.data.slang,
          userId: app.globalData.userId

        })   
        page.swiperListFormatter(res.data.slang.sticker_url.split(','))
      }
    })
  },
// definition id required
// param missing
  giveItaLike: function (e) {
    console.log(e.currentTarget.dataset.id)    
    const liked = !this.data.liked
    this.setData({ liked: liked })
// neeeeed to make it dynamic
    let definition_id = e.currentTarget.dataset.id
    wx.request({
      url: `${app.globalData.url}likes`,
      method: 'POST',
      header: app.globalData.header,
      data: {like: {definition_id: definition_id}},
      success: function (res) {
        console.log(res)
      }
    })
  },
// sticker seperated
  stickerSplitter(urls) {
    let sticker_url = urls
    sticker_
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
    console.log(e)
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
          console.log(res)
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
    console.log(e)
    let page = this
    let data = {slang_id: page.data.slang.id}
    const favored = !this.data.favored
    this.setData({ favored: favored })

    if (this.data.favored == true){
      wx.request({
        url: `${app.globalData.url}favorites`,
        method: 'POST',
        header: app.globalData.header,
        data: {
            slang_id: page.data.slang.id
        },
        success: (res)=>{
          console.log(res)
        }
      })
      // utilApi.apiCall('favorites', 'POST', { slang_id: this.data.slang.id }).then(res=>{
      //   console.log(res).catch(fail => {
      //     console.log(fail)
      //   })
      // })
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
        }
      })
    }

  },


  ///////////////// Insert keys to tags /////////////////
  swiperListFormatter(sticker_url) {
    let urls = sticker_url
    let i = 0
    let swiperList = []
    urls.forEach((url) => {
      console.log(url)
      swiperList.push({id: i,
        type: 'images',
        url: url})
      i++
    })
    this.setData({
      swiperList: swiperList
    })
  },
  // towerSwiper
  // 初始化towerSwiper
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