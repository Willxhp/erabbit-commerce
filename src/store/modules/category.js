// 商品分类模块，本模块不需要进行持久化存储
export default {
  namespaced: true,
  state() {
    return {
      // 分类信息集合
      list: []
    }
  }
}