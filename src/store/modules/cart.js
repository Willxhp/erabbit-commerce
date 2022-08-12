// 购物车模块
// 购物车模块分为本地操作和登录后操作两大部分
// 由于登录后操作需要发送网络请求，为异步操作，所以获取新值的操作全部放在actions中，并且包装为Promise
import { checkGoodsStock } from '@/api/cart'
import PromisePool from '@/utils/PromisePool'

export default {
  namespaced: true,
  state() {
    return {
      // 购物车商品列表集合
      list: [],
    }
  },
  getters: {
    validList(state) {
      // 有效商品列表，有库存且商品有效，即stock>0且isEffective=== true
      return state.list.filter((goods) => goods.stock && goods.isEffective)
    },
    validTotal(state, getters) {
      // 有效商品总数
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    validAccount(state, getters) {
      // 有效商品总价，js计算浮点数存在不精确的问题，先将价格*100转换成整数后再相加，最后/100
      return (
        getters.validList.reduce((p, c) => parseInt(p + c.nowPrice * 100), 0) /
        100
      )
    },
  },
  mutations: {
    // 加入购物车
    insertCart(state, payload) {
      // 需要存储的商品属性
      // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
      // 线上：比上面多 isCollect 有用 discount 无用 两项项信息
      // 存储时按照商品的skuId作为区分商品的唯一标识，若购物车中已经存在具有相同skuId属性的商品
      // 则将待添加商品的count与原商品的count相加，然后删除原商品，在列表头部插入新商品
      const sameIndex = state.list.findIndex(
        (goods) => goods.skuId === payload.skuId
      )
      if (sameIndex > -1) {
        // 有重复商品
        payload.count += state.list[sameIndex].count
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(payload)
    },
    // 更新购物车
    updateCart(state, payload) {
      // 本地存储的商品信息可能会发生变化，所以每次购物车组件初始化时需要更新购物车数据
      const updateGoods = state.list.find(
        (goods) => goods.skuId === payload.skuId
      )
      // payload中某些属性可能为null、undefined或''等无效值，需要进行判断，
      for (let key in payload) {
        // payload中传入什么有效属性就更新什么属性
        if (
          payload[key] !== '' &&
          payload[key] !== null &&
          payload[key] !== undefined
        ) {
          updateGoods[key] = payload[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart(state, skuId) {
      const index = state.list.find((goods) => goods.skuId === skuId)
      state.list.splice(index, 1)
    },
  },
  actions: {
    // 加入购物车
    insertCart(context, payload) {
      // payload为商品信息对象
      return new Promise((resolve, reject) => {
        // rootState获取根state，可以获取到不同模块state中的数据
        if (context.rootState.user.profile.token) {
          // 用户已经登录
        } else {
          // 本地操作
          context.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取购物车列表
    findCartList(context) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 用户已登录
        } else {
          // 本地操作
          // 利用Promise.all()同时发送多个请求，此处需要进行高并发处理
          /* const promiseArr = context.state.list.map(item => {
            return checkGoodsStock(item.skuId)
          })
          Promise.all(promiseArr).then((dataArr) => {
            dataArr.forEach((data, i) => {
              context.commit('updateCart', {skuId: context.state.list[i].skuId, ...data.result})
            })
            resolve()
          }).catch(() => {
            reject()
          }) */
          // 高并发处理
          let promisePool = new PromisePool(
            10,
            checkGoodsStock,
            (data, options) => context.commit('updateCart', { skuId: options, ...data.result }),
            () => resolve(),
            () => reject()
          )
          const list = context.state.list.map((item) => item.skuId)
          promisePool.start(list)
        }
      })
    },
    deleteCart(context, skuId) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录状态
        } else {
          context.commit('deleteCart', skuId)
          resolve()
        }
      })
    }
  }
}
