// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'addBaseType': {
      return addBaseType(event)
    }
    case 'getTypeList': {
      return getTypeList(event)
    }
    default: break
  }
}
/**
 * 新增基础标签
 * @param {*} event 
 */
async function addBaseType(event) {
  let collection = "coll_type"
  let result = await db.collection(collection).where({
    name: event.name
  }).get()
  if (result.data.length > 0) {
    return false
  } else {
    await db.collection(collection).add({
      data: {
        timestamp: Date.now(),
        name: event.name,
        num: 0
      }
    });
    return true;
  }
}

/**
 * 获取所有label集合
 * @param {*} event 
 */
async function getTypeList(event) {
  const MAX_LIMIT = 100
  const countResult = await db.collection('coll_type').count()
  const total = countResult.total
  if (total === 0) {
    return {
      data: [],
      errMsg: "no label data",
    }
  }
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('coll_type').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}