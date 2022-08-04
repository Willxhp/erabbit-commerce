<template>
<!-- 首页面板骨架组件，在面板数据请求未返回时进行占位 -->
  <div class="home-skeleton">
    <div class="item" v-for="i in 4" :key="i" :style="{backgroundColor: bg}">
      <XtxSkeleton width="306px" height="306px" animated></XtxSkeleton>
      <XtxSkeleton width="160px" height="24px" animated></XtxSkeleton>
      <XtxSkeleton width="120px" height="24px" animated></XtxSkeleton>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeSkeleton'
}
</script>

<script setup>
const props = defineProps({
  bg: {
    type: String,
    default: '#fff'
  }
})
</script>

<style lang="less" scoped>
.home-skeleton {
  display: flex;
  width: 1240px;
  height: 406px;
  justify-content: space-between;
  .item {
    height: 406px;
    width: 306px;
    .xtx-skeleton ~ .xtx-skeleton {
      display: block;
      margin: 16px auto 0;
    }
  }

}
</style>