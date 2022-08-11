// 用户登录相关的API
import request from '@/utils/request'

/**
 * 用户名和密码登录
 * @param {Object} param0 - {account: 用户名, password: 密码}
 * @returns Promise对象
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

/**
 * 获取登录短信验证码
 * @param {String} mobile - 手机号
 * @returns Promise对象
 */
export const getMobileLoginCode = (mobile) => {
  return request('/login/code', 'get', { mobile })
}

/**
 * 手机验证码登录
 * @param {Object} param0 - {mobile: 手机号, code: 验证码}
 * @returns Promise对象
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

/**
 * QQ登录
 * @param {Object} param0 - {unionId: 用户的三方标识, source: 注册来源(1为pc端)}
 * @returns Promise对象
 */
export const userQQLogin = (unionId, source = 1) => {
  return request('/login/social', 'post', { unionId, source })
}

/**
 * 三方登录 发送已有账号短信验证码
 * @param {String} mobile - 手机号
 * @returns Promise对象
 */
export const getQQLoginCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

/**
 * 三方登录绑定账号
 * @param {String} unionId - 用户的三方标识
 * @param {String} mobile - 手机号
 * @param {String} code - 短信验证码
 * @returns Promise对象
 */
export const bindQQLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}

/**
 * 校验用户名是否唯一
 * @param {String} account - 用户名
 * @returns Promise对象
 */
export const checkAccount = (account) => {
  return request('/register/check', 'get', { account })
}

/**
 * 获取注册或完善资料短信验证码
 * @param {String} mobile - 手机号
 * @returns Promise对象
 */
export const getRegisterCode = (mobile) => {
  return request('/register/code', 'get', {mobile})
}

/**
 * 三方登录完善信息
 * @param {String} unionId - 用户的三方标识
 * @param {String} account - 用户名
 * @param {String} mobile - 手机号
 * @param {String} code - 短信验证码
 * @param {String} password - 密码
 * @returns 
 */
export const patchQQLogin = ({unionId, account, mobile, code, password}) => {
  return request(`/login/social/${unionId}/complement`, 'post', {account, mobile, code, password})
}

/**
 * 用户注册
 * @param {String} account - 用户名
 * @param {String} mobile - 手机号
 * @param {String} code - 短信验证码
 * @param {String} password - 密码
 * @returns Promise对象
 */
export const userRegister = ({account, mobile, code, password}) => {
  return request('/register', 'post', {account, mobile, code, password})
}