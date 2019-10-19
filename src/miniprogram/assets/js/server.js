// 创建用户
async function createUser(event) {
  const db = wx.cloud.database()
  const coll = db.collection('user')
  coll.where({
    _openid: event.openid
  }).get().then(res => {
    if (!res.data.length) {
      coll.add({
        data: event.userInfo
      }).then(res => {
        console.log('创建成功', res)
      })
    }
  })
}

module.exports = {
  createUser: createUser
}