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

/**
 * 根据商品的skuId获取商品的specs和skus信息
 * @param {String} skuId - 商品的skuId
 * @returns Promise对象
 */
export const findGoodsInfo = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}

/**
 * 合并购物车
 * @param {Array<object>} cartList - 购物车sku集合
 * @param {String} cartList.skuId - 商品skuId
 * @param {Boolean} cartList.selected - 是否选中
 * @param {Integer} cartList.count - 商品数量
 * @returns Promise对象
 */
export const mergeCart = (cartList) => {
  return request('/member/cart/merge', 'post', cartList)
}

/**
 * 获取购物车列表
 * @returns Promise对象
 */
export const findCartList = () => {
  return request('/member/cart', 'get')
}

/**
 * 加入购物车
 * @param {String} skuId - 商品skuId
 * @param {Integer} count - 商品数量
 * @returns Promise对象
 */
export const insertCart = ({skuId, count}) => {
  return request('/member/cart', 'post', {skuId, count})
}

/**
 * 删除/清空购物车商品
 * @param {Array<string>} ids - 商品skuId集合
 * @returns Promise对象
 */
export const deleteCart = (ids) => {
  return request('/member/cart', 'delete', {ids})
}