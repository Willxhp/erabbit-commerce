<template>
  <div class='sub-sort'>
    <div class="sort">
      <a href="javascript:;" :class="{active: sortParams.sortField === null}" @click="changeSort(null)">默认排序</a>
      <a href="javascript:;" :class="{active: sortParams.sortField === 'publishTime'}" @click="changeSort('publishTime')">最新商品</a>
      <a href="javascript:;" :class="{active: sortParams.sortField === 'orderNum'}" @click="changeSort('orderNum')">最高人气</a>
      <a href="javascript:;" :class="{active: sortParams.sortField === 'evaluateNum'}" @click="changeSort('evaluateNum')">评论最多</a>
      <a href="javascript:;" @click="changeSort('price')">
        价格排序
        <i class="arrow up" :class="{active: sortParams.sortField === 'price' && sortParams.sortMethod === 'asc'}" />
        <i class="arrow down" :class="{active: sortParams.sortField === 'price' && sortParams.sortMethod === 'desc'}" />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @change="changeCheck" v-model="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox @change="changeCheck" v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubSort'
}
</script>

<script setup>
import { reactive } from 'vue'
const emit = defineEmits(['sort-change'])
// 商品列表排序参数
const sortParams = reactive({
  onlyDiscount: false, // 只显示特惠
  inventory: false, // 是否有库存
  sortField: null, // 可选值 publishTime, orderNum, price, evaluateNum
  sortMethod: null // 排序规则 asc正序，desc倒序，默认为desc
})
// 修改排序规则
const changeSort = (params) => {
  if (params === 'price') {
    sortParams.sortField = 'price'
    if (!sortParams.sortMethod) {
      // 如果是第一次点击价格排序，则设置为降序
      sortParams.sortMethod = 'desc'
    } else {
      sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
    }
    emit('sort-change', sortParams)
  } else {
    if (sortParams.sortFieled === params) return
    sortParams.sortField = params
    sortParams.sortMethod = null
    emit('sort-change', sortParams)
  }
}
// 复选框点击事件
const changeCheck = () => {
  emit('sort-change', sortParams)
}
</script>

<style lang="less" scoped>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>