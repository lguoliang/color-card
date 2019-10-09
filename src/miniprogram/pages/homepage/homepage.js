// pages/homepage/homepage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    if (app.globalData.userInfo) {
      console.log('asd', app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        logged: true
      })
    } else {
      app.userInfoReadyCallback = res =>{
        console.log(res)
        this.setData({
          userInfo: res,
          logged: true
        })
      }
    }
  },
  // 搜索
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})