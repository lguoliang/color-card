// pages/typeMgt/typeMgt.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    typeList: null
  },

  onLoad: function (options) {
    this.queryType()
  },

  handelType: function (e) {
    // console.log(e.detail.value)
    this.setData({
      type: e.detail.value
    })
  },

  addType: function () {
    console.log('type', this.data.type)
    if (this.data.type) {
      const db = wx.cloud.database()
      const coll = db.collection('clothType')
      coll.where({
        type: this.data.type
      }).get({
        success: res => {
          console.log('asd', res)
          if (!res.data.length) {
            console.log('添加')
            coll.add({
              data: {
                type: this.data.type
              },
              success: res => {
                this.queryType()
              }
            })
          } else {
            console.log('已存在')
          }
        }
      })
    } else {
      wx.showToast({title: '类型不能为空', icon: 'none'})
    }
  },
  queryType: function () {
    const db = wx.cloud.database()
    db.collection('clothType').get({
      success: res => {
        console.log('asd', res)
        this.setData({
          typeList: res.data
        })
      }
    })
  },
  removeType: function (e) {
    const db = wx.cloud.database()
    // console.log(e.currentTarget.dataset.id)
    db.collection('clothType').doc(e.currentTarget.dataset.id).remove({
      success: res => {
        console.log('删除成功', res)
        this.queryType()
      }
    })
  }
})