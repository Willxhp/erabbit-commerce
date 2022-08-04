<template>
  <!-- 人气推荐组件 -->
  <div class="home-new" ref="target">
    <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
      <!-- 面板内容，放入默认插槽中 -->
      <transition name="fade">
        <ul ref="pannel" class="goods-list" v-if="goods.length">
          <li v-for="item in goods" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" alt="">
              <p class="name">{{item.title}}</p>
              <p class="desc">{{item.alt}}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkeleton v-else></HomeSkeleton>
      </transition>
    </HomePanel>
  </div>
</template>

<script>
export default {
  name: 'HomeHot'
}
</script>

<script setup>
import HomePanel from './home-panel'
import HomeSkeleton from './home-skeleton'
import { ref } from 'vue'
import { findHot } from '@/api/home'
import { useLazyData } from '@/hooks'

// const goods = ref([])
// findHot().then(data => {
//   goods.value = data.result
// })
// 组件数据懒加载
const { target, result: goods } = useLazyData(findHot)
</script>

<style lang="less" scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>