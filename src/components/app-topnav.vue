<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li><a href="javascript:;"><i class="iconfont icon-user"></i>{{profile.account}}</a></li>
          <li><a href="javascript:;" @click="logout">退出登录</a></li>
        </template>
        <template v-else>
          <li>
            <router-link to="/login">请先登录</router-link>
          </li>
          <li><router-link to="/register">免费注册</router-link></li>
        </template>
        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li><a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a></li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'AppTopnav'
}
</script>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'
const store = useStore()
const router = useRouter()

// 获取用户信息
const profile = computed(() => store.state.user.profile)

// 退出登录
const logout = () => {
  // 清空本地用户信息
  store.commit('user/setUser', {
    id: '',
    avatar: '',
    nickname: '',
    account: '',
    mobile: '',
    token: ''
  })
  // 清空本地购物车信息
  store.commit('cart/setCart', [])
  Message({type: 'success', text: '退出登录成功'})
  router.push('/login')
}
</script>

<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      // A ~ B 表示选择A标签后面的全部B标签，前提是A和B具有相同的父元素
      // 表示除第一个li外，所有的li都有一个左边框
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>