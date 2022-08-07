<template>
  <!-- 左侧分类组件 -->
  <div class="home-category" @mouseleave="categoryId = null">
    <!-- 菜单 -->
    <ul class="menu">
      <li v-for="item in menuList" :key="item.id" @mouseenter="categoryId = item.id" :class="{active: categoryId === item.id}">
        <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        <template v-if="item.children">
          <RouterLink :to="`/category/sub/${sub.id}`" v-for="sub in item.children" :key="sub.id">
            {{ sub.name }}
          </RouterLink>
        </template>
        <!-- 骨架组件，当数据尚未返回时进行占位 -->
        <template v-else>
          <XtxSkeleton height="18px" width="60px" bg="rgba(255,255,255,0.2)" style="margin-right: 5px;"></XtxSkeleton>
          <XtxSkeleton height="18px" width="50px" bg="rgba(255,255,255,0.2)"></XtxSkeleton>
        </template>
      </li>
    </ul>
    <!-- 弹层 -->
    <div class="layer">
      <h4>{{currCategory && currCategory.id === 'brand' ? '品牌': '分类'}}推荐 <small>根据您的购买或浏览记录推荐</small></h4>
      <ul v-if="currCategory && currCategory.goods">
        <li v-for="item in currCategory.goods" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="name ellipsis-2">{{item.name}}</p>
              <p class="desc ellipsis">{{item.desc}}</p>
              <p class="price"><i>¥</i>{{item.price}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 品牌弹层 -->
      <!-- 根据当前选中的列表id判断是否需要显示品牌弹层 -->
      <ul v-if="currCategory && currCategory.id === 'brand'">
        <li class="brand" v-for="item in brand.brands" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="place"><i class="iconfont icon-dingwei"></i>{{item.place}}</p>
              <p class="name ellipsis">{{item.name}}</p>
              <p class="desc ellipsis-2">{{item.desc}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HomeCategory',
}
</script>
<script setup>
// HomeCategory组件的分类数据与顶级商品分类的数据一致，但是多了一个品牌项需要单独获取
import { useStore } from 'vuex'
import { computed, reactive, ref } from 'vue'
import { findBrand } from '@/api/home'
const store = useStore()

// 品牌相关数据
const brand = reactive({
  id: 'brand',
  name: '品牌',
  children: [{ id: 'brand-children', name: '品牌推荐' }],
  brands: []
})
// 列表数据
const menuList = computed(() => {
  const list = store.state.category.list.map((item) => ({
    id: item.id,
    name: item.name,
    // 防止初始化时没有children属性调用slice属性发生报错
    children: item.children?.slice(0, 2),
    goods: item.goods,
  }))
  list.push(brand)
  return list
})

// 获取当前分类
// 通过categoryId记录当前鼠标经过的分类，用计算属性currCategory获取当前分类对象，弹层直接遍历currCategory的goods属性
let categoryId = ref(null)
const currCategory = computed(() => {
  return menuList.value.find(item => item.id === categoryId.value)
})

// 获取品牌列表
findBrand().then(data => {
  brand.brands = data.result
})
</script>

<style lang="less" scoped>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  // 菜单样式
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
    // 骨架组件的闪动动画
    .xtx-skeleton {
      animation: fade 1s linear infinite alternate;
    }
    @keyframes fade {
      from {
        opacity: 0.2;
      }
      to {
        opacity: 1;
      }
    }
  }
  // 弹层样式
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
    }
    li.brand {
      height: 180px;
      a {
        align-items: flex-start;
        img {
          width: 120px;
          height: 160px;
        }
        .info {
          p {
            margin-top: 8px;
          }
          .place {
            color: #999;
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
</style>
