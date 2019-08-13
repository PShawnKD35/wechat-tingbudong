// pages/components/slang-card/slang-card.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },

  properties: {
    'searched':{
      type: Boolean,
      value: false
    },
    'slangs':{
      type: null,
      value: ''
    }
  },


  data: {

  },


  methods: {
    ///////////////// to show page /////////////////
    toSlangShow: function (event) {
      console.log(event)
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
  }
})