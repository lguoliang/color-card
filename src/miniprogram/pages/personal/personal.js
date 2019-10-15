// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png'
  },

  toManagement: function () {
    wx.navigateTo({
      url: '/pages/management/management',
    })
  },

  toAddress: function (e) {
    console.log(e.currentTarget.dataset.address)
    let url
    switch (e.currentTarget.dataset.address) {
      case 'management':// 后台管理
        url = '/pages/management/management'
        break
      case 'commodityadd':// 新增商品
        url = '../commodityadd/commodityadd'
        break
      case 'commoditytype':// 类型管理
        url = '../commoditytype/commoditytype'
        break
      case 'mallbanner':// banner
        url = '../mallrecommend/mallrecommend?type=' + e.currentTarget.dataset.type
        break
      case 'mallrecommend':// 精品推荐
        url = '../mallrecommend/mallrecommend?type=' + e.currentTarget.dataset.type
        break
      case 'notonshelf':// 未上架
        url = '../commoditylist/commoditylist?type=' + e.currentTarget.dataset.type
        break
      case 'ontheshelf':// 上架中
        url = '../commoditylist/commoditylist?type=' + e.currentTarget.dataset.type
        break
      case 'offtheshelf':// 已下架
        url = '../commoditylist/commoditylist?type=' + e.currentTarget.dataset.type
        break
      case 'draftbox':// 草稿箱
        url = '../commoditylist/commoditylist?type=' + e.currentTarget.dataset.type
        break
      case 'commoditytype':// 类型管理
        url = '../commoditytype/commoditytype'
        break
      case 'index':// 测试商城
        url = '../index/index'
        break
      default:
        url = null
    }
    wx.navigateTo({
      url: url
    })
  }
})