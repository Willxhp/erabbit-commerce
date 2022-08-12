<template>
  <div class="xtx-confirm" :class="{fade}">
    <div class="wrapper" :class="{fade}">
      <div class="header">
        <h3>{{title}}</h3>
        <a href="JavaScript:;" class="iconfont icon-close-new" @click="cancel"></a>
      </div>
      <div class="body">
        <i class="iconfont icon-warning"></i>
        <span>{{text}}</span>
      </div>
      <div class="footer">
        <XtxButton size="mini" type="gray" @click="cancel">取消</XtxButton>
        <XtxButton size="mini" type="primary" @click="confirm">确认</XtxButton>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'XtxConfirm'
}
</script>

<script setup>
import XtxButton from './xtx-button'
import { ref, onMounted } from 'vue'
const props = defineProps({
  title: {
    type: String,
    default: '温馨提示'
  },
  text: {
    type: String,
    default: ''
  },
  confirmCallback: {
    type: Function
  },
  cancelCallback: {
    type: Function
  }
})
// 控制面板的显示和隐藏
const fade = ref(false)
// 点击取消
const cancel = () => {
  props.cancelCallback()
}
// 点击确认
const confirm = () => {
  props.confirmCallback()
}
onMounted(() => {
  // 在组件刚挂载完毕后立刻显示组件不会触发过渡效果，需要用定时器设置一定的延迟
  setTimeout(() => {
    fade.value = true
  }, 0)
})
</script>

<style scoped lang="less">
.xtx-confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background: rgba(0, 0, 0, 0);
  &.fade {
    transition: all 0.4s;
    background: rgba(0, 0, 0, 0.5);
  }
  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    opacity: 0;
    &.fade {
      transition: all 0.4s;
      transform: translate(-50%, -50%);
      opacity: 1;
    }
    .header,
    .footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    .body {
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: right;
      .xtx-button {
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>