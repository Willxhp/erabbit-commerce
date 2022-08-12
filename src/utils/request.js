// 1. 创建一个新的axios实例
// 2. 请求拦截器，判断vuex中是否有token，如果有则放入headers中携带
// 3. 响应拦截器，抽离后端返回的真实数据，处理token失效的情况
// 4. 导出一个函数，调用当前的axios实例发送请求，返回Promise对象
import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 导出基地址，便于非axios发送网络请求的地方使用
// export const baseURL = 'http://apipc-xiaotuxian-front.itheima.net' // 备用接口地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net'
const instance = axios.create({
  baseURL,
  timeout: 5000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const { profile } = store.state.user
    // 判断是否有token
    if (profile.token) {
      config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 相应拦截器
instance.interceptors.response.use(
  // 真实后台数据的抽离
  (res) => res.data,
  (err) => {
    // 处理401状态码，即用户未登录或token失效
    if (err.response && err.response.status === 401) {
      // 1. 清空无效的用户信息
      store.commit('user/setUser', {})
      // 2. 跳转至登录页
      // 3. 跳转时需要携带参数(当前路由地址)给登录页，便于用户登录后重新跳转至当前页面
      // router.currentRoute是Vue3封装的ref响应式数据，保存当前路由信息
      // fullPath属性带有路径中的query参数，为防止解析地址时出现问题，需要使用encodeURIComponent进行转码
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
  }
)

// 请求工具函数
export default (url, method, submitData) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData,
  })
}
