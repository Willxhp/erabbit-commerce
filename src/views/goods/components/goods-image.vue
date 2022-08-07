<template>
  <!-- 商品图片组件 -->
  <div class="goods-image">
    <!-- 大图 -->
    <div v-show="show" class="large" :style="[{backgroundImage:`url(${images[currentIndex]})`}, bgPosition]"></div>
    <!-- 中图 -->
    <div class="middle" ref="target">
      <img :src="images[currentIndex]" alt="">
      <!-- 遮罩容器 -->
      <div v-show="show" class="layer" :style="position"></div>
    </div>
    <!-- 小图 -->
    <div class="small">
      <ul>
        <li v-for="(img, i) in images" :key="i" @mouseenter="currentIndex = i" :class="{active: currentIndex === i}">
          <img :src="img" alt="">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsImage'
}
</script>

<script setup>
import { ref, watch, reactive } from 'vue'
import { useMouseInElement } from '@vueuse/core'
const props = defineProps({
  images: {
    type: Array,
    default: () => ([])
  }
})
// 控制当前中图的显示图片
const currentIndex = ref(0)
// 使用@vueuse/core库提供的useMouseInElement钩子函数获取鼠标相对元素左上角的坐标
const target = ref(null)
// elementX 鼠标基于容器左上角X轴偏移
// elementY 鼠标基于容器左上角Y轴偏移
// isOutside 鼠标是否在模板容器外
// 均为ref响应式数据
const { elementX, elementY, isOutside } = useMouseInElement(target)
// 控制缩略图是否展示
const show = ref(false)
// 遮罩层的位置
const position = reactive({
  top: 0,
  left: 0
})
// 大图的背景定位
const bgPosition = reactive({
  backgroundPositionX: 0,
  backgroundPositionY: 0
})
watch([elementX, elementY, isOutside], () => {
  if (elementX.value < 100) position.left = 0
  else if (elementX.value > 300) position.left = 200
  else position.left = elementX.value - 100

  if (elementY.value < 100) position.top = 0
  else if (elementY.value > 300) position.top = 200
  else position.top = elementY.value - 100

  // 偏移量和背景定位都需要带单位 
  bgPosition.backgroundPositionX = - 2 * position.left + 'px'
  bgPosition.backgroundPositionY = -2 * position.top + 'px'

  position.top = position.top + 'px'
  position.left = position.left + 'px'
  // 设置是否显示预览大图
  show.value = !isOutside.value
})
</script>

<style lang="less" scoped>
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>