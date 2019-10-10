const app = getApp()
// pages/commoditytype/commoditytype.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [{
      nav: '类型1'
    },{
      nav: '类型2'
    },{
      nav: '类型3'
    }],
    showpopup: false,
    editValue: ''
  },
  onShow: function () {
    let self = this
    self.getType();
    console.log(app.globalData)
    console.log(app.globalData.openid)
  },
  // 编辑
  editNav (e) {
    let self = this
    , idx = e.currentTarget.dataset.index
    self.operatePopup()
    self.setData({
      editValue: self.data.navList[idx].nav
    })
  },
  // 保存
  saveEdit (e) {
    let self = this
    self.operatePopup()
  },
  operatePopup () {
    this.setData({
      showpopup: !this.data.showpopup
    })
  },
  // 获取当前类型
  getType: function () {},
  addType: function () {
    const db = wx.cloud.database()
    db.collection('commodityType').add({
      data: {
        type: '类型1'
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