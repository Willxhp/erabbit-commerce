<template>
  <div class="xtx-checkbox" @click="changeCheck()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </div>
</template>

<script>
export default {
  name: 'XtxCheckbox'
}
</script>

<script setup>
// 手动实现复选框组件的双向数据绑定 v-model语法糖相当于 :modelValue="checked" @update:modelValue="checked=$event"
/* const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])
const changeCheck = () => {
  emit('update:modelValue', !props.modelValue)
} */
// 利用 @vueuse/core 库实现组件的双向数据绑定
import { useVModel } from '@vueuse/core'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'change'])
const checked = useVModel(props, 'modelValue', emit)
const changeCheck = () => {
  let newVal = !checked.value
  // 对checked值进行修改会直接通知父组件
  checked.value = newVal
  // 让组件支持change事件
  emit('change', newVal)
}

</script>

<style lang="less" scoped>
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  &:hover {
    cursor: pointer;
  }
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>