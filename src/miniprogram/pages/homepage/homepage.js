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
      coll: 'hot'
    }],
    typeIndex: 0,
    typeProd: [],

    searching: false,
    searchList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getType()
  },
  // 获取类型
  getType: function () {
    const db = wx.cloud.database()
    db.collection('prodType').get().then(res => {
      console.log(res)
      this.getProd('hot')
      this.setData({
        typeList: this.data.typeList.concat(res.data)
      })
    })
  },
  // 获取产品数据
  getProd: function (coll) {
    const db = wx.cloud.database()
    db.collection(coll).get().then(res => {
      console.log(res)
      this.setData({
        typeProd: res.data
      })
    })
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
      inputShowed: false,
      searching: false
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
  searchConfirm () {
    console.log(this.data.inputVal)
    this.setData({
      searching: true,
      searchList: []
    })
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('product').where(_.or([{
      num:db.RegExp({
        regexp: this.data.inputVal,
        option:'i'
      })
    }, {
      desc:db.RegExp({
        regexp: this.data.inputVal,
        option:'i'
      })
    }])).get().then(res => {
      console.log('searchLIst', res)
      this.setData({
        searchList: res.data
      })
    })
  },
  // 类型切换
  changeType (e) {
    console.log(e.currentTarget.dataset.coll)
    let dataset = e.currentTarget.dataset
    this.getProd(dataset.coll)
    this.setData({
      typeIndex: dataset.index
    })
  },
  // 调整详情页
  toDetail: function (e) {
    console.log(e.currentTarget.dataset.num)
    wx.navigateTo({
      url: `/pages/cardDetail/cardDetail?num=${e.currentTarget.dataset.num}`
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})