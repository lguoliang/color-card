// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const prodType = db.collection('prodType')

// 云函数入口函数
exports.main = async (event, context) => {
  // if (!event.type || !event.type) {
  //   return {
  //     code: 500,
  //     message: ''
  //   }
  // } 
  // return await prodType.where({type: event.type}).get()
  prodType.where({type: event.type}).get().then( res => {
    return {
      event,
      message: 'asd'
    }
  })
  // const db = wx.cloud.database()
  // const coll = db.collection('prodType')
  // let typeName = event.type
  // let typeColl = event.coll
  // coll.where({
  //   type: typeName
  // }).get().then(res => {
  //   if (!res.data.length) {
  //     db.createCollection(typeColl).then(res => {
  //       coll.add({
  //         data: {
  //           type: typeName,
  //           coll: typeColl
  //         },
  //         success: res => {
  //           // this.queryType()
  //           console.log('添加')
  //           return {
  //             event
  //           }
  //         }
  //       }) 
  //     }).catch(err => {
  //       console.log("失败", result)
  //         return {
  //           event
  //         }
  //     })
  //     // wx.cloud.callFunction({
  //     //   name: 'createColl',
  //     //   data: {
  //     //     coll: typeColl
  //     //   },
  //     //   success (result) {
  //     //     console.log("成功", result)
  //     //     coll.add({
  //     //       data: {
  //     //         type: typeName,
  //     //         coll: typeColl
  //     //       },
  //     //       success: res => {
  //     //         // this.queryType()
  //     //         console.log('添加')
  //     //         return {
  //     //           message: '创建成功'
  //     //         }
  //     //       }
  //     //     }) 
  //     //   },
  //     //   fail(result) {
  //     //     console.log("失败", result)
  //     //     return {
  //     //       message: '数据库已存在'
  //     //     }
  //     //   }
  //     // })
  //   } else {
  //     return {
  //       event
  //     }
  //   }
  // })
}