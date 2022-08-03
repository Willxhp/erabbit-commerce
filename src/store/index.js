import { createStore } from 'vuex'
import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'
import createPersistedState from "vuex-persistedstate"

export default createStore({
  modules: {
    user,
    cart,
    category
  },
  // 配置vuex持久化插件
  plugins: [createPersistedState({
    // 指定存储在localStorage中的key名
    key: 'erabbit-commerce',
    // 指定需要进行持久化存储的模块
    paths: ['user', 'cart']
  })]
})
