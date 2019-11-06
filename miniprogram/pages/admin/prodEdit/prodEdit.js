// pages/admin/prodEdit/prodEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    max: 8,
    isShowModel: false,
    curProd: false,
    typeList: [],
    isShowTypeModel: false,
    typeShow: {},
    form: {
      code: '', // 编号
      desc: '', // 描述
      type: [], // 类型
      default: '', // 主图
      images: [], // 图片
      isShow: true, // 显示
      isHot: false, // 热门
      visits: 0,
      collection: 0,
      timestamp: new Date().getTime(),
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getTypeList()
    if (options.id) {
      wx.setNavigationBarTitle({
        title: '编辑产品'
      })
      wx.showLoading({title: '加载中'})
      wx.a.getProdById(options.id).then(res => {
        wx.hideLoading()
        // res.data.images = []
        this.setData({
          form: res.data,
          curProd: res.data,
          max: this.data.max - res.data.images.length
        })
      })
    } else {
      wx.setNavigationBarTitle({
        title: '新增产品'
      })
    }
  },
  // 获取类型集合
  getTypeList: async function () {
    let list = await wx.a.getTypeList()
    list.result.data.forEach((value) => {
      this.data.typeShow[value._id] = value.name
    })
    this.setData({
      typeShow: this.data.typeShow,
      typeList: this.data.typeList.concat(list.result.data)
    })
  },
  // 数据双向绑定
  handleForm (e) {
    console.log()
    let name = e.currentTarget.dataset.name
    this.data.form[name] = e.detail.value
    this.setData({
      form: this.data.form
    })
  },
  // 类型选择
  async handleTypeModel (e) {
    // this.data.form.type
    console.log('type', e.currentTarget.dataset.type)
    this.setData({
      isShowTypeModel: !this.data.isShowTypeModel,
    })
    let type = e.currentTarget.dataset.type || []
    if (type.length > 1) {
      this.data.typeList.forEach((value) => {
        value.checked = type.indexOf(value._id) === -1 ? false : true
      })
      console.log(this.data.typeList)
      this.setData({
        typeList: this.data.typeList
      })
    }
  },
  typeSel (e) {
    let idx = e.currentTarget.dataset.idx
    this.data.typeList[idx].checked = !this.data.typeList[idx].checked
    this.setData({
      typeList: this.data.typeList
    })
  },
  typeChange (e) {
    let type = []
    this.data.typeList.forEach((value) => {
      console.log(value)
      if (value.checked) {
        type.push(value._id)
      }
    })
    this.setData({
      'form.type': type,
      isShowTypeModel: !this.data.isShowTypeModel
    })
  },
  // 图片选择
  ChooseImage() {
    let img = this.data.form.images
    let self = this
    wx.chooseImage({
      count: this.data.max, //默认9
      success: (res) => {
        this.setData({
          'form.images': img.concat(res.tempFilePaths),
          max: self.data.max - res.tempFilePaths.length
        })
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.form.images,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    this.data.form.images.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      'form.images': this.data.form.images,
      max: this.data.max + 1
    })
  },
  // 清空
  clearAll (check = true) {
    let self = this
    if (check) {
      wx.showModal({
        title: '提示',
        content: '确定要清空吗？',
        success: res => {
          if (res.confirm) {
            clearForm()
          }
        }
      })
    } else {
      clearForm()
    }
    function clearForm () {
      self.setData({
        'form.code': '',
        'form.desc': '',
        'form.type': [],
        'form.images': [],
        'form.isShow': true,
        'form.isHot': false,
        max: 8
      })
    }
  },
  // 保存
  async saveProd () {
    let form = this.data.form
    if (!form.code) {
      wx.u.toast('编号不能为空')
    } else if (!form.type.length) {
      wx.u.toast('类型不能为空')
    } else if (!form.images.length) {
      wx.u.toast('请上传图片')
    } else {
      this.handleProd(form)
    }
  },
  async handleProd (form) {
    let self = this
    if (this.data.curProd) {
      // 编辑
      if (form.code !== this.data.curProd.code) {
        console.log('编辑1')
        const db = wx.cloud.database()
        let prod = await db.collection('coll_prod').where({
          code: form.code
        }).get()
        if (prod.data.length) {
          wx.u.toast('产品已存在')
        } else {
          await wx.cloud.deleteFile({
            fileList: self.data.curProd.images
          })
          this.imgUpload({
            code: form.code, // 编号
            desc: form.desc, // 描述
            type: form.type, // 类型
            images: form.images, // 图片
            isShow: form.isShow, // 显示
            isHot: form.isHot, // 热门
            createTime: form.createTime,
            timestamp: new Date().getTime()
          }, form._id)
        }
      } else {
        console.log('编辑2')
        await wx.cloud.deleteFile({
          fileList: self.data.curProd.images
        })
        this.imgUpload({
          code: form.code, // 编号
          desc: form.desc, // 描述
          type: form.type, // 类型
          images: form.images, // 图片
          isShow: form.isShow, // 显示
          isHot: form.isHot, // 热门
          createTime: form.createTime,
          timestamp: new Date().getTime()
        }, form._id)
      }
    } else {
      // 新增
      const db = wx.cloud.database()
      let prod = await db.collection('coll_prod').where({
        code: form.code
      }).get()

      if (prod.data.length) {
        wx.u.toast('产品已存在')
      } else {
        form.createTime = new Date().getTime(),
        form.totalVisits = 200 + Math.floor(Math.random() * 30), // 访问数
        form.totalCollection = 10 + Math.floor(Math.random() * 30) // 收藏数
        this.imgUpload(form)
      }
    }
  },
  async imgUpload (event, prodId) {
    wx.showLoading({ title: '上传中' })
    let promiseArr = []
    let imgList = []
    event.images.forEach((value, index) => {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = value
        let suffix = /\.\w+$/.exec(item)[0]
        let path = `${event.createTime}/${index}${suffix}`
        wx.cloud.uploadFile({
          cloudPath: path,
          filePath: item
        }).then(res => {
          imgList[index] = res.fileID
          reslove()
          wx.hideLoading();
          wx.showToast({ title: "上传成功" })
        }).catch(error => {
          wx.hideLoading();
          wx.showToast({ title: "上传失败" })
        })
      }))
    })
    Promise.all(promiseArr).then(async (res) => {
      wx.hideLoading();
      wx.showToast({ title: "上传完毕" })
      wx.showLoading({ title: '创建中' })
      event.images = imgList
      let result = await wx.a.upsertProd(prodId === undefined ? "" : prodId, event)
      console.log(result)
      if (result.result) {
        wx.hideLoading()
        this.clearAll(false)
        this.handleShowModal()
      } else {
        wx.hideLoading()
        wx.showToast({ title: "创建失败" })
      }
    })
  },
  handleShowModal () {
    this.setData({
      isShowModel: !this.data.isShowModel
    })
  },
  toBack () {
    wx.navigateBack({
      delta: 1
    })
  }
})