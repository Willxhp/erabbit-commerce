<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑组件 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{
          goods.categories[1].name
        }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{
          goods.categories[0].name
        }}</XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures"></GoodsImage>
          <GoodsSales></GoodsSales>
        </div>
        <div class="spec">
          <!-- 商品名组件 -->
          <GoodsName :goods="goods"></GoodsName>
          <!-- 规格组件 -->
          <GoodsSku :goods="goods" @change="changeSku"></GoodsSku>
          <div style="display: flex; align-items: center">
            <!-- 数量选择组件 -->
            <XtxNumbox label="数量" v-model="num" :max="goods.inventory"></XtxNumbox>
            <span style="margin-left: 10px; color: #999">库存 {{ goods.inventory > 999 ? '999+' : goods.inventory }} 件</span>
          </div>
          <XtxButton type="primary" style="margin-top: 20px" @click="insertCart">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐组件 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs">
            <GoodsTabs></GoodsTabs>
          </div>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn></GoodsWarn>
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :type="1"></GoodsHot>
          <GoodsHot :type="2"></GoodsHot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Goods',
}
</script>

<script setup>
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import { ref, watch, nextTick, provide } from 'vue'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
const route = useRoute()
const store = useStore()
// 商品信息数据
const goods = ref(null)
// 向后代组件提供商品数据
provide('goods', goods)
// 展示的商品数量
const num = ref(1)

// 获取产品信息
const useGoods = () => {
  // 每当路由中的id变化时重新发送请求获取数据
  watch(
    () => route.params.id,
    (newVal) => {
      if (newVal && `/product/${newVal}` === route.path) {
        findGoods({ id: route.params.id }).then((data) => {
          console.log(data.result)
          // 每次获取数据后，先将goods重置为null，利用v-if将组件销毁，从而在新数据返回后触发所有子组件的setup函数
          goods.value = null
          nextTick(() => {
            goods.value = data.result
            defaultGoodsInfo = {
              price: goods.value.price,
              oldPrice: goods.value.oldPrice,
              inventory: goods.value.inventory,
            }
          })
        })
      }
    },
    { immediate: true }
  )
}
useGoods()

// 保存商品默认信息，当商品规格选择不完整时显示
let defaultGoodsInfo
// 保存商品sku信息
const currSku = ref({})
const changeSku = (sku) => {
  // 每当用户选择规格后会返回最新的sku信息，若规格选择不完整，返回的是空对象{}
  currSku.value = sku
  if (sku.skuId) {
    goods.value.price = sku.price
    goods.value.oldPrice = sku.oldPrice
    goods.value.inventory = sku.inventory
  } else {
    goods.value.price = defaultGoodsInfo.price
    goods.value.oldPrice = defaultGoodsInfo.oldPrice
    goods.value.inventory = defaultGoodsInfo.inventory
  }
}

// 加入购物车
const insertCart = () => {
  // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
  if (currSku.value.skuId) {
    // 判断规格是否选择完整
    if (num.value > goods.value.inventory) {
      return Message({text: '商品库存不足'})
    }
    const { id, name, mainPictures, price, inventory: stock } = goods.value
    const { skuId, specsText: attrsText } = currSku.value
    store.dispatch('cart/insertCart', {
      id,
      skuId,
      name,
      picture: mainPictures[0],
      price,
      nowPrice: price,
      selected: true,
      isEffective: true,
      count: num.value,
      attrsText,
      stock
    }).then(() => {
      Message({type: 'success', text: '商品加入购物车成功'})
    })
  } else {
    Message({ text: '请选择完整规格' })
  }
}
</script>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
