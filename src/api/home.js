// 该模块定义与HomePage页面相关的api接口函数

import request from '@/utils/request'

/**
 * 获取热门品牌
 * @param {Integer} limit 需要的数据条数
 * @returns Promise对象
 */
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

/**
 * 获取轮播图数据
 * @returns Promise对象
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}

/**
 * 获取新鲜好物数据
 * @returns Promise对象
 */
export const findNew = () => {
  return request('/home/new', 'get')
}

/**
 * 获取人气推荐数据
 * @returns Promise对象
 */
export const findHot = () => {
  return request('/home/hot', 'get')
}