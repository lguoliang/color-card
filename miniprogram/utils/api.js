wx.cloud.init({
  env: 'test-7b2wm',
  traceUser: true,
})
const db = wx.cloud.database()
const _ = db.command

// 创建用户
async function createUser(event) {
  let user = await db.collection('user').where({
    _openid: event.openid
  }).get()
  if (!user.data.length) {
    db.collection('user').add({
      data: event.userInfo
    }).then(res => {
      console.log('创建成功', res)
    })
  }
}
/**
 * 验证是否是管理员
 */
function checkAuthor(id) {
  // console.log(id)
  return db.collection('user').where({
    _openid: id
  }).get()
}


/**
 * 新增基础类型
 */
function addBaseType(name) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "addBaseType",
      name: name
    }
  })
}
/**
 * 获取type集合
 */
function getTypeList() {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "getTypeList"
    }
  })
}

module.exports = {
  createUser: createUser,
  checkAuthor: checkAuthor,
  addBaseType: addBaseType,
  getTypeList: getTypeList
}