<template>
  <div class="xtx-bread-item">
    <!-- 如果接收到to，表明需要作为RouterLink进行跳转 -->
    <router-link v-if="to" :to="to">
      <slot />
    </router-link>
    <!-- 如果未接收到to，则展示一个不能点击的span标签 -->
    <span v-else>
      <slot />
    </span>
  </div>
</template>
<script>
export default {
  name: 'XtxBreadItem',
  props: {
    to: {
      type: [String, Object],
    }
  }
}
</script>