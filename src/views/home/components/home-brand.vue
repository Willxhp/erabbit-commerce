<template>
  <div class="home-brand" ref="target">
    <HomePanel title="热门品牌" subTitle="国际经典 品质保证">
      <template #right>
        <a href="javascript:;" class="iconfont icon-angle-left prev" @click="toggle(-1)" :class="{disabled: index === 0}"></a>
        <a href="javascript:;" class="iconfont icon-angle-right next" @click="toggle(1)" :class="{disabled: index === 1}"></a>
      </template>
      <div class="box">
        <transition name="fade">
          <ul class="list" :style="{transform: `translateX(-${index*1240}px)`}" v-if="brands.length">
            <li v-for="item in brands" :key="item.id">
              <router-link to="/"><img :src="item.picture" alt=""></router-link>
            </li>
          </ul>
          <!-- 骨架结构 -->
          <div class="skeleton" v-else>
            <XtxSkeleton width="240px" height="305px" bg="#e4e4e4" animated v-for="i in 5" :key="i"></XtxSkeleton>
          </div>
        </transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
export default {
  name: 'HomeBrand'
}
</script>

<script setup>
import HomePanel from './home-panel'
import { findBrand } from '@/api/home'
import { ref } from 'vue'
import { useLazyData } from '@/hooks'
// let brands = ref([])
// findBrand(10).then(data => {
//   brands.value = data.result
// })
// 数据懒加载
const { target, result: brands } = useLazyData(() => findBrand(10))

// 点击左右按钮切换品牌
let index = ref(0)
const toggle = step => {
  let newIndex = index.value + step
  if (newIndex > 1 || newIndex < 0) return
  index.value = newIndex
}
</script>

<style lang="less" scoped>
.home-panel {
  background-color: #f5f5f5;
  .iconfont {
    display: inline-block;
    margin-left: 5px;
    width: 20px;
    height: 20px;
    background-color: @xtxColor;
    color: #fff;
    text-align: center;
    &::before {
      font-size: 12px;
      position: relative;
      top: -2px;
    }
    &.disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
}

.box {
  overflow: hidden;
  height: 345px;
  .list {
    width: 2480px;
    height: 305px;
    display: flex;
    justify-content: space-around;
    transition: all 1s;
    li {
      img {
        height: 305px;
        width: 240px;
      }
    }
  }
}

.skeleton {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
</style>