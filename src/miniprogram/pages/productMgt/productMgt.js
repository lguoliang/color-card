// pages/productMgt/productMgt.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeData: null,
    typeList: [],
    typeIndex: 0,

    cardNum: '',
    cardInfo: '',
    cardImg: ''
    
  },

  onLoad: function () {
    this.queryType()
  },

  typeChange: function(e) {
    console.log(e)
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      typeIndex: e.detail.value
    })
  },

  queryType: function () {
    const db = wx.cloud.database()
    db.collection('clothType').get({
      success: res => {
        console.log('asd', res)
        res.data.forEach(value => {
          console.log(value)
          this.data.typeList.push(value.type)
        })
        console.log('res.data', res.data)
        this.setData({
          typeData: res.data,
          typeList: this.data.typeList
        })
      }
    })
  },

  addProd: function () {
    // console.log(this.data.cardNum)
    // console.log(this.data.cardInfo)
    // console.log(this.data.cardImg)
    // console.log(this.data.typeIndex)
    console.log(this.data.typeData[this.data.typeIndex])
    const db = wx.cloud.database()
    db.collection('clothType').doc(this.data.typeData[this.data.typeIndex]._id).update({
      data: {
        list: ['asdasdasdasd', '12321321', 'qweqwe', 'asd']
      },
      success: res => {
        console.log('更新成功', res)
      }
    })
  },

  cardNumChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      cardNum: e.detail.value
    })
  },

  cardInfoChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      cardInfo: e.detail.value
    })
  },

  cardImgChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      cardImg: e.detail.value
    })
  }
})