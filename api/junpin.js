export const JunpinBaseUrl = "https://test-junpin.junpinclub.com"

export const Junpin = [{
  name: "getOpenId", //小程序登录
  url: "/wxapi/getOpenId?code=", //接口路径
  getAllData: true
}, {
  name: "getPhone",  //获取小程序手机号码
  url: "/wxapi/getPhone",
}, {
  name: "getAddress",    //获取收货地址
  url: "/memberNumber/receiver/listForNumber",
  type: 'post'
}, {
  name: "setAddress",   //设置收货地址
  url: "/memberNumber/receiver/saveForNumber",
  type: 'post'
}, {
  name: "getOrderList",   //获取订单列表
  url: "/memberNumber/myOrderCenterForNumber",
  type: 'post'
}]

export default Junpin