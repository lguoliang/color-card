// pages/commodityadd/commodityadd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: ['类型一', '类型二', '类型三', '类型四'],
    typeIndex: 0,
    typeValue: null,
    imgList: [],
    max: 8,
    exchangeMode: '积分兑换',
    exchangeList: ['积分兑换', '人民币兑换', '积分/人民币'],
    exchangeIndex: 0
  },
  onShow: function () {
    let self = this
    self.getAticle()
  },
  // 商品类型选择
  typeSel: function(e) {
    let self = this
    self.setData({
      typeindex: e.detail.value,
      typeValue: self.data.typeList[e.detail.value]
    })
  },
  // 兑换方式选择
  exchangeSel: function (e) {
    let self = this
    console.log(e.detail.value)
    self.setData({
      exchangeIndex: e.detail.value,
      exchangeMode: self.data.exchangeList[e.detail.value]
    })
  },
  // 上传图片
  uploadImg: function () {
    let self = this
    wx.chooseImage({
      count: self.data.max,
      success (res) {
        console.log(self.data.max - res.tempFilePaths.length)
        self.setData({
          max: self.data.max - res.tempFilePaths.length,
          imgList: self.data.imgList.concat(res.tempFilePaths)
        })
      }
    })
  },
  // 删除图片
  deleteImg: function (e) {
    let self = this
    let idx = e.currentTarget.dataset.index
    let newList = self.data.imgList.filter(function(item, index) {
      if (index !== idx) {
        return item
      }
    })
    self.setData({
      imgList: newList,
      max: self.data.max + 1
    })
  },
  // 查看图片
  previewImg: function (e) {
    let self = this
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: self.data.imgList,
      current: url
    })
  },
  getAticle: function () {
    const db = wx.cloud.database()
    db.collection('article').get({
      success: res => {
        console.log(res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  saveEvent: function () {
    const db = wx.cloud.database()
    console.log(db)
    db.collection('article').add({
      data: {
        name: '文章作者',
        title: '评论题目',
        content: '评论内容',
        md: 'markdown',
        moment: '发表时间',
        comments: '文章评论数',
        pv: '浏览量',
        avator: '用户头像'
      },
      success: res => {
        console.log(res)
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  }
})