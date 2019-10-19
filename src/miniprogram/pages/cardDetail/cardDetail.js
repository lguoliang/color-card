// pages/cardDetail/cardDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene: null,
    prodDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      this.setData({
        scene: JSON.stringify(scene)
      })
      var arrPara = scene.split("&");
      var arr = [];
      for (var i in arrPara) {
        arr = arrPara[i].split("=");
        // wx.setStorageSync(arr[0],arr[1]);
        console.log("setStorageSync:",arr[0],"=",arr[1]);
      }
      // self.getProdDetail(options.num)
    } else {
      this.setData({
        scene: "no scene"
      })
      self.getProdDetail(options.num)
    }
  },

  getProdDetail(event) {
    const db = wx.cloud.database()
      db.collection('product').where({
        num: event
      }).get().then(res => {
        console.log('product', res)
        this.setData({
          prodDetail: res.data[0]
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