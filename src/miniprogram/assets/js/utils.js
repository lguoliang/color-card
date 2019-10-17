const http = function (req) {
  let header = {
    'content-type': 'application/json',
    // 'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
  };
  return new Promise(function (resolve, reject) {
    wx.request({
      url: req.url || '',
      method: req.method || 'GET',
      data: req.data || {},
      header: header,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        wx.showToast({
          title: `${err}网络加载失败`,
        });
      }
    });
  })
}

const toast = function (title) {
  wx.showToast({
    icon: 'none',
    title: title
  })
}

module.exports = {
  http: http,
  toast: toast
}