const app = getApp()
// pages/commoditytype/commoditytype.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeName: '',
    typeColl: '',
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
  handleChange: function (e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
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
  getType: function () {
    wx.cloud.callFunction({
      name: 'getProdType',
      success: res => {
        console.log('res', res)
      }
    })
  },
  // 新增类型
  async addType () {
    if (!this.data.typeName || !this.data.typeColl) {
      wx.showToast({title: '类型不能为空', icon: 'none'})
    } else {
      console.log(this.data.typeName)
      console.log(this.data.typeColl)
      const db = wx.cloud.database()
      const coll = db.collection('prodType')
      let checktype
      await coll.where({
        type: this.data.typeName
      }).get().then(res => {
        checktype = res.data.length
      })
      if (!checktype) {
        try {
          await wx.cloud.callFunction({
            name: 'createColl',
            data: {
              coll: this.data.typeColl
            }
          })
        } catch (e) {
          // console.log('e', e)
        }
        coll.add({
          data: {
            type: this.data.typeName,
            coll: this.data.typeColl
          },
          success: res => {
            // this.queryType()
            console.log('添加')
          }
        })        
      } else {
        console.log('已存在')
      }
    }
  }
})