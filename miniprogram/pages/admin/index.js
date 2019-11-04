// pages/admin/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 页面跳转
  toAddress: function (e) {
    let url
    switch (e.currentTarget.dataset.url) {
      case 'prodMgt':// 产品管理
        url = '/pages/admin/prodMgt/prodMgt'
        break
      case 'typeMgt':// 类型管理
        url = '/pages/admin/typeMgt/typeMgt'
        break
      default:
        url = null
    }
    wx.navigateTo({
      url: url
    })
  }
})