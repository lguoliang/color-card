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
  return prodType.where({type: event.type}).get()
}