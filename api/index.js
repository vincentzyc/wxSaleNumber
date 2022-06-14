import { Common, CommonBaseUrl } from "./common"
import { Card, CardBaseUrl } from "./card"
import { Junpin, JunpinBaseUrl } from "./junpin"

export const createInterface = (arr, baseUrl) => {
  let Interface = {};
  arr.forEach(v => {
    Interface[v.name] = (param, config) => {
      return new Promise((resolve, reject) => {
        const formatUrl = v.url.includes('http://') || v.url.includes('https://') ? v.url : baseUrl + v.url
        if (formatUrl.includes('junpin.junpinclub')) {
          Api.junpinRequest({
            url: formatUrl,
            data: param,
            method: v.type === 'post' ? 'POST' : 'GET',
            getAllData: v.getAllData
          }).then(res => resolve(res)).catch(error => reject(error))
        } else {
          v.type === 'get' ? Api.wxGet(formatUrl + param, { getAllData: v.getAllData, config }).then(res => resolve(res))
            : Api.wxPost({
              url: formatUrl,
              data: param,
              getAllData: v.getAllData,
              getError: v.getError,
              config
            }).then(res => resolve(res)).catch(error => reject(error))
        }
      })
    }
  });
  return Interface
}

export const Api = {
  CommonBaseUrl,
  JunpinBaseUrl,
  Common: createInterface(Common, CommonBaseUrl),
  Card: createInterface(Card, CardBaseUrl),
  Junpin: createInterface(Junpin, JunpinBaseUrl),
  wxPost(config) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.url,
        method: 'POST',
        data: config.data,
        ...config,
        success(res) {
          if (res.statusCode !== 200) {
            console.log(res);
            wx.hideLoading();
            wx.showModal({
              content: res.statusText || '网络繁忙',
              showCancel: false
            })
            return
          }
          let result = res.data;
          if (config.getAllData) return resolve(result);
          switch (result.code) {
            case "0": //  成功
              return resolve(result.data);
            case "0000": //  成功
              return resolve(result.data);
            default: // 失败
              if (config.getError) return reject('fail')
              wx.hideLoading();
              wx.showModal({
                content: result.message || result.msg || '服务器繁忙',
                showCancel: false
              })
          }
        },
        fail(error) {
          console.log(error);
          if (config.getError) return reject(error)
          wx.hideLoading();
          wx.showModal({
            content: '服务器繁忙',
            showCancel: false
          })
        }
      })
    })
  },
  wxGet(url, config = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'GET',
        ...config,
        success(res) {
          if (res.statusCode !== 200) {
            console.log(res);
            wx.hideLoading();
            wx.showModal({
              content: res.statusText || '网络繁忙',
              showCancel: false
            })
            return
          }
          let result = res.data;
          if (config.getAllData) return resolve(result);
          switch (result.code) {
            case "0": //  成功
              return resolve(result.data);
            case "0000": //  成功
              return resolve(result.data);
            default: // 失败
              if (config.getError) return reject('fail')
              wx.hideLoading();
              wx.showModal({
                content: result.message || result.msg || '服务器繁忙',
                showCancel: false
              })
          }
        },
        fail(error) {
          console.log(error);
          if (config.getError) return reject(error)
          wx.hideLoading();
          wx.showModal({
            content: '服务器繁忙',
            showCancel: false
          })
        }
      })
    })
  },
  junpinRequest(config) {
    return new Promise((resolve, reject) => {
      var header = {
        'content-type': 'application/json; charset=utf-8',
        'cookie': wx.getStorageSync("sessionid") //读取本地保存好的上一次cookie
      };
      wx.request({
        url: config.url,
        data: config.data,
        header: header,
        ...config,
        success(res) {
          var cookie = res.header["Set-Cookie"];
          if (cookie != null) {
            wx.setStorageSync("sessionid", res.header["Set-Cookie"]);//服务器返回的Set-Cookie，保存到本地
          }
          if (res.statusCode !== 200) {
            wx.hideLoading();
            wx.showModal({
              content: res.statusText || '网络繁忙',
              showCancel: false
            })
            return
          }
          let result = res.data;
          console.log(config, result)
          if (config.getAllData) return resolve(result);
          switch (result.code) {
            case 1: //  成功
              return resolve(result.data);
            default: // 失败
              console.log(result.message);
              return resolve(result.data);
          }
        },
        fail(error) {
          console.log(error);
        }
      })
    })
  }
}

export default Api