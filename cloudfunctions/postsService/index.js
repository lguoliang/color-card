// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'addPostQrCode': {
      return addPostQrCode(event)
    }
    default: break
  }
}

/**
 * 新增文章二维码
 * @param {} event 
 */
async function addPostQrCode(event) {
  //let scene = 'timestamp=' + event.timestamp;
  let result = await cloud.openapi.wxacode.getUnlimited({
    scene: event.postId,
    page: 'pages/detail/detail'
  })

  if (result.errCode === 0) {
    let upload = await cloud.uploadFile({
      cloudPath: event.postId + '.png',
      fileContent: result.buffer,
    })

    // await db.collection("mini_posts").doc(event.postId).update({
    //   data: {
    //     qrCode: upload.fileID
    //   }
    // });

    let fileList = [upload.fileID]
    let resultUrl = await cloud.getTempFileURL({
      fileList,
    })
    return resultUrl.fileList
  }

  return []

}