<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{attrsText}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div class="loading" v-if="isLoading"></div>
      <GoodsSku :goods="goods" :skuId="skuId" @change="changeSku" v-else></GoodsSku>
      <XtxButton v-if="!isLoading" @click="submit" type="primary" size="mini" style="margin-left: 60px;">确认</XtxButton>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CartSku'
}
</script>

<script setup>
import GoodsSku from '@/views/goods/components/goods-sku'
import { ref } from 'vue'
import { findGoodsInfo } from '@/api/cart'
import { onClickOutside } from '@vueuse/core'
const props = defineProps({
  attrsText: {
    type: String,
    default: ''
  },
  skuId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['change'])
// 控制组价的显示与隐藏
const visible = ref(false)
// 显示加载的效果
const isLoading = ref(false)
// 商品的信息
const goods = ref(null)
// 打开
const open = () => {
  visible.value = true
  isLoading.value = true
  findGoodsInfo(props.skuId).then(data => {
    goods.value = data.result
    isLoading.value = false
  })
}
// 关闭
const close = () => {
  visible.value = false
  goods.value = null
}
// 切换
const toggle = () => {
  visible.value ? close() : open()
}
// 点击组件外部关闭显示
const target = ref(null)
onClickOutside(target, () => {
  close()
})

// 改变商品的规格会触发GoodsSku组件的change事件，传出最新的sku信息
// 改变商品的sku信息
const currSku = ref({})
const changeSku = (sku) => {
  currSku.value = sku
}
// 点击确认
const submit = () => {
  // 只有规格选择完整即sku信息不是空对象，且新选择的规格与当前规格不同时，点击确认才有效
  if (currSku.value.skuId && currSku.value.skuId !== props.skuId) {
    emit('change', currSku.value)
    close()
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: '';
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>