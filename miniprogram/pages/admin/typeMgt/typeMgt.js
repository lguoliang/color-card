// pages/admin/typeMgt/typeMgt.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    typeList: [],
    isTypeModelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取类型列表
    await this.getTypeList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    // this.setData({
    //   typeList: []
    // })
    await this.getTypeList()
    wx.stopPullDownRefresh();
  },

  // 获取类型集合
  getTypeList: async function () {
    let list = await wx.a.getTypeList()
    console.log(list)
    this.setData({
      typeList: list.result.data
    })
  },
  
  // 新增弹窗显示
  handelTypeModal() {
    this.setData({
      isTypeModelShow: !this.data.isTypeModelShow
    })
  },

  // 保存类型
  formTypeSubmit: async function (e) {
    let self = this
    let name = e.detail.value.typeName
    if (name === '') {
      wx.u.toast('类型不能为空')
    } else if (!self.data.loading) {
      self.setData({ loading: true })
      wx.showLoading()
      let res = await wx.a.addBaseType(name)
      if (res.result) {
        wx.hideLoading()
        wx.showToast({title: '新增成功'})
        self.setData({
          loading: false,
          typeName: ''
        })
        self.handelTypeModal()
        self.onPullDownRefresh()
      } else {
        wx.hideLoading()
        self.setData({ loading: false })
        wx.u.toast('类型已存在')
      }
    }
  }
})