//index.js
const app = getApp()

Page({
  data: {
    prodList: [{
      url: '20',
      title: 'CCAI 2019 中国人工智能大会',
      desc: '汇聚各路科技精英，解读人工智能、云计算、量子计算、信息安全、区块链等前沿科技，理解相关行业应用，IBM超in播，带您一起用科技认知现在，触摸未来。',
      price: '575',
      sharePrc: '53.6'
    },{
      url: '30',
      title: '李开复讲人工智能｜AI•未来End',
      desc: '乐为教练，专注互联网微营销多年，研究微商的运作困惑，不断尝试寻找突破的方法，总结出一套互联网微营销创业的最佳方法，欢迎交流咨询微信xing1070549954验证微营销学习',
      price: '858',
      sharePrc: '84.6'
    },{
      url: '40',
      title: '力哥聊运维与云计算',
      desc: '《人工智能》一书由腾讯一流团队与工信部高端智库倾力创作。本书从人工智能这一颠覆性技术的前世今生说起，对人工智能产业全貌、最新进展、发展趋势进行了清晰的梳理，对各国的竞争态势做了深入研究，还对人工智能给个人、企业、社会带来的机遇与挑战进行了深入分析。对于想全面了解人工智能的读者，本书提供了重要参考，是一本必备书籍。',
      price: '953',
      sharePrc: '92.9'
    },{
      url: '50',
      title: 'IBM超in播',
      desc: '人工智能全球发展、AI资讯、人工智能最新科技新闻、人工智能最新应用场景',
      price: '937',
      sharePrc: '65.8'
    }], // 产品列表
    navbar: ['选项一', '选项二', '选项三'],
    currentTab: 0,// 当前产品块
    swiperH: [],// 每块产品列表的高度
    minSwiperH: 0,// 产品列表最低高度
  },
  onShow: function () {
    this.setSwiperHeight()
  },
  prodChange: function (e) {
    console.log(123)
    let self = this
    self.setData({ 
      currentTab: e.detail.current
    });
  },
  selectTab (e) {
    let self = this
    if (self.data.currentTab !== e.currentTarget.dataset.current) {
      self.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  // 设置产品列高度
  setSwiperHeight () {
    let self = this
    let systemInfo= wx.getSystemInfoSync();
    wx.createSelectorQuery().selectAll('.prod-list').boundingClientRect(function (rect) {
      let swiperH = []
      rect.forEach(function (value) {
        swiperH.push(value.height);
      })
      self.setData({
        swiperH: swiperH,
        minSwiperH: systemInfo.windowHeight - 50
      })
    }).exec()
  },
  toDetail () {
    wx.navigateTo({
      url: '/pages/prodDetail/prodDetail'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
