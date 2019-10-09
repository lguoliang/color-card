// pages/cardDetail/cardDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardId: null,
    image: 'http://placehold.jp/150x150.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene)
    console.log(options)
    // var query = options.query.dentistId
    // console.log(query)
    const self = this
    wx.u.http({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      data: {
        grant_type: 'client_credential',
        appid: 'wxac37d86aac5cf502',
        secret: 'f720d101125629ee94482c6b8a6b0672'
      }
    }).then(res => {
      console.log(res)
      wx.u.http({
        url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${res.data.access_token}`,
        method: 'post',
        data: { "scene":"pdid=123" }
      }).then(result => {
        console.log('result', result)
        // wx.arrayBufferToBase64(result.data)
        // self.setData({
        //   // image: 'http://placehold.jp/150x160.png'
        //   image: `data:image/jpeg;base64${result.data}`
        // })
      })
    })
    wx.cloud.callFunction({
      name: 'getwxacode',
      data: {
        "scene":"pdid=123"
      },
      success (result) {
        // wx.showToast({title: '推送成功'})
        console.log("成功", result)
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})