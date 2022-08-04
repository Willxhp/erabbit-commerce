<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render() {
    // XtxBread组件通过插槽插入XtxBreadItem组件，但是处于最后位置的Item不应该展示右箭头>
    // 通过render选项和h函数来动态创建组件显示的内容
    // 在new Vue({选项})用法中，render选项的优先级高于el和template选项
    // render函数的返回值会作为组件显示的内容
    // h函数用于创建VNode，render的过程中会将VNode通过diff算法转换为真实DOM
    // 用法
    // 1. 将XtxBread组件的template标签去除
    // 2. render函数的返回值就是组件内容
    // 3. vue2.0的h函数是通过向render函数传参进来的，vue3.0的h函数是从vue中导入进来
    // 4. h函数即createElement函数，用于创建VNode，第一个参数 标签名字，第二个参数 标签属性对象，第三个参数 子节点(或数组)
    // 具体步骤
    // 1. 创建xtx-bread父容器
    // 2. 获取默认插槽内容
    // 3. 去除xtx-bread-item组件的i标签，因该由render函数来组织
    // 4. 遍历插槽中的item，得到一个动态创建的节点，最后一个item不加i标签
    // 5. 把动态创建的节点渲染在xtx-bread标签中
    // items是一个数组，保存着插槽对应的VNode
    const items = this.$slots.default()
    const dymanicItems = []
    items.forEach((item, i) => {
      dymanicItems.push(item)
      // 除了插槽中的最后一个item组件外，每插入一个item组件，就插入一个<i></i>
      if (i < items.length - 1) {
        dymanicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    return h('div', { class: 'xtx-bread' }, dymanicItems)
  },
}
</script>

<style lang="less">
// 此处需要将scoped属性去除，使其可以作用到插槽组件
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>