// pages/addDefinition/addDefinition.js
Page({

  data: {
    name: '',
    definition_id: ''
  },

  onLoad: function (options) {
    const id = options.id;
    const name = options.name;
    this.setData({
      name: name,
      definition_id: id
    })
  },

  onReady: function () {

  },

})