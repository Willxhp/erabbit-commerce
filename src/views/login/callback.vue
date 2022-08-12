<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount=true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount=false" :class="{active:!hasAccount}" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :nickname="nickname" :avatar="avatar" :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter></LoginFooter>
</template>

<script>
export default {
  name: 'LoginCallback'
}
</script>

<script setup>
import { ref } from 'vue'
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
import { userQQLogin } from '@/api/user'
import QC from 'qc'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'
const store = useStore()
const router = useRouter()
// 默认已经有账号
const hasAccount = ref(true)
// 用户的QQ昵称和头像
const nickname = ref(null)
const avatar = ref(null)
const unionId = ref(null)
// 获取用户的QQ昵称和头像
if (QC.Login.check()) {
  QC.api('get_user_info').success(res => {
    nickname.value = res.data.nickname
    avatar.value = res.data.figureurl_1
  })
}
// 用户QQ登录成功后有三种可能的情况：已注册已绑定，已注册未绑定，未注册未绑定
// 第三方登录成功后可以获取到用户唯一的三方标识，此标识是实现账户绑定的关键
// 1. 已注册已绑定
// 当用户QQ登录成功后，默认用户已经绑定，使用用户的unionId三方标识尝试登录，如果登录成功证明已经绑定
// isBind用于展示加载页面
const isBind = ref(true)
// 调用JS SDK提供的api获取用户的三方标识
// QC.Login.check()检查用户当前的登录状态，返回Boolean
if (QC.Login.check()) {
  // QC.Login.getMe()用于获取用户信息，接收一个回调函数，回调函数传入的第一个参数就是用户的三方标识openId
  QC.Login.getMe((openId) => {
    userQQLogin(openId).then(data => {
      // 登录成功说明用户已经绑定账号，保存用户信息并跳转至来源页面或首页即可
      const { id, nickname, avatar, mobile, token, account } = data.result
      store.commit('user/setUser', { id, nickname, avatar, mobile, token, account })
      store.dispatch('cart/mergeCart').then(() => {
        router.push(store.state.user.redirectUrl)
        Message({ type: 'success', text: '登录成功' })
      })
    }).catch(() => {
      // 登录失败说明账号未绑定，显示绑定或注册组件
      unionId.value = openId
      isBind.value = false
    })
  })
}
</script>

<style lang="less" scoped>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>