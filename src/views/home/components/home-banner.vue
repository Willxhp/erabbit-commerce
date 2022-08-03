<template>
  <!-- 主页轮播图组件 -->
  <div class="home-banner">
    <XtxCarousel :sliders="sliders" autoPlay></XtxCarousel>
  </div>
</template>
<script>
export default {
  name: 'HomeBanner'
}
</script>

<script setup>
import { findBanner } from '@/api/home'
import { ref } from 'vue'
// 定义存储轮播图数据的数组
let sliders = ref([])
findBanner().then(data => {
  sliders.value = data.result
})
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
}
// 覆盖轮播图样式
.xtx-carousel {
  :deep(.carousel-btn.prev)  {
    left: 270px;
  }
  :deep(.carousel-indicator)  {
    padding-left: 250px;
  }
}
</style>