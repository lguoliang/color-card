// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {}, // 用户信息
    showLogin: false, // 登录
    isAuthor: false // 权限
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let self = this;
    // 获取用户信息
    app.checkUserInfo(function (userInfo, isLogin) {
      console.log('asd', userInfo, isLogin)
      self.setData({
        showLogin: !isLogin,
        userInfo: userInfo
      })
    });
    await self.checkAuthor()
  },
  /**
   * 验证是否是管理员
   */
  checkAuthor: async function () {
    let self = this
    // 权限判断
    let openid = app.globalData.openid
    if (openid) {
      setRoles(openid)
    } else {
      app.openIdReadyCallback = res => {
        setRoles(res)
      }
    }
    function setRoles (openid) {
      wx.a.checkAuthor(openid).then(res => {
        if (res.data[0] && res.data[0].phone) {
          self.setData({
            isAuthor: true
          })
        }
      })
    }
  },
  /**
   * 返回
   */
  navigateBack: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },

  /**
   * 用户注册
   * @param {} e 
   */
  onGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      wx.a.createUser({
        userInfo: e.detail.userInfo,
        openid: app.globalData.openid
      })
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        showLogin: !this.data.showLogin
      })
    } else {
      wx.switchTab({
        url: '../index/index'
      })
    }
  },
  // 页面跳转
  toAddress: function (e) {
    let url
    switch (e.currentTarget.dataset.url) {
      case 'admin':// 后台管理
        url = '/pages/admin/index'
        break
      default:
        url = null
    }
    wx.navigateTo({
      url: url
    })
  }
})