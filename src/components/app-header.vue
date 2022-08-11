<template>
  <header class='app-header'>
    <div class="container">
      <!-- logo区域 -->
      <h1 class="logo"><RouterLink to="/">小兔鲜</RouterLink></h1>
      <!-- 头部导航区域 -->
      <AppHeaderNav></AppHeaderNav>
      <!-- 搜索区域 -->
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜">
      </div>
      <!-- 购物车区域 -->
      <AppHeaderCart></AppHeaderCart>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<script setup>
import AppHeaderNav from './app-header-nav'
import AppHeaderCart from './app-header-cart'
</script>

<style scoped lang='less'>
.app-header {
  background: #fff;
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    a {
      display: block;
      height: 132px;
      width: 100%;
      // 将文字移出屏幕范围
      text-indent: -9999px;
      background: url(../assets/images/logo.png) no-repeat center 18px / contain;
    }
  }
  .search {
    width: 170px;
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;
    .icon-search {
      font-size: 18px;
      margin-left: 5px;
    }
    input {
      width: 140px;
      padding-left: 5px;
      color: #666;
    }
  }
}
</style>