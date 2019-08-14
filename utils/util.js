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
      console.log(imgList)
      imgList.forEach(function (img) {
        new AV.File('file-name', {
          blob: {
            uri: img,
          },
        }).save().then(
          file => {
            sticker_url.push(file.url())
            console.log("this is sticker_url: " + sticker_url)
            console.log('successfully uploaded stickers')
          }
        ).catch(console.error);
      })
      // console.log(sticker_url)
      // this.setData({
      //   sticker_url: sticker_url
      // })
      // let sticker_url = oldsticker_url
      resolve(sticker_url)
      console.log("Ending upload for sticker")
  })
}

// module.exports = { uploadPromise: uploadPromise}

const apiCall = function (route, methodChoosen, datahash){
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${app.globalData.url}route`,
      method: methodChoosen,
      header: app.globalData.header,
      data: dataHash, 
      success: function (res) {
        resolve(res)
      }, 
      fail: function (res) {
        reject(res)
      }
      })
    }
  )}

module.exports = { 
  apiCall: apiCall,
  uploadPromise: uploadPromise 
  }
