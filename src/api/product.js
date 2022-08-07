import request from "@/utils/request"

/**
 * 获取商品详情
 * @param {String} id  商品id
 * @returns Promise
 */
export const findGoods = (id) => {
  return request('/goods', 'get', id)
}