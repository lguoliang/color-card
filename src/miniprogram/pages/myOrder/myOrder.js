// pages/myOrder/myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [{
      url: '20',
      title: 'CCAI 2019 中国人工智能大会',
      price: '168'
    },{
      url: '30',
      title: '力哥聊运维与云计算',
      price: '718'
    },{
      url: '40',
      title: '大数据广告实战入门',
      price: '883'
    }]
  },

  toDetail: function () {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})