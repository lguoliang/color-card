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
function editBaseType(id, name) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "addBaseType",
      name: name,
      id: id
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
/**
 * 更新文章标签
 * @param {*} id 
 * @param {*} isShow 
 */
function upsertProd(id, data) {
  return wx.cloud.callFunction({
      name: 'adminService',
      data: {
          action: "upsertProd",
          id: id,
          prod: data
      }
  })
}

/**
 * 获取产品列表
 * @param {} page 
 */
// function getProdsList(page, filter, isShow, orderBy, type) {
function getProdsList(event) {
  let where = {}
  // if (filter !== '') {
  //   where.title = db.RegExp({
  //     regexp: filter,
  //     options: 'i',
  //   })
  // }
  // if (isShow !== -1) {
  //   where.isShow = isShow
  // }

  // 类型
  if (event.type != undefined && event.type != "") {
    if (event.type === 'new') {
      where.createTime = _.gt(new Date().getTime() - 1000*60*60*24)
    } else {
      where.type = db.RegExp({
        regexp: event.type,
        options: 'i',
      })
    }
  }
  // 排序
  if (event.orderBy == undefined || event.orderBy == "") {
    event.orderBy = "createTime"
  }

  return db.collection('coll_prod')
      .where(where)
      // .orderBy(orderBy, 'desc')
      // .skip((page - 1) * 10)
      .limit(10)
      // .field({
      //     _id: true,
      //     author: true,
      //     createTime: true,
      //     defaultImageUrl: true,
      //     title: true,
      //     totalComments: true,
      //     totalVisits: true,
      //     totalZans: true,
      //     isShow: true,
      //     classify: true,
      //     label: true,
      //     digest: true
      // })
      .get()

}

/**
 * 获取产品
 */
function getProdById(id) {
  return db.collection('coll_prod').doc(id).get()
}

/**
 * 删除产品
 */
function deleteProdById(id) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "deleteProdById",
      id: id
    }
  })
}

// 搜索
function searchConfirm(val) {
  return db.collection('coll_prod').where(_.or([{
    code:db.RegExp({
      regexp: val,
      option:'i'
    })
  }, {
    desc:db.RegExp({
      regexp: val,
      option:'i'
    })
  }])).get()
}

/**
 * 新增文章二维码并返回临时url
 * @param {*} id 
 * @param {*} postId 
 * @param {*} comments 
 */
function addPostQrCode(postId, timestamp) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "addPostQrCode",
      timestamp: timestamp,
      postId: postId
    }
  })
}

module.exports = {
  getProdsList: getProdsList,
  createUser: createUser,
  checkAuthor: checkAuthor,
  addBaseType: addBaseType,
  editBaseType: editBaseType,
  getTypeList: getTypeList,
  upsertProd: upsertProd,
  getProdById: getProdById,
  deleteProdById: deleteProdById,
  searchConfirm: searchConfirm,
  addPostQrCode: addPostQrCode
}