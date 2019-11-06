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
  // onLoad: async function (options) {
  //   // 获取类型列表
  //   await this.getTypeList()
  // },
  onShow: async function () {
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
      searchValue: ''
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
    this.data.list = []
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

  // 新增
  toAdd () {
    wx.navigateTo({
      url: '../prodEdit/prodEdit'
    })
  },

  // 删除
  toDelete (e) {
    let self = this
    let data = this.data
    let prod = e.currentTarget.dataset.prod
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({title: '删除中'})
          await wx.cloud.deleteFile({
            fileList: prod.images
          })
          let result = await wx.a.deleteProdById(prod._id)
          if (result.result) {
            self.getProdsList({ type: data.list[data.TabCur]._id })
            await wx.showToast({title: '删除成功'})
          }
        }
      }
    })
  },

  // 编辑
  toEdit (e) {
    let prod = e.currentTarget.dataset.prod
    wx.navigateTo({
      url: `../prodEdit/prodEdit?id=${prod._id}`
    })
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
  }
})