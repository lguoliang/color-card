// pages/admin/prodEdit/prodEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    typeList: [],
    isShowTypeModel: false,
    form: {
      code: '', // 编号
      desc: '', // 描述
      type: [], // 类型
      default: '', // 主图
      images: [], // 图片
      isShow: 0, // 显示
      isHot: 0, // 热门
      timestamp: new Date().getTime(),
      totalVisits: 200 + Math.floor(Math.random() * 30), // 访问数
      totalCollection: 10 + Math.floor(Math.random() * 30) // 收藏数
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getTypeList()
  },
  formClassifySubmit () {},
  // 获取类型集合
  getTypeList: async function () {
    let list = await wx.a.getTypeList()
    this.setData({
      typeList: this.data.typeList.concat(list.result.data)
    })
  },
  // 输入双向绑定
  handleInput (e) {
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
    wx.chooseImage({
      count: 4, //默认9
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  // 保存
  async saveProd () {
    console.log(this.data.form)
  }
})