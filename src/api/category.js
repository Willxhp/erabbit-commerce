// 该模块定义与商品分类有关的接口函数
import request from '@/utils/request'

/**
 * 获取全部商品分类
 * @returns Promise对象
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

/**
 * 获取一级商品分类的详细信息
 * @param {String} id 一级分类id
 * @returns Promise对象
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}

/**
 * 获取二级商品分类的筛选条件
 * @param {String} id 二级分类id
 * @returns Promise对象
 */
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', {id})
}

/**
 * 获取商品列表
 * @param {Object} params 商品查询的相关信息
 * @returns Promise对象
 */
export const findCategoryGoods = (params) => {
  return request('/category/goods', 'post', params)
}