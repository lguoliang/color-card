// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene: null,
    detail: null,

    image: '',
    wxacodeSrc: '',
    wxacodeResult: '',
    showClearWXACodeCache: false
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
    } else if (options.id) {
      console.log('options.id', options.id)
      wx.setNavigationBarTitle({
        title: options.id
      })
      self.getProdDetail(options.id)
    }
  },
  onShow: function () {
    let self = this
    wx.cloud.callFunction({
      name: 'getwxacode',
      data: {
        // page: 'pages/spikeZone/spikeZone',
        page: 'pages/productDetail/productDetail',
        scene: "pdid=123"
      },
      success (result) {
        // wx.showToast({title: '推送成功'})
        console.log("成功123", result)
        self.setData({
          // image: 'http://placehold.jp/150x160.png'
          image: result.result.wxacodefileID
        })
      },
      fail(result) {
        console.log("失败", result)
      }
    })
  },
  // 获取产品详情
  getProdDetail(event) {
    const db = wx.cloud.database()
      db.collection('coll_prod').where({
        code: event
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
      urls: self.data.detail.images,
      current: url
    })
  },

  async onGetWXACode() {
    let addReult = await wx.a.addPostQrCode('test123')
    console.log('addReult', addReult)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})