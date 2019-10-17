// pages/commodityadd/commodityadd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeSel: [],
    typeList: [],
    isNew: false,
    typeIndex: 0,
    prodType: '', // 类型
    prodNum: '', // 编号
    prodDesc: '', // 简介
    prodImg: [], // 图片上传
    max: 8
  },
  onLoad() {
    this.getType()
  },
  getType () {
    wx.cloud.callFunction ({
      name: 'getProdType'
    }).then(res => {
      res.result.data.forEach(value => {
        this.data.typeSel.push(value.type)
      })
      this.setData({
        typeList: res.result.data,
        typeSel: this.data.typeSel
      })
    })
  },
  // 是否新平
  switchChange (e) {
    this.setData({
      isNew: e.detail.value
    })
  },
  // 商品类型选择
  typeSel: function(e) {
    let self = this
    console.log(self.data.typeList[e.detail.value].coll)
    self.setData({
      typeindex: e.detail.value,
      prodType: self.data.typeList[e.detail.value].coll
    })
  },
  // 输入改变
  inputChange (e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },
  // 上传图片
  uploadImg: function () {
    let self = this
    wx.chooseImage({
      count: self.data.max,
      success (res) {
        // console.log(self.data.max - res.tempFilePaths.length)
        // console.log('tempFilePaths', res.tempFilePaths)
        self.setData({
          max: self.data.max - res.tempFilePaths.length,
          prodImg: self.data.prodImg.concat(res.tempFilePaths)
        })
      }
    })
  },
  // 删除图片
  deleteImg: function (e) {
    let self = this
    let idx = e.currentTarget.dataset.index
    let newList = self.data.prodImg.filter(function(item, index) {
      if (index !== idx) {
        return item
      }
    })
    self.setData({
      prodImg: newList,
      max: self.data.max + 1
    })
  },
  // 查看图片
  previewImg: function (e) {
    let self = this
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: self.data.prodImg,
      current: url
    })
  },
  saveEvent: function () {
    if (!this.data.prodType) {
      wx.u.toast('商品类型不能为空')
    } else if (!this.data.prodNum) {
      wx.u.toast('商品编号不能为空')
    // } else if (/[\u4E00-\u9FA5]/g.test(this.data.prodNum)) {
    //   wx.u.toast('商品编号不能含中文')
    // } else if (!this.data.prodDesc) {
    //   wx.u.toast('商品简介不能为空')
    } else if (!this.data.prodImg.length) {
      wx.u.toast('请上传图片')
    } else {
      this.handleProd(this.data)
    }
  },
  async handleProd (data) {
    console.log(data)
    let len
    const db = wx.cloud.database()
    await db.collection('product').where({
      prodNum: data.prodNum
    }).get().then(res => {
      console.log(res)
      len = res.data.length
    })
    if (len) {
      wx.u.toast('产品已存在')
    } else {
      //上传图片到云存储
      wx.showLoading({ title: '上传中' })
      let promiseArr = []
      let imgList = []
      data.prodImg.forEach((value, index) => {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = value
          let suffix = /\.\w+$/.exec(item)[0]
          let path = `${data.prodNum}/${index}${suffix}`
          wx.cloud.uploadFile({
            cloudPath: path,
            filePath: item
          }).then(res => {
            console.log(res)
            imgList.push(res.fileID)
            reslove()
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
        console.log(imgList)
        let prod = {
          isNew: data.isNew,
          prodType: data.prodType,
          prodNum: data.prodNum,
          prodDesc: data.prodDesc,
          prodImg: imgList
        }
        this.addProd(prod)
      })
    }
  },
  async addProd (prod) {
    wx.showLoading({ title: '创建中' })
    const db = wx.cloud.database()
    await db.collection('product').add({
      data: prod
    })
    if (prod.isNew) {
      await db.collection('new').add({
        data: prod
      })
    }
    await db.collection(prod.prodType).add({
      data: prod
    }).then(res => {
      wx.hideLoading();
      wx.showToast({ title: "创建成功" })
      this.setData({
        isNew: false,
        typeIndex: 0,
        prodType: '', // 类型
        prodNum: '', // 编号
        prodDesc: '', // 简介
        prodImg: [], // 图片上传
        max: 8
      })
    })
  }
})