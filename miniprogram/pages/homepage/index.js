//index.js
const app = getApp()

Page({
  data: {
    TabCur: 0,
    list: [{
      name: '新品',
      coll: 'hot'
    }],
    prod: []
  },
  onLoad() {
    this.getType()
  },
  tabSelect(e) {
    let dataset = e.currentTarget.dataset
    this.getProd(dataset.coll)
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
  },
  VerticalMain(e) {
    console.log(e)
  },
  // 获取类型
  getType: function () {
    wx.u.getdata({
      coll: 'prodtype'
    }).then(res => {
      console.log('getType', res)
      this.getProd('hot')
      this.setData({
        list: this.data.list.concat(res.result.data)
      })
    })
  },
  // 获取产品数据
  getProd: function (coll) {
    wx.showLoading()
    wx.u.getdata({
      coll: 'product',
      filter: coll === 'hot' ? { isNew: true } : {
        type: coll
      }
    }).then(res => {
      console.log('getProd', res)
      wx.hideLoading()
      this.setData({
        prod: res.result.data
      })
    })
  },
  // 跳转详情页
  toDetail: function (e) {
    wx.navigateTo({
      url: `/pages/detail/detail?id=${e.currentTarget.dataset.num}`
    })
  }
})
