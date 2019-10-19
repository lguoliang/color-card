// pages/commodityadd/commodityadd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false,
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
  onLoad(options) {
    if (options.folder && options.coll) {
      console.log(options)
      const db = wx.cloud.database()
      db.collection(options.coll).where({
        folder: Number(options.folder)
      }).get().then(res => {
        console.log('folder', res)
        this.setData({
          isEdit: true,
          isNew: res.data[0].isNew,
          prodNum: res.data[0].num,
          prodDesc: res.data[0].desc,
          prodImg: res.data[0].img
        })
      })
    }
    this.getType(options.coll)
  },
  // 获取商品类型
  getType (coll) {
    const db = wx.cloud.database()
    db.collection('prodType').get().then(res => {
      res.data.forEach((value, index) => {
        this.data.typeSel.push(value.type)
        if (coll && value.coll === coll) {
          this.data.typeIndex = index
          this.data.prodType = value.type
        }
      })
      console.log('coll', coll)
      this.setData({
        typeList: res.data,
        typeSel: this.data.typeSel,
        typeIndex: this.data.typeIndex,
        prodType: this.data.prodType
      })
    })
  },
  // 是否新品
  switchChange (e) {
    this.setData({
      isNew: e.detail.value
    })
  },
  // 商品类型选择
  typeSel: function(e) {
    let self = this
    console.log(e.detail.value)
    console.log(self.data.typeList[e.detail.value].coll)
    self.setData({
      typeIndex: e.detail.value,
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
    console.log('handleProd', data)
    let len,
    self = this
    const db = wx.cloud.database()
    await db.collection('product').where({
      num: data.prodNum
    }).get().then(res => {
      console.log(res)
      len = res.data.length
    })
    if (len) {
      // 上传图片到云存储
      if (self.data.isEdit) {
        let folder = Number(self.data.options.folder)
        await db.collection('product').where({
          folder: folder
        }).get().then(res => {
          console.log('handleDelete', res)
        })
        self.imgUpload({
          folder: folder,
          img: data.prodImg,
          data: data
        })
      } else {
        wx.u.toast('产品已存在')
      }
    } else {
      //上传图片到云存储
      let folder = new Date().getTime()
      self.imgUpload({
        folder: folder,
        img: data.prodImg,
        data: data
      })
    }
  },
  imgUpload (event,fn) {
    wx.showLoading({ title: '上传中' })
    let self = this
    let promiseArr = []
    let imgList = []
    let folder = event.folder
    let data = event.data
    event.img.forEach((value, index) => {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = value
        let suffix = /\.\w+$/.exec(item)[0]
        let path = `${folder}/${index}${suffix}`
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
      console.log(folder)
      let prod = {
        folder: folder,
        isNew: data.isNew,
        coll: data.typeList[data.typeIndex].coll,
        type: data.typeList[data.typeIndex].type,
        num: data.prodNum,
        desc: data.prodDesc,
        img: imgList
      }
      if (data.isEdit) {
        self.editProd(prod)
      } else {
        self.addProd(prod)
      }
      // fn(imgList)
    })
  },
  async addProd (prod) {
    console.log('addProd', prod)
    wx.showLoading({ title: '创建中' })
    const db = wx.cloud.database()
    await db.collection('product').add({
      data: prod
    })
    if (prod.isNew) {
      await db.collection('hot').add({
        data: prod
      })
    }
    await db.collection(prod.coll).add({
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
  },
  async editProd (prod) {
    console.log(123123)
    wx.showLoading({ title: '修改中' })
  }
})