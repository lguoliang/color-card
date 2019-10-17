// pages/personal/personal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false
  },

  onLoad () {
    let self = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)
              this.setData({
                logged: true,
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
    // 获取openid
    console.log(app.globalData.openid)
    if(!app.globalData.openid){
      self.onGetOpenid();
    }
  },

  onGetUserInfo (e) {// 获取用户信息
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  // 获取用户openid
  onGetOpenid: function () {
    let self = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        self.setData({
          openid: res.result.openid
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  toManagement: function () {
    wx.navigateTo({
      url: '/pages/management/management',
    })
  },

  toAddress: function (e) {
    console.log(e.currentTarget.dataset.address)
    let url
    switch (e.currentTarget.dataset.address) {
      case 'management':// 后台管理
        url = '/pages/management/management'
        break
      case 'commodityadd':// 新增商品
        url = '../commodityadd/commodityadd'
        break
      case 'commoditytype':// 类型管理
        url = '../commoditytype/commoditytype'
        break
      case 'commoditytype':// 类型管理
        url = '../commoditytype/commoditytype'
        break
      case 'index':// 测试商城
        url = '../index/index'
        break
      default:
        url = null
    }
    wx.navigateTo({
      url: url
    })
  }
})