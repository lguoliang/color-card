// pages/homepage/homepage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloudimg: wx.c.cloudimg,
    inputShowed: false,
    inputVal: "",
    typeList: [{
      type: '新品',
      coll: 'new'
    }],
    typeIndex: 0,
    typeProd: []
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
    this.getType()
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
  // 
  changeType (e) {
    console.log(e.currentTarget.dataset.coll)
    let dataset = e.currentTarget.dataset
    this.getProd(dataset.coll)
    this.setData({
      typeIndex: dataset.index
    })
  },
  // 
  toDetail: function (e) {
    console.log(e.currentTarget.dataset.num)
    wx.navigateTo({
      url: `/pages/cardDetail/cardDetail?num=${e.currentTarget.dataset.num}`
    })
  },
  getType: function () {
    wx.cloud.callFunction ({
      name: 'getProdType'
    }).then(res => {
      console.log(res)
      this.getProd('new')
      this.setData({
        typeList: this.data.typeList.concat(res.result.data)
      })
    })
  },
  getProd: function (coll) {
    const db = wx.cloud.database()
    db.collection(coll).get().then(res => {
      console.log(res)
      this.setData({
        typeProd: res.data
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})