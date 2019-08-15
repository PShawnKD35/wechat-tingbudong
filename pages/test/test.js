const app = getApp()
Page({

  data: {
    slangs: [],
    nowPgae: 1,
    startX: 0,
    slider: false,
    animationData: {},
  },
  touchstart(e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
    })
  },
  touchend(e) {
    let that = this;
    let startX = this.data.startX;
    let endX = e.changedTouches[0].clientX;
    if (this.data.slider) return;

    // 下一页(左滑距离大于30)
    if (startX - endX > 30) {
      this.setData({
        slider: true
      });
      //尾页(当前页 等于 总页数)
      if (this.data.nowPgae == this.data.slangs.length) {
        this.setData({
          slider: false
        });
        wx.showToast({ title: '已经是最后一张了', icon: 'none' });
        return;
      };

      //创建动画   5s将位置移动到-150%,-150%
      let animation = wx.createAnimation({
        duration: 500,
      });
      animation.translateX('-150%').translateY('-150%').rotate(60).step();
      this.setData({
        animationData: animation.export()
      });

      // 移动完成后
      setTimeout(function () {
        var slangs = that.data.slangs;
        var slidethis = that.data.slangs.shift(); //删除数组第一项
        that.data.slangs.push(slidethis); //将第一项放到末尾
        //创建动画   将位置归位
        let animation = wx.createAnimation({
          duration: 0,
        });
        animation.translateX('-53%').translateY('-50%').rotate(0).step();

        that.setData({
          slangs: that.data.slangs,
          animationData: animation.export(),
          slider: false,
          nowPgae: that.data.nowPgae + 1
        });
      }, 500)
    }

    // 上一页
    if (endX - startX > 30) {
      this.setData({
        slider: true
      })
      //首页
      if (this.data.nowPgae == 1) {
        this.setData({
          slider: false
        })
        wx.showToast({ title: '已经到第一张了', icon: 'none' })
        return;
      };

      //创建动画  移动到-150%,-150%
      let animation = wx.createAnimation({
        duration: 0,
      });
      animation.translateX('-150%').translateY('-150%').rotate(100).step();


      var slangs = that.data.slangs;

      var slidethis = that.data.slangs.pop(); //删除数组末尾项
      that.data.slangs.unshift(slidethis);//将删除的末尾项放到第一项
      that.setData({
        animationData: animation.export(),
        slangs: that.data.slangs,
      });

      setTimeout(function () {
        //创建动画   5s将位置移动到原位
        let animation2 = wx.createAnimation({
          duration: 500,
          // timingFunction: 'cubic-bezier(.8,.1,.2,0.8)',
        });
        animation2.translateX('-53%').translateY('-50%').rotate(0).step();
        that.setData({
          animationData: animation2.export()
        });
        that.setData({
          slider: false,
          nowPgae: that.data.nowPgae - 1
        });
      }, 50)
    }
  },

  onLoad: function () {
    let page = this
    console.log("favoritteeeeeeeeeeeeeeeeeee")
    wx.request({
      url: `${app.globalData.url}favorites`,
      method: 'GET',
      header: app.globalData.header,
      success: res => {
        page.setData({
          slangs: res.data.slangs
        })
      console.log(res.data)
      } 
    })
  },

  onPullDownRefresh: function () {

  }
})