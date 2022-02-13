// export const CommonBaseUrl = "https://number.junpinclub.com"
export const CommonBaseUrl = "http://test-number.junpinclub.com"

export const Common = [{
  name: "getSmsCode", //方法名
  url: "/api/goodNumber/getSmsCode", //接口路径
  getAllData: true
}, {
  name: "getNumPool", //号池查询
  url: "/api/numberPool/queryPool", //接口路径
}, {
  name: "categoryList",  //靓号类型
  url: "/api/numberPool/category",
}, {
  name: "addOrder",  //下单
  url: "/api/goodNumber/addOrder",
  getAllData: true
}, {
  name: "getOrderDetail",  //获取付款订单详细
  url: "/api/goodNumberOrder/detail",
}, {
  name: "orderUpdate",  //编辑订单详情（留资）
  url: "/api/goodNumberOrder/update"
}, {
  name: "uploadPhoto",  //编辑订单详情（留资）
  url: "/api/goodNumber/uploadPhotoH5",
}, {
  name: "getPhotos",  //获取图片
  url: "/api/identityInfo/getByOrderCode",
}, {
  name: "secondList",  //秒杀列表
  url: "/api/goodNumberSecond/listAll",
}, {
  name: "getPidInfo",  //获取pid信息
  url: "/api/goodNumberOrder/getPidInfo",
}, {
  name: "getRulesList",  //获取号码搜索信息
  url: "/api/index/params",
}]

export default Common