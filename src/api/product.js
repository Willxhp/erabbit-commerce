import request from '@/utils/request'

/**
 * 获取商品详情
 * @param {String} id  商品id
 * @returns Promise
 */
export const findGoods = (id) => {
  return request('/goods', 'get', id)
}

/**
 * 获取商品同类推荐| 猜你喜欢
 * @param {String} id - 商品id (传入代表查询相关商品，不传代表查询猜你喜欢)
 * @param {Integer} limit - 商品数量限制
 * @returns
 */
export const findGoodsRelevant = (id = null, limit = 16 ) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 获取商品热销推荐
 * @param {String} id - 商品id
 * @param {Integer} limit - 商品数量限制
 * @param {Integer} limit - 热销类型，1为24小时，2为周榜，3为总榜，默认为1
 * @returns
 */
export const findGoodsHot = ({ id, limit = 3, type }) => {
  return request('/goods/hot', 'get', { id, limit, type })
}

/**
 * 获取商品评价信息
 * @param {String} id - 商品id
 * @returns Promise对象
 */
export const findGoodsCommentInfo = (id) => {
  // return request(`/goods/${id}/evaluate`)
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
}

/**
 * 获取商品评价列表
 * @param {String} id - 商品id
 * @param {Obejct} reqParams - 商品排序参数对象
 * @returns 
 */
export const findGoodsCommentList = (id, reqParams) => {
  // return request(`/goods/${id}/evaluate/page`)
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', reqParams)
}