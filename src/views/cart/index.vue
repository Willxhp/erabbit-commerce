<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <XtxCheckbox :modelValue="store.getters['cart/isCheckAll']" @change="checkAll">全选</XtxCheckbox>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 购物车中没有商品时的占位组件 -->
          <tbody v-if="validList.length === 0">
            <tr>
              <td colspan="6">
                <CartNone></CartNone>
              </td>
            </tr>
          </tbody>
          <!-- 有效商品 -->
          <tbody>
            <tr v-for="goods in validList" :key="goods.skuId">
              <td>
                <XtxCheckbox :modelValue="goods.selected" @change="checkOne(goods.skuId, $event)" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${goods.id}`">
                    <img :src="goods.picture" alt="">
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{goods.name}}</p>
                    <!-- 选择规格组件 -->
                    <CartSku @change="updateCartSku(goods.skuId, $event)" :attrsText="goods.attrsText" :skuId="goods.skuId"></CartSku>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{goods.nowPrice}}</p>
                <!-- goods.price是加入购物车时的价格，goods.nowPrice是当前的价格 -->
                <p v-if="goods.nowPrice < goods.price">比加入时降价 <span class="red">&yen;{{goods.price - goods.nowPrice}}</span></p>
              </td>
              <td class="tc">
                <XtxNumbox :modelValue="goods.count" @change="changeCount(goods.skuId, $event)" />
              </td>
              <td class="tc">
                <p class="f16 red">&yen;{{goods.count * goods.nowPrice}}</p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a class="green" href="javascript:;" @click="deleteCart(goods.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="invalidList.length !== 0">
            <tr>
              <td colspan="6">
                <h3 class="tit">失效商品</h3>
              </td>
            </tr>
            <tr v-for="goods in invalidList" :key="goods.skuId">
              <td>
                <XtxCheckbox style="color:#eee;" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${goods.id}`">
                    <img :src="goods.picture" alt="">
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{goods.name}}</p>
                    <p class="attr">{{goods.attrsText}}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{goods.nowPrice}}</p>
              </td>
              <td class="tc">{{goods.count}}</td>
              <td class="tc">
                <p>&yen;{{goods.nowPrice * goods.count}}</p>
              </td>
              <td class="tc">
                <p><a class="green" href="javascript:;" @click="deleteCart(goods.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox :modelValue="store.getters['cart/isCheckAll']" @change="checkAll">全选</XtxCheckbox>
          <a href="javascript:;" @click="batchDeleteCart(false)">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="batchDeleteCart(true)">清空失效商品</a>
        </div>
        <div class="total">
          共 {{store.getters['cart/validTotal']}} 件商品，已选择 {{store.getters['cart/selectedTotal']}} 件，商品合计：
          <span class="red">¥{{store.getters['cart/selectedAccount']}}</span>
          <XtxButton type="primary">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant></GoodRelevant>
    </div>
  </div>
</template>
<script>
export default {
  name: 'XtxCartPage'
}
</script>

<script setup>
import GoodRelevant from '@/views/goods/components/goods-relevant'
import CartNone from './components/cart-none'
import CartSku from './components/cart-sku'
import { useStore } from 'vuex'
import { computed } from 'vue'
import Confirm from '@/components/library/Confirm'
const store = useStore()
const validList = computed(() => store.getters['cart/validList'])
const invalidList = computed(() => store.getters['cart/invalidList'])

// 单选操作
const checkOne = (skuId, selected) => {
  store.dispatch('cart/updateCart', { skuId, selected })
}
// 全选操作
const checkAll = (selected) => {
  store.dispatch('cart/checkAllCart', selected)
}
// 删除操作
const deleteCart = (skuId) => {
  Confirm({ text: '确认从购物车中删除该商品吗？' }).then(() => {
    store.dispatch('cart/deleteCart', skuId)
  }).catch(() => { })
}
// 批量删除选中的商品或无效的商品
const batchDeleteCart = (isClear) => {
  Confirm({ text: `确认删除${isClear ? '失效' : '选中'}的商品吗？` }).then(() => {
    store.dispatch('cart/batchDeleteCart', isClear)
  }).catch(() => { })
}
// 修改商品数量
const changeCount = (skuId, count) => {
  store.dispatch('cart/updateCart', {skuId, count})
}

// 更新商品的sku信息
const updateCartSku = (oldSkuId, newSku) => {
  store.dispatch('cart/updateCartSku', {oldSkuId, newSku})
}
</script>

<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>