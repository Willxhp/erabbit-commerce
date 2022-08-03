// 该模块定义与商品分类有关的接口函数
import request from '@/utils/request'

/**
 * 获取全部商品分类
 * @returns Promise对象
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
