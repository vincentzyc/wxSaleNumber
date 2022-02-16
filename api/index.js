import { Common, CommonBaseUrl } from "./common"
import { Card, CardBaseUrl } from "./card"

export const createInterface = (arr, baseUrl) => {
  let Interface = {};
  arr.forEach(v => {
    Interface[v.name] = (param, config) => {
      return new Promise((resolve, reject) => {
        const formatUrl = v.url.includes('http://') || v.url.includes('https://') ? v.url : baseUrl + v.url
        v.type === 'get' ? Api.wxGet(formatUrl + param, { getAllData: v.getAllData, config }).then(res => resolve(res))
          : Api.wxPost({
            url: formatUrl,
            data: param,
            getAllData: v.getAllData,
            getError: v.getError,
            config
          }).then(res => resolve(res)).catch(error => reject(error))
      })
    }
  });
  return Interface
}

export const Api = {
  CommonBaseUrl,
  Common: createInterface(Common, CommonBaseUrl),
  Card: createInterface(Card, CardBaseUrl),
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
  }
}

export default Api