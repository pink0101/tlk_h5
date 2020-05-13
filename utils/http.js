// 封装psot请求
const post = (url, data) => {
  var promise = new Promise((resolve, reject) => {
    //网络请求
    wx.request({
      url: 'https://tp.xiniuwangluo.cn/' + url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8', // 默认值
      },
      success: function (res) {//服务器返回数据
        if (res.statusCode == 200) {
          resolve(res);
        } else {//返回错误提示信息
          reject(res.data);
        }
      },
      error: function (e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}
// 计算距离
const jl = (latitude, longitude, jd, wd) => {
  let QQMapWX = require('./qqmap-wx-jssdk.js');
  let qqmapsdk = new QQMapWX({
    key: 'W7TBZ-SU46S-N5DOS-62TLE-U4OV3-2OFU6'
    //wx0b7dced55ba1c5c1
  });
  let promise = new Promise((resolve, reject) => {
    qqmapsdk.calculateDistance({
      from: {
        latitude: latitude,
        longitude: longitude
      },
      to: [{
        latitude: jd,
        longitude: wd
      }],
      success: function (res) {
        // console.log('1231231231', res.result.elements[0].distance)
        resolve(res.result.elements[0].distance)
        // console.log('加了距离的对象',Object.assign(item, { jl: ysjl }))
      },
      fail: function (error) {
        reject(error);
      },
      complete: function (res) {
        // console.log(res);
      }
    })
  })
  return promise;
}
module.exports = {
  post,
  jl
}