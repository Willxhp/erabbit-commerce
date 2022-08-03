<template>
  <!-- 轮播图组件 -->
  <div class='xtx-carousel' @mouseenter="stop()" @mouseleave="start()">
    <!-- 广告图片 -->
    <ul class="carousel-body">
      <!-- 拥有fade类名的图片显示在所有图片的最上方 -->
      <li class="carousel-item" v-for="(item, i) in sliders" :key="i" :class="{fade: index === i}">
        <RouterLink to="/">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
      </li>
    </ul>
    <!-- 左箭头 -->
    <a href="javascript:;" @click="toggle(-1)" class="carousel-btn prev"><i class="iconfont icon-angle-left"></i></a>
    <!-- 右箭头 -->
    <a href="javascript:;" @click="toggle(1)" class="carousel-btn next"><i class="iconfont icon-angle-right"></i></a>
    <!-- 小圆点 -->
    <div class="carousel-indicator">
      <!-- active类名控制选中的小圆点 -->
      <span v-for="(item, i) in sliders" @click="index = i" :key="i" :class="{active: index === i}"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XtxCarousel'
}
</script>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
const props = defineProps({
  sliders: {
    type: Array,
    default: () => []
  },
  duration: {
    type: Number,
    default: 3000
  },
  autoPlay: {
    type: Boolean,
    default: false
  }
})
// 当前展示的轮播图索引，默认初始化展示第一张
let index = ref(0)
// 1. 自动播放功能
let timer = null
const autoPlayFn = () => {
  // 每次开启一个新的定时器前，先将上一个定时器停止
  clearInterval(timer)
  timer = setInterval(() => {
    index.value++
    if (index.value >= props.sliders.length) {
      index.value = 0
    }
  }, props.duration)
}
// 
watch(() => props.sliders, (newValue) => {
  // 当有数据且用户允许自动播放时，才调用autoPlayFn函数
  if (newValue.length > 0 && props.autoPlay) {
    autoPlayFn()
  }
}, { immediate: true })

// 2. 鼠标经过轮播图区域时停止自动播放
// 停止播放
const stop = () => {
  clearInterval(timer)
}
// 开始播放
const start = () => {
  // 当sliders数组中有数据且用户允许自动播放时才开始自动播放
  if (props.sliders.length > 0 && props.autoPlay) {
    autoPlayFn()
  }
}

// 3. 左右箭头切换轮播图
const toggle = step => {
  let newIndex = index.value + step
  if (newIndex < 0) return index.value = props.sliders.length - 1
  if (newIndex > props.sliders.length - 1) return index.value = 0
  index.value = newIndex
}

// 4. 点击小圆点切换轮播图
// 直接给小圆点绑定点击事件即可

// 5. 组件卸载前清除定时器
onBeforeUnmount(() => {
  clearInterval(timer)
})

</script>
<style scoped lang="less">
// 轮播图实现轮播效果的原理：所有轮播图片的位置相同，初始化时设置opacity为0，将要展示图片的z-index设置为1，opacity设置为1
// 并且给图片容器添加过渡效果，当图片切换展示时就可以实现轮播效果
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>