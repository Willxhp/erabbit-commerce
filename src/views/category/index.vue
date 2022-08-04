<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem :to="{path: '/'}">首页</XtxBreadItem>
        <XtxBreadItem>{{topCategory.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders="sliders" style="height: 500px;"></XtxCarousel>
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <router-link :to="`/category/sub/${sub.id}`">
              <img :src="sub.picture">
              <p>{{sub.name}}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopCategory'
}
</script>

<script setup>
import { ref, computed } from 'vue'
import { findBanner } from '@/api/home'
import { useStore } from 'vuex'
import {useRoute} from 'vue-router'
let sliders = ref([])
findBanner().then(data => {
  sliders.value = data.result
})
// 分类的数据保存在vuex中
const store = useStore()
const route = useRoute()
const topCategory = computed(() => {
  // 定义一个空对象，防止数据未返回时从undefined中获取属性报错
  let cate = {}
  const item = store.state.category.list.find(item => {
    return item.id === route.params.id
  })
  if (item) cate = item
  return cate
})
</script>

<style lang="less" scoped>
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>