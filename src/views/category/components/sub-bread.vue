<template>
  <!-- 二级类目下的面包屑组件 -->
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem :to="`/category/${category.top.id}`" v-if="category.top">{{category.top.name}}</XtxBreadItem>
    <transition name="fade-right" mode="out-in">
      <XtxBreadItem :key="category.sub.id" v-if="category.sub">{{category.sub.name}}</XtxBreadItem>
    </transition>
  </XtxBread>
</template>

<script>
export default {
  name: 'SubBread'
}
</script>

<script setup>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
// 面包屑组件显示的内容由二级类目路由中的id决定
const store = useStore()
const route = useRoute()
// 定义category计算属性用于保存需要展示在页面中的信息
const category = computed(() => {
  const cate = {}
  store.state.category.list.some(top => {
    if (top.children) {
      let sub = top.children.find(sub => sub.id === route.params.id)
      if (sub) {
        cate.top = { id: top.id, name: top.name }
        cate.sub = { id: sub.id, name: sub.name }
        return true
      }
    }
  })
  return cate
})
</script>

<style lang="less" scoped>
</style>