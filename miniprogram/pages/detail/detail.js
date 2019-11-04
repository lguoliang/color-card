// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene: null,
    detail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      wx.setNavigationBarTitle({
        title: scene.id
      })
      self.getProdDetail(scene.id)
    } else {
      console.log(options.id)
      wx.setNavigationBarTitle({
        title: options.id
      })
      self.getProdDetail(options.id)
    }
  },
  // 获取产品详情
  getProdDetail(event) {
    const db = wx.cloud.database()
      db.collection('product').where({
        num: event
      }).get().then(res => {
        console.log('product', res)
        this.setData({
          detail: res.data[0]
        })
      })
  },

  // 查看图片
  previewImg: function (e) {
    let self = this
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: self.data.prodDetail.img,
      current: url
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})