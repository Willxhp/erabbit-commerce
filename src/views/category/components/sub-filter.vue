<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a href="javascript:;" @click="changeBrand(item.id)" :class="{active: item.id===filterData.selectedBrand}" v-for="item in filterData.brands" :key="item.id">{{item.name}}</a>
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{item.name}}：</div>
      <div class="body">
        <a href="javascript:;" @click="changeProp(item, prop.id)" :class="{active: prop.id === item.selectedProp}" v-for="prop in item.properties" :key="prop.id">{{prop.name}}</a>
      </div>
    </div>
  </div>
  <!-- 骨架组件 -->
  <div class="sub-filter" v-else>
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>

<script>
export default {
  name: 'SubFilter'
}
</script>

<script setup>
import { computed, ref, watch } from 'vue'
import { findSubCategoryFilter } from '@/api/category'
import { useRoute } from 'vue-router'

const route = useRoute()
const emit = defineEmits(['filter-change'])
// 筛选条件信息
let filterData = ref(null)
// 由于filterData在组件首次数据请求返回后就始终有值，重新发送网络请求的过程不会显示骨架组件
// 用filterLoading变量表示当前是否正处于数据加载的过程中
let filterLoading = ref(false)
watch(() => route.params.id, (newValue) => {
  // 当路由中有id且处于二级类目路由时再发送网络请求
  if (newValue && route.path === `/category/sub/${newValue}`) {
    // 发起网络请求前先将fliterLoading设置为true
    filterLoading.value = true
    findSubCategoryFilter(route.params.id).then(data => {
      // 后端返回的筛选条件中缺少 全部 这一项，手动添加
      data.result.brands.unshift({ id: null, name: '全部' })
      // 当前选中的品牌id，默认选中全部
      data.result.selectedBrand = null
      data.result.saleProperties.forEach(item => {
        item.properties.unshift({ id: null, name: '全部' })
        // 当前选中的分类id，默认选中全部
        item.selectedProp = null
      })
      // 数据返回后重新设置为false
      filterLoading.value = false
      filterData.value = data.result
    }
    )
  }
}, { immediate: true })

// 获取与筛选相关的请求参数
const getFilterParams = () => {
  const filterParams = { brandId: null, attrs: [] }
  // 品牌id
  filterParams.brandId = filterData.value.selectedBrand
  // 商品属性
  filterData.value.saleProperties.forEach((item) => {
    // item.selectedProp属性不为null说明当前属性集合中有属性被选中
    if (item.selectedProp) {
      const property = item.properties.find(prop => {
        return prop.id === item.selectedProp
      })
      filterParams.attrs.push({ groupName: item.name, propertyName: item.property })
    }
  })
  if (!filterParams.attrs.length) filterParams.attrs = null
  return filterParams
}

// 修改品牌
const changeBrand = (id) => {
  if (filterData.value.selectedBrand === id) return
  filterData.value.selectedBrand = id
  emit('filter-change', getFilterParams())
}

// 修改筛选条件
const changeProp = (item, id) => {
  if (item.selectedProp === id) return
  item.selectedProp = id
  emit('filter-change', getFilterParams())
}

</script>

<style lang="less" scoped>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
  .xtx-skeleton {
    padding: 10px 0;
  }
}
</style>