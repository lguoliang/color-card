const http = function (req) {
  let header = {
    'content-type': 'application/json',
    // 'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
  };
  return new Promise(function (resolve, reject) {
    wx.showLoading()
    wx.request({
      url: req.url || '',
      method: req.method || 'GET',
      data: req.data || {},
      header: header,
      success: function (res) {
        wx.hideLoading()
        resolve(res);
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: `${err}网络加载失败`,
        });
      }
    });
  })
}

const formatTime = function (time) {
  return new Date(time).getTime()
}

const toast = function (title) {
  wx.showToast({
    icon: 'none',
    title: title
  })
}
// 获取数据
const getdata = function (data) {
  return wx.cloud.callFunction({
    name: 'getdata',
    data: data
  })
}

module.exports = {
  http: http,
  toast: toast,
  getdata: getdata,
  formatTime: formatTime
}