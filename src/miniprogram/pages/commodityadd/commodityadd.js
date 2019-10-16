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
    max: 8
  },
  onShow: function () {
    let self = this
    // self.getAticle()
  },
  // 商品类型选择
  typeSel: function(e) {
    let self = this
    self.setData({
      typeindex: e.detail.value,
      typeValue: self.data.typeList[e.detail.value]
    })
  },
  // 上传图片
  uploadImg: function () {
    let self = this
    wx.chooseImage({
      count: self.data.max,
      success (res) {
        console.log(self.data.max - res.tempFilePaths.length)
        console.log('tempFilePaths', res.tempFilePaths)
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
  saveEvent: function () {
    // const db = wx.cloud.database()
    // console.log(db)
    // db.collection('article').add({
    //   data: {}
    // })
    let imgList = this.data.imgList
    if (!imgList.length) {
      wx.showToast({ title: '请上传图片', icon: 'none' })
    } else {
      //上传图片到云存储
      wx.showLoading({ title: '上传中' })
      let promiseArr = []
      imgList.forEach((value, index) => {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = value
          let suffix = /\.\w+$/.exec(item)[0]
          console.log(suffix)
          wx.cloud.uploadFile({
            cloudPath: `003/${index}${suffix}`,
            filePath: item
          }).then(res => {
            console.log(res)
            // reslove()
            wx.hideLoading();
            wx.showToast({ title: "上传成功" })
          }).catch(error => {
            wx.hideLoading();
            wx.showToast({ title: "上传失败" })
          })
        }))
      })
      Promise.all(promiseArr).then(res => {
        console.log("图片上传完成后再执行")
      })
    }
  }
})