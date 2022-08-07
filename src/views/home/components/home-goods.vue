<template>
  <!-- 单个商品展示组件 -->
  <div class="goods-items">
    <router-link :to="`/product/${good.id}`">
      <img v-lazy="good.picture" alt="" />
      <p class="name ellipsis-2">{{ good.name }}</p>
      <p class="desc ellipsis">{{ good.desc }}</p>
      <p class="price">&yen;{{ good.price }}</p>
    </router-link>
    <router-link :to="`/category/${category.id}`">
      <div class="extra">
        <span>找相似</span>
        <span>发现更多宝贝 &gt;</span>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'HomeGoods',
  props: {
    good: {
      type: Object,
      default: () => ({}),
    },
    category: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style lang="less" scoped>
.goods-items {
  position: relative;
  padding: 10px 30px;
  width: 240px;
  height: 300px;
  border: 1px solid transparent;
  overflow: hidden;
  a:first-child {
    img {
      height: 160px;
      width: 160px;
      display: block;
      margin: 0 auto;
    }
    p {
      margin-top: 6px;
      font-size: 16px;
      &.name {
        height: 44px;
      }
      &.desc {
        color: #666;
        height: 22px;
      }
      &.price {
        margin-top: 10px;
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
  &:hover {
    border-color: @xtxColor;
    .extra {
      transform: none;
    }
  }
  .extra {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 86px;
    width: 100%;
    background: @xtxColor;
    text-align: center;
    transform: translateY(87px);
    transition: all 0.5s;
    span {
      display: block;
      color: #fff;
      width: 120px;
      margin: 0 auto;
      line-height: 30px;
      &:first-child {
        font-size: 18px;
        border-bottom: 1px solid #fff;
        line-height: 40px;
        margin-top: 5px;
      }
    }
  }
}
</style>
