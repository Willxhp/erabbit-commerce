<template>
  <div class="goods-tabs">
    <nav>
      <a :class="{active: activeName === 'GoodsDetail'}" @click="activeName = 'GoodsDetail'" href="javascript:;">商品详情</a>
      <a :class="{active: activeName === 'GoodsComment'}" @click="activeName = 'GoodsComment'" href="javascript:;">商品评价<span>({{goods.commentCount}})</span></a>
    </nav>
    <!-- 切换内容的地方，使用Component动态组件，根据is属性绑定的组件名进行切换 -->
    <!-- 使用component动态组件必须在配置项中注册组件 -->
    <component :is="activeName"></component>
  </div>
</template>

<script>
export default {
  name: 'GoodsTabs',
  components: {
    GoodsDetail,
    GoodsComment
  }
}
</script>

<script setup>
import GoodsDetail from './goods-detail'
import GoodsComment from './goods-comment'
import { ref, inject } from 'vue'
// 当前激活的tab标签
const activeName = ref('GoodsDetail')
const goods = inject('goods')
</script>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: '';
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>