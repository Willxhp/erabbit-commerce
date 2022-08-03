// 商品分类模块，本模块不需要进行持久化存储
import { findAllCategory } from '@/api/category'
import { topCategory } from '@/api/constants'

export default {
  namespaced: true,
  state() {
    let id = 1
    return {
      // 分类信息集合，初始值为九个分类常量数据
      list: topCategory.map(item => ({name:item, id: id++})),
    }
  },
  mutations: {
    setList(state, payload) {
      state.list = payload
    },
    // 打开二级弹窗
    open(state, id) {
      state.list.some(item => {
        if (item.id === id) {
          item.open = true
          return true
        }
      })
    },
    // 关闭二级弹窗
    hide(state, id) {
      state.list.some(item => {
        if (item.id === id) {
          item.open = false
          return true
        }
      })
    }
  },
  actions: {
    async getList(context) {
      const { result } = await findAllCategory()
      result.forEach(top => {
        // 给所有的顶级分类对象加一个open属性，表示是否打开该分类的二级分类弹窗
        top.open = false
      })
      context.commit('setList', result)
    },
  },
}
