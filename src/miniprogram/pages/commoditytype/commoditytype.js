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
    curIndex: 0,
    loading: false
  },
  onShow: function () {
    let self = this
    self.getType();
  },
  // 获取当前类型
  getType: function () {
    const db = wx.cloud.database()
    wx.showLoading()
    db.collection('prodType').get().then(res => {
      console.log('获取产品类型', res.data)
      wx.hideLoading()
      this.setData({
        typeList: res.data,
        typeName: '',
        typeColl: ''
      })
    })
  },
  // 输入控制
  handleChange: function (e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },
  // 新增类型
  async addType () {
    let self = this
    if (!this.data.typeName || !this.data.typeColl) {
      wx.u.toast('类型不能为空')
    } else {
      wx.showLoading({title: '加载中…'})
      const db = wx.cloud.database()
      const coll = db.collection('prodType')
      let typeName = this.data.typeName
      let typeColl = this.data.typeColl
      // 查询类型
      let queryType = await coll.where({
        type: typeName
      }).get()
      if (!queryType.data.length) {
        this.setData({
          loading: true
        })
        if (this.data.loading) {
          // 创建集合
          wx.cloud.callFunction({
            name: 'createColl',
            data: {
              coll: typeColl
            },
            success (res) {
              coll.add({
                data: {
                  type: typeName,
                  coll: typeColl
                }
              }).then(res => {
                wx.hideLoading()
                self.getType()
                self.setData({
                  loading: true
                })
                wx.showToast({title: '新增成功'})
              })
            },
            fail (err) {
              wx.hideLoading()
              wx.u.toast('数据集已存在')
              self.setData({
                loading: true
              })
            }
          })
        }
      } else {
        wx.hideLoading()
        wx.u.toast('类型已存在')
      }
    }
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
      wx.u.toast('类型不能为空')
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