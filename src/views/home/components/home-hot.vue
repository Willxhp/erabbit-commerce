<template>
  <!-- 新鲜好物组件 -->
  <div class="home-new">
    <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
      <!-- 面板内容，放入默认插槽中 -->
      <ul ref="pannel" class="goods-list">
        <li v-for="item in goods" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
            <p class="name">{{item.title}}</p>
            <p class="desc">{{item.alt}}</p>
          </RouterLink>
        </li>
      </ul>
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
import { ref } from 'vue'
import { findHot } from '@/api/home'
const goods = ref([])
findHot().then(data => {
  goods.value = data.result
})
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