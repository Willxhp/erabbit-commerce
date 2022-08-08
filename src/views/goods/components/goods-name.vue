<template>
  <p class="g-name">{{goods.name}}</p>
  <p class="g-desc">{{goods.desc}}</p>
  <p class="g-price">
    <span>{{goods.price}}</span>
    <span>{{goods.oldPrice}}</span>
  </p>
  <div class="g-service">
    <dl>
      <dt>促销</dt>
      <dd>12月好物放送，App领券购买直降120元</dd>
    </dl>
    <dl>
      <dt>配送</dt>
      <!-- 城市组件 -->
      <dd>至 <XtxCity :fullLocation="fullLocation" @change="changeCity"></XtxCity>
      </dd>
    </dl>
    <dl>
      <dt>服务</dt>
      <dd>
        <span>无忧退货</span>
        <span>快速退款</span>
        <span>免费包邮</span>
        <a href="javascript:;">了解详情</a>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'GoodName'
}
</script>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  goods: {
    type: Object,
    default: () => ({})
  }
})
// 若用户已经登录，则获取的商品详情信息中有用户保存的收货地址信息，需要将该信息传递后台和城市组件以显示默认地区
// 若用户未登录，则显示系统默认情况
const provinceCode = ref('110000')
const cityCode = ref('119900')
const countyCode = ref('110101')
const fullLocation = ref('北京市 市辖区 东城区')
// 若用户已经登录
if (props.goods.userAddresses) {
  const defaultAddr = props.goods.userAddresses.find(item => item.isDefault === 1)
  provinceCode.value = defaultAddr.provinceCode
  cityCode.value = defaultAddr.cityCode
  countyCode.value = defaultAddr.countyCode
  fullLocation.value = defaultAddr.fullLocation
}

// 城市选择完毕后触发的回调
const changeCity = (result) => {
  provinceCode.value = result.provinceCode
  cityCode.value = result.cityCode
  countyCode.value = result.countyCode
  fullLocation.value = result.fullLocation
}
</script>

<style lang="less" scoped>
.g-name {
  font-size: 22px;
}
.g-desc {
  color: #999;
  margin-top: 10px;
}
.g-price {
  margin-top: 10px;
  span {
    &::before {
      content: '¥';
      font-size: 14px;
    }
    &:first-child {
      color: @priceColor;
      margin-right: 10px;
      font-size: 22px;
    }
    &:last-child {
      color: #999;
      text-decoration: line-through;
      font-size: 16px;
    }
  }
}
.g-service {
  background: #f5f5f5;
  width: 500px;
  padding: 20px 10px 0 10px;
  margin-top: 10px;
  dl {
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      color: #666;
      &:last-child {
        span {
          margin-right: 10px;
          &::before {
            content: '•';
            color: @xtxColor;
            margin-right: 2px;
          }
        }
        a {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>