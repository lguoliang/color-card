// pages/admin/prodMgt/prodMgt.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searching: false,
    searchValue: '',
    TabCur: 0,
    list: [],
    prod: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取类型列表
    await this.getTypeList()
  },
  searchChange (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  clearSearch () {
    this.setData({
      searching: false,
      searchValue: '',
      list: []
    })
    this.onPullDownRefresh()
  },
  searchConfirm (e) {
    wx.a.searchConfirm(e.detail.value).then(res => {
      this.setData({
        searching: true,
        prod: res.data
      })
    })
  },
  // 获取类型集合
  getTypeList: async function () {
    this.data.list.push({
      _id: 'new',
      name: '新品',
    })
    let list = await wx.a.getTypeList()
    this.setData({
      list: this.data.list.concat(list.result.data)
    })
    // 获取产品列表
    this.getProdsList({ type: 'new' })
  },

  // 类型切换
  tabSelect(e) {
    let set = e.currentTarget.dataset
    this.getProdsList({ type: set.id })
    this.setData({
      TabCur: set.idx
    })
  },

  // 获取产品
  getProdsList: async function (event) {
    wx.showLoading({title: '加载中'})
    let result = await wx.a.getProdsList(event)
    if (result.data) {
      wx.hideLoading()
      this.setData({
        prod: result.data
      })
    }
  },

  // 
  toDetail (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    await this.getTypeList()
    wx.stopPullDownRefresh();
  },

  onShareAppMessage: function () {
    return {
      // title: '随时随地，易起出行',
      // path: '/pages/homepage/index',
      imageUrl: 'https://picsum.photos/id/20/180/180'
    }
  }
})