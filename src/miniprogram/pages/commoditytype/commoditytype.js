const app = getApp()
// pages/commoditytype/commoditytype.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeName: '',
    typeColl: '',
    typeList: null,
    showpopup: false,
    editValue: '',
    curIndex: 0
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
  // 获取当前类型
  getType: function () {
    wx.cloud.callFunction({
      name: 'getProdType'
    }).then(res => {
      this.setData({
        typeList: res.result.data
      })
      console.log('resasd', res.result.data)
    })
  },
  // 新增类型
  async addType () {
    console.log(123)
    let self = this
    if (!this.data.typeName || !this.data.typeColl) {
      wx.showToast({title: '类型不能为空', icon: 'none'})
    } else {
      const db = wx.cloud.database()
      const coll = db.collection('prodType')
      let typeName = this.data.typeName
      let typeColl = this.data.typeColl
      wx.showLoading({title: '加载中…'})
      coll.where({
        type: typeName
      }).get().then(res => {
        if (!res.data.length) {
          wx.cloud.callFunction({
            name: 'createColl',
            data: {
              coll: typeColl
            },
            success (result) {
              console.log("成功", result)
              coll.add({
                data: {
                  type: typeName,
                  coll: typeColl
                }
              }).then(res => {
                wx.hideLoading()
                wx.showToast({title: '新增成功'})
                self.getType()
              })
            },
            fail(result) {
              wx.hideLoading()
              wx.showToast({title: '数据集已存在', icon: 'none'})
            }
          })
        } else {
          wx.showToast({title: '类型已存在', icon: 'none'})
        }
      })
    }
  },
  // 删除
  async removeType (e) {
    wx.showLoading()
    const db = wx.cloud.database()
    const coll = db.collection('prodType')
    let typeId;
    await coll.where({coll: e.currentTarget.dataset.coll}).get().then(res => {
      typeId = res.data[0]._id
    })
    coll.doc(typeId).remove().then(res => {
      wx.hideLoading()
      wx.showToast({title: '删除成功'})
      this.getType()
    })
  },
  // 编辑
  editNav (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      curIndex: index,
      editValue: this.data.typeList[index].type
    })
    this.operatePopup()
  },
  // 保存
  saveEdit (e) {
    let self = this
    , value = this.data.editValue
    , _id = this.data.typeList[this.data.curIndex]._id
    if (value === '') {
      wx.showToast({title: '类型不能为空', icon: 'none'})
    } else {
      wx.showLoading()
      const db = wx.cloud.database()
      const coll = db.collection('prodType')
      coll.doc(_id).update({
        data: {
          type: value
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({title: '编辑成功'})
        self.getType()
        self.operatePopup()
      })
    }
  },
  operatePopup () {
    this.setData({
      showpopup: !this.data.showpopup
    })
  }
})