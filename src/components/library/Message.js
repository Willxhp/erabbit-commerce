// 实现使用函数调用XtxMessage组件的逻辑
import XtxMessage from './xtx-message.vue'
import { h, render } from 'vue'
// 创建容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)
// 设置定时器用于定时销毁组件
let timer = null
export default ({ text, type }) => {
  // h函数用于创建虚拟节点，第一个参数可以传入组件配置对象也可以传入标签名
  const vnode = h(XtxMessage, { type, text })
  // render函数用于将虚拟节点注入真实DOM中
  render(vnode, div)
  clearTimeout(timer)
  // 间隔3s将组件销毁
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
