// pages/personal/personal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {}, // 用户信息
    logged: false, // 登录
    isAdmin: false // 权限
  },

  onLoad () {
    let self = this
    // 获取用户信息
    let userInfo = app.globalData.userInfo
    let openid = app.globalData.openid
    if (userInfo) {
      this.setData({
        avatarUrl: userInfo.avatarUrl,
        userInfo: userInfo,
        logged: true
      })
    } else {
      app.userInfoReadyCallback = res =>{
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          logged: true
        })
      }
    }
    // 权限判断
    if (openid) {
      setRoles(openid)
    } else {
      app.openIdReadyCallback = res => {
        setRoles(res)
      }
    }
    function setRoles (openid) {
      const db = wx.cloud.database()
      db.collection('user').where({
        _openid: openid
      }).get().then(res => {
        if (res.data[0].phone) {
          self.setData({
            isAdmin: true
          })
        }
      })
    }
  },

  onGetUserInfo (e) {
    if (!this.data.logged && e.detail.userInfo) {
      wx.s.createUser({
        userInfo: e.detail.userInfo,
        openid: app.globalData.openid
      })
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        logged: true
      })
    }
  },

  toAddress: function (e) {
    console.log(e.currentTarget.dataset.address)
    let url
    switch (e.currentTarget.dataset.address) {
      case 'commoditytype':// 类型管理
        url = '../commoditytype/commoditytype'
        break
      case 'commodityadd':// 新增管理
        url = '../commodityadd/commodityadd'
        break
      case 'commodityMgt':// 产品管理
        url = '/pages/commodityMgt/commodityMgt'
        break
      default:
        url = null
    }
    wx.navigateTo({
      url: url
    })
  }
})