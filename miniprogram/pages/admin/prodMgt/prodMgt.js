// pages/admin/prodMgt/prodMgt.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    list: [],
    prod: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取类型列表
    await this.getTypeList()
  },

  // 获取类型集合
  getTypeList: async function () {
    this.data.list.push({
      name: '新品'
    })
    let list = await wx.a.getTypeList()
    this.setData({
      list: this.data.list.concat(list.result.data)
    })
  },

  // 类型切换
  tabSelect(e) {
    let dataset = e.currentTarget.dataset
    // this.getProd(dataset.coll)
    this.setData({
      TabCur: dataset.id
    })
  },

  // 新增
  toAdd () {
    wx.navigateTo({
      url: '../prodEdit/prodEdit'
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