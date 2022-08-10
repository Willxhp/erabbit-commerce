// 用户信息模块
export default {
  // 开启命名空间后，模块的getters, mutations和actions在使用时都需要加上模块名前缀
  namespaced: true,
  // state也可以写成函数形式，与data()类似
  state() {
    return {
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        // token用于用户的身份验证
        token: ''
      },
      redirectUrl: '/'
    }
  },
  mutations: {
    // 修改用户信息，payLoad是用户信息对象
    setUser(state, payLoad) {
      state.profile = payLoad
    },
    setRedirectUrl(state, redirectUrl) {
      state.redirectUrl = redirectUrl
    }
  }
}