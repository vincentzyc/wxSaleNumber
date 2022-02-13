const ruleList = {
  checked: value => {
    if (!value) return '请选择勾选同意相关协议';
    return true
  },
  name: value => {
    if (!value) return '请输入姓名';
    if (/^[\u4e00-\u9fa5]{2,20}$/.test(value)) return true;
    if (value.length < 2 || value.length > 20) return '姓名长度不能小于2或超过20';
    return '姓名必须为汉字'
  },
  contactNo: value => {
    if (!value) return '请输入手机号';
    if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) return true;
    return '请输入正确的手机号码'
  },
  city: value => {
    if (!Array.isArray(value)) return '请选择城市';
    if (value.length === 0) return '请选择城市';
    return true
  },
  address: value => {
    if (!value) return '请输入详细地址';
    let roadReg = /^[\u4E00-\u9FA5A-Za-z0-9_—()（）-]+$/gi;
    if (!roadReg.test(value)) return '地址信息不得含特殊字符哟';
    let roadReg2 = /^[A-Za-z0-9]+$/gi;
    if (roadReg2.test(value)) return '地址信息不得纯为英文字母或数字哟';
    if (value.length < 4) return '地址不能太短哟';
    return true;
  }
}

export default ruleList