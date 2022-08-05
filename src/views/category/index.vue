<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem :to="{path: '/'}">首页</XtxBreadItem>
        <transition name="fade-right" mode="out-in">
          <!-- 需要给XtxBreadItem绑定key属性，使得每次数据更新时组件会被重新创建和销毁，从而触发过渡动画 -->
          <XtxBreadItem :key="topCategory.id">{{topCategory.name}}</XtxBreadItem>
        </transition>
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
      <!-- 分类关联商品 -->
      <div class="ref-goods" v-for="sub in subList" :key="sub.id">
        <div class="head">
          <h3>{{sub.name}}</h3>
          <p class="tag">物美价廉，品质之选</p>
          <XtxMore :path="`/category/sub/${sub.id}`" />
        </div>
        <div class="body">
          <GoodsItem v-for="good in sub.goods" :key="good.id" :good="good" />
        </div>
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
import GoodsItem from './components/goods-items'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { findBanner } from '@/api/home'
import { findTopCategory } from '@/api/category'
// 获取轮播图数据
let sliders = ref([])
findBanner().then(data => {
  sliders.value = data.result
})
// 获取二级分类列表，二级分类的数据保存在vuex中
const store = useStore()
const route = useRoute()
// 根据路由中的传递的id，判断当前正在浏览的一级分类
const topCategory = computed(() => {
  // 定义一个空对象，防止数据未返回时从undefined中获取属性报错
  let cate = {}
  const item = store.state.category.list.find(item => {
    return item.id === route.params.id
  })
  if (item) cate = item
  return cate
})
// 获取二级分类相关的商品数据
// 注意：当路由中传递的参数id变化时，组件不会重新创建，也就是不会重新调用setup函数，所以不会重新请求数据
// 为了实现路由id变化重新请求数据，需要对路由中的id进行监听
let subList = ref([])
const getSubList = () => {
  findTopCategory(route.params.id).then(data => {
    // 返回的数据是当前id对应的一级商品分类的全部数据，二级分类在children属性中
    subList.value = data.result.children
  })
}
watch(() => route.params.id, (newValue) => {
  // 当params中有id属性时且只有在一级类目路由下才发送请求
  // 切换到二级类目路由的时候也有id，也会触发watch导致发送了请求，需要进行额外处理。
  if (newValue && `/category/${newValue}` === route.path) getSubList()
}, { immediate: true })
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
  // 分类关联商品
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>