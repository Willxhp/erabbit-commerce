<template>
  <!-- 产品区块组件 -->
  <div class="home-product" ref="target">
    <HomePanel v-for="item in cate" :key="item.id" :title="item.name">
      <template #right>
        <div class="sub">
          <router-link :to="`/category/sub/${sub.id}`" v-for="sub in item.children" :key="sub.id">{{sub.name}}</router-link>
        </div>
        <XtxMore :path="`/category/${item.id}`"></XtxMore>
      </template>
      <div class="box">
        <router-link :to="`category/${item.id}`" class="cover">
        <!-- 由于产品区块组件高度较高，且含有的图片资源较多，为加快页面显示速度，对组件内的图片进行懒加载处理，
        当图片不在可视区内时不会加载图片 -->
          <img v-lazy="item.picture" alt="">
          <strong>
            <span>{{item.name}}馆</span>
            <span>{{item.saleInfo}}</span>
          </strong>
        </router-link>
        <ul class="goods-list">
          <li v-for="good in item.goods" :key="good.id">
            <HomeGoods :good="good" :category="item"></HomeGoods>
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>

</template>

<script>
export default {
  name: 'HomeProduct'
}
</script>

<script setup>
import HomeGoods from './home-goods'
import HomePanel from './home-panel'
import { ref } from 'vue'
import { findGoods } from '@/api/home'
import { useLazyData } from '@/hooks'
// 数据懒加载
// let cate = ref([])
// findGoods().then(data => {
//   cate.value = data.result
//   console.log(data.result)
// })
const { result: cate, target } = useLazyData(findGoods)
</script>

<style lang="less" scoped>
.home-product {
  background-color: #fff;
  height: 2900px;
  .sub {
    margin-bottom: 2px;
    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;
      &:hover {
        background: @xtxColor;
        color: #fff;
      }
      &:last-child {
        margin-right: 80px;
      }
    }
  }
  .box {
    display: flex;
    .cover {
      margin-right: 10px;
      width: 240px;
      height: 610px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      strong {
        display: flex;
        height: 66px;
        width: 240px;
        position: absolute;
        top: 50%;
        left: 0;
        font-weight: 400;
        font-size: 18px;
        line-height: 66px;
        span {
          color: #fff;
          height: 66px;
          width: 76px;
          background-color: rgba(0, 0, 0, 0.9);
          text-align: center;
          &:last-child {
            font-size: 18px;
            background-color: rgba(0, 0, 0, 0.7);
            flex: 1;
          }
        }
      }
    }
    .goods-list {
      width: 990px;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;
        &:nth-last-child(-n + 4) {
          margin-bottom: 0;
        }
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>