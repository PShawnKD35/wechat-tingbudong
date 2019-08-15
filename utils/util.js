const app = getApp()
const AV = require('av-weapp-min.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
  // uploadPromise: uploadPromise
}

const uploadPromise = imgList => {
  return new Promise ((resolve, reject)=>{
      console.log("Starting upload for sticker")
      let sticker_url = []
      let success = []
      let comparison = imgList.map(i=>{return 1})

      console.log(imgList)
      imgList.forEach(function (img) {
        new AV.File('file-name', {
          blob: {
            uri: img,
          },
        }).save().then(
          file => {
            sticker_url.push(file.url())
            success.push(1)
            console.log("this is sticker_url: " + sticker_url)
            if (success.length == comparison.length){
              resolve(sticker_url)
            }
            console.log('successfully uploaded stickers')
          }
        ).catch(console.error);
      })
      // console.log(sticker_url)
      // this.setData({
      //   sticker_url: sticker_url
      // })
      // let sticker_url = oldsticker_url

      console.log("Ending upload for sticker")
  })
  
}

const textFormatter = function (slangsRes, length){
  // return new Promise(function(resolve, reject) {
    console.log("in textformatter")
    let slangs = slangsRes
    slangs.forEach((slang)=>{
      slang.definitions.forEach((definition)=>{
        let str = definition.content
        if (str.length > length) {
          // console.log(str.substring(0, length) + '...')
          //  str.substring(0, length) + '...';
          definition.content = str.substring(0, length) + '...' 
          console.log(definition.content)
        }
      })
    });
  return slangsRes

}

const apiCall = function (route){
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${app.globalData.url}`+ route,
      method: 'GET',
      header: app.globalData.header,
      success: function (res) {
        console.log(res)
        resolve(res)
      }, 
      fail: function (res) {
        reject(res)
      }
      })
    })
  }

module.exports = { 
  apiCall: apiCall,
  uploadPromise: uploadPromise,
  textFormatter: textFormatter
}
