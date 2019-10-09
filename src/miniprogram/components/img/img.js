// components/img/img.js
Component({
  externalClasses: ['c-class'],
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    src: String,
    mode: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    imghost: wx.c.imghost
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
