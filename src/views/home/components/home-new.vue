<template>
  <!-- 新鲜好物组件 -->
  <div class="home-new" ref="target">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <template #right>
        <XtxMore path="/" />
      </template>
      <!-- 面板内容，放入默认插槽中 -->
      <transition name="fade">
        <ul class="goods-list" v-if="goods.length">
          <li v-for="item in goods" :key="item.id">
            <RouterLink :to="`/product/${item.id}`">
              <img :src="item.picture" alt="">
              <p class="name ellipsis">{{item.name}}</p>
              <p class="price">&yen;{{item.price}}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkeleton v-else bg="#f0f9f4"></HomeSkeleton>
      </transition>
    </HomePanel>
  </div>
</template>

<script>
export default {
  name: 'HomeNew'
}
</script>

<script setup>
import HomePanel from './home-panel'
import HomeSkeleton from './home-skeleton'
import { findNew } from '@/api/home'
import { ref } from 'vue'
import { useLazyData } from '@/hooks'
// let goods = ref([])
// findNew().then(data => {
//   goods.value = data.result
// })
// 组件数据懒加载
const { target, result: goods } = useLazyData(findNew)
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>