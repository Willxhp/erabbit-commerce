export default {
  // 表单校验规则，如果校验通过则返回true，如果校验失败则返回一个字符串
  account(value) {
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '用户名必须为字符开头的6-20位字符'
    return true
  },
  password(value) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码为6-24位字符'
    return true
  },
  mobile(value) {
    if (!value) return '请输入手机号'
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
    return true
  },
  code(value) {
    if (!value) return '请输入验证码'
    if (!/^\d{6}$/.test(value)) return '验证码是6位数字'
    return true
  },
  isAgree(value) {
    if (!value) return '请勾选同意用户协议'
    return true
  }
}