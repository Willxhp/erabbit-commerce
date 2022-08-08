<template>
  <div class="goods-hot">
    <h3>{{title}}</h3>
    <div v-if="goodsList.length">
      <GoodsItem v-for="item in goodsList" :key="item.id" :good="item" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsHot'
}
</script>

<script setup>
import GoodsItem from '@/views/category/components/goods-items'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { findGoodsHot } from '@/api/product'
const route = useRoute()
const props = defineProps({
  type: {
    type: Number,
    default: 1
  }
})
// 获取商品列表
const goodsList = ref([])
findGoodsHot({ id: route.params.id, type: props.type }).then(data => {
  goodsList.value = data.result
})
// 热销类型，1为24小时热榜，2为周榜，3为总榜，默认为1
const titleObj = {
  1: '24小时热榜',
  2: '周榜',
  3: '总榜'
}
// 标题
const title= computed(() => {
  return titleObj[props.type]
})
</script>

<style lang="less" scoped>
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item)  {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>