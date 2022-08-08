<template>
  <!-- 顶部通栏 -->
  <AppTopnav></AppTopnav>
  <!-- 吸顶头部 -->
  <AppHeaderSticky></AppHeaderSticky>
  <!-- 头部区域 -->
  <AppHeader></AppHeader>
  <!-- 二级路由 -->
  <router-view></router-view>
  <!-- 底部区域 -->
  <AppFooter></AppFooter>

  <div @click="changeRoute">12124</div>
</template>

<script>
export default {
  name: 'Layout'
}
</script>

<script setup>
import AppTopnav from '@/components/app-topnav'
import AppHeader from '@/components/app-header'
import AppFooter from '@/components/app-footer'
import AppHeaderSticky from '@/components/app-header-sticky'
import { useStore } from 'vuex'

const store = useStore()
// 获取全部分类数据
store.dispatch('category/getList')

</script>

<style lang="less" scoped>
</style>