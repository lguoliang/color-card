// pages/mallmanagement/mallmanagement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    managementItem: [{
      name: '新增商品',
      type: 'commodityadd'
    }, {
      name: 'banner',
      num: parseInt(Math.random()*10) + 1,
      type: 'mallbanner'
    },{
      name: '精品推荐',
      num: parseInt(Math.random()*10) + 1,
      type: 'mallrecommend'
    },{
      name: '未上架',
      num: parseInt(Math.random()*10) + 1,
      type: 'notonshelf'
    },{
      name: '上架中',
      num: parseInt(Math.random()*10) + 1,
      type: 'ontheshelf'
    },{
      name: '已下架',
      num: parseInt(Math.random()*10) + 1,
      type: 'offtheshelf'
    },{
      name: '草稿箱',
      num: parseInt(Math.random()*10) + 1,
      type: 'draftbox'
    },{
      name: '商品类型',
      num: parseInt(Math.random()*10) + 1,
      type: 'commoditytype'
    }]
  },

  toAddress (e) {
    let self = this
    , url
    switch (e.currentTarget.dataset.type) {
      case 'commodityadd':// 新增商品
        url = '../commodityadd/commodityadd'
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
      case 'commoditytype':// 商品类型
        url = '../commoditytype/commoditytype'
        break
      default:
        url = null
    }
    if (url) {
      wx.navigateTo({
        url: url
      })
    }
  }
})