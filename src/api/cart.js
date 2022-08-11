// 购物车数据相关的api
import request from '@/utils/request'

/**
 * 判断商品是否有效
 * @param {String} skuId - 商品的skuId
 * @returns Promise对象
 */
export const checkGoodsStock = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}