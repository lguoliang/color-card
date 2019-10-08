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
            }
          })
        } else {
          console.log('已存在')
        }
      }
    })
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
  }
})