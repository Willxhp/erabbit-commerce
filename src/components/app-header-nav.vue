<template>
  <!-- 将头部导航提取为一个单独的组件，提供给头部和吸顶头部使用 -->
  <ul class="app-header-nav">
    <li class="home">
      <router-link to="/">首页</router-link>
    </li>
    <li v-for="item in list" :key="item.id" @mousemove="open(item.id)" @mouseleave="hide(item.id)">
      <!-- 点击顶级分类或二级分类跳转连接后需要将二级弹窗分类关闭，当鼠标移动时显示，鼠标移出时隐藏 -->
      <router-link :to="`/category/${item.id}`" @click="hide(item.id)">{{item.name}}</router-link>
      <!-- 通过动态绑定open类名来控制二级分类弹窗的显示与隐藏，而不是只采用hover -->
      <div class="layer" :class="{open: item.open}">
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <router-link :to="`/category/sub/${sub.id}`" @click="hide(item.id)">
              <img :src="sub.picture" alt="">
              <p>{{sub.name}}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'AppHeaderNav'
}
</script>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
const store = useStore()
// 获取顶级商品分类和二级商品分类
const list = computed(() => store.state.category.list)
// 展示二级分类弹窗
const open = id => {
  store.commit('category/open', id)
}
// 隐藏二级分类弹窗
const hide = id => {
  store.commit('category/hide', id)
}
</script>

<style scoped lang='less'>
.app-header-nav {
  width: 820px;
  display: flex;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
    }
  }
}
.layer {
  // 当具有open类名时才显示
  &.open {
    height: 132px;
    opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>