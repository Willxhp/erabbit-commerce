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
  return request('/login/code', 'get', {mobile})
}

/**
 * 手机验证码登录
 * @param {Object} param0 - {mobile: 手机号, code: 验证码}
 * @returns Promise对象
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}
