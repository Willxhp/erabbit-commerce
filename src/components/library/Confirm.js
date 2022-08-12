// 实现Confirm确认框组件的函数式调用
import XtxConfirm from './xtx-confirm.vue'
import { h, render } from 'vue'

// 创建容器元素
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

export default ({ title, text }) => {
  // 返回一个Promise对象，用户点击确认按钮会返回成功的Promise，点击取消按钮会返回失败的Promise，两种情况都会销毁组件
  return new Promise((resolve, reject) => {
    // 点击确认的回调
    const confirmCallback = () => {
      // 销毁DOM元素
      render(null, div)
      resolve()
    }
    const cancelCallback = () => {
      // 销毁DOM元素
      render(null, div)
      reject(new Error('点击取消'))
    }
    // 创建虚拟节点
    // 将两个回调函数作为组件的props传入，以便于在组件内部可以调用到Promise的resolve和reject方法
    const vn = h(XtxConfirm, { title, text, confirmCallback, cancelCallback })
    // 将虚拟节点转换成真实DOM元素
    render(vn, div)
  })
}
