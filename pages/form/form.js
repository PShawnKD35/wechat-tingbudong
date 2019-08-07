const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {

    // name: "",
    // content: "",
    // category: "",
    // sticker_url
  },

  onLoad: function (options) {

  },

  serviceName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  serviceCharge(e) {
    this.setData({
      charge: e.detail.value
    })
  },

  serviceDescription(e) {
    this.setData({
      description: e.detail.value
    })
  },

  serviceAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },

  submitNewService(e) {
    let newService = {
      name: this.data.name,
      description: this.data.description,
      address: this.data.address,
      charge: this.data.charge,
      category: this.data.category,
    }

    wx.request({
      url: `${app.globalData.url}users/${app.globalData.userId}/services`,
      method: 'POST',
      data: newService,
      success: function (res) {
        console.log(res)
        wx.navigateTo({
          url: "additem",
        })
        wx.showToast({
          title: `Now add your items!`,
          icon: 'none'
        });
      }
    })

  },

  radioChange: function (e) {
    this.setData({
      category: e.detail.value
    })
  },

  bindStartTimeChange(e) {
    let { value } = e.detail;
    this.setData({
      startTime: value
    })
  },

  bindEndTimeChange(e) {
    let { value } = e.detail;
    this.setData({
      endTime: value
    })
  },

  bindDateChange(e) {
    let { value } = e.detail;
    console.log("date:", value);
    this.setData({
      date: value
    })
  }
})