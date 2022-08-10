<template>
  <div class="xtx-pagination">
    <a href="javascript:;" v-if="currentPage !== 1" @click="changePage(currentPage - 1)">上一页</a>
    <a href="javascript:;" v-else class="disabled">上一页</a>
    <span v-if="pager.start !== 1">...</span>
    <a href="javascript:;" @click="changePage(i)" :class="{ active: currentPage === i }" v-for="i in pager.btnArr" :key="i">{{ i }}</a>
    <span v-if="pager.end !== pager.pageCount">...</span>
    <a href="javascript:;" v-if="currentPage !== pager.pageCount" @click="changePage(currentPage + 1)">下一页</a>
    <a href="javascript:;" v-else class="disabled">下一页</a>
  </div>
</template>
<script>
export default {
  name: 'XtxPagination',
}
</script>

<script setup>
import { computed } from 'vue'
import { useVModel } from '@vueuse/core'
const props = defineProps({
  currentPage: {
    type: Number,
    default: 2,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 100,
  },
  btnCount: {
    type: Number,
    default: 5,
  },
})
const emit = defineEmits(['update:currentPage'])
const currentPage = useVModel(props, 'currentPage', emit)
// 页码信息，用于组件渲染
const pager = computed(() => {
  // 总页数
  const pageCount = Math.ceil(props.total / props.pageSize)
  // 偏移量
  let offset = Math.floor(props.btnCount / 2)
  // 起始页码
  let start = currentPage.value - offset
  // 结束页码
  let end = start + props.btnCount - 1
  // 处理非理想情况
  // 当起始页码小于1时
  if (start < 1) {
    start = 1
    end =
      start + props.btnCount - 1 > pageCount
        ? pageCount
        : start + props.btnCount - 1
  }
  // 当结束页码大于总页码数时
  if (end > pageCount) {
    end = pageCount
    start = end - props.btnCount + 1 > 1 ? end - props.btnCount + 1 : 1
  }
  // 用于渲染的页码数组
  const btnArr = []
  for (let i = start; i <= end; i++) {
    btnArr.push(i)
  }
  return {
    start,
    end,
    btnArr,
    pageCount,
  }
})
// 切换页码的方法
const changePage = (newPage) => {
  currentPage.value = newPage
}
</script>

<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
