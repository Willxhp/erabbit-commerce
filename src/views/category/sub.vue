<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑组件 -->
      <SubBread></SubBread>
      <!-- 商品筛选区组件 -->
      <SubFilter @filter-change="changeFilter"></SubFilter>
      <div class="goods-list">
        <SubSort @sort-change="changeSort"></SubSort>
        <!-- 商品列表 -->
        <ul>
          <li v-for="good in goodsList" :key="good.id">
            <GoodItems :good="good"></GoodItems>
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getList"></XtxInfiniteLoading>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubCategory'
}
</script>

<script setup>
import SubBread from './components/sub-bread'
import SubFilter from './components/sub-filter'
import SubSort from './components/sub-sort'
import GoodItems from './components/goods-items'
import { ref, watch, onUpdated } from 'vue'
import { findCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
const route = useRoute()
const goodsList = ref([])
const loading = ref(false)
const finished = ref(false)
// 商品查询参数，发送请求时携带
let reqParams = {
  page: 1,
  pagsize: 20
}
// 每当无限加载组件进入可视区就重新发送请求
const getList = () => {
  reqParams.categoryId = route.params.id
  loading.value = true
  findCategoryGoods(reqParams).then(data => {
    loading.value = false
    if (data.result.items.length) {
      goodsList.value.push(...data.result.items)
      reqParams.page++
    } else {
      finished.value = true
    }
  })
}
// 当二级分类切换时，将商品列表清空
watch(() => route.params.id, (newVal) => {
  if (newVal && route.path === `/category/sub/${route.params.id}`) {
    goodsList.value = []
    reqParams.page = 1
    finished.value = false
    getList()
  }
})
// 监听筛选区改变
const changeFilter = (filterParams) => {
  reqParams = { ...reqParams, ...filterParams }
  finished.value = false
  reqParams.page = 1
  goodsList.value = []
  getList()
}
// 监听排序区改变
const changeSort = (sortParams) => {
  reqParams = { ...reqParams, ...sortParams }
  finished.value = false
  reqParams.page = 1
  goodsList.value = []
  getList()
}

</script>

<style lang="less" scoped>
.goods-list {
  background-color: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>