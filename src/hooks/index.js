// 自定义钩子函数
// useIntersectionObserver函数可以监测某个DOM元素是否处于浏览器可视区
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

/**
 * 实现组件数据的懒加载，当组件进入浏览器的可视区域时再发送Ajax请求数据
 * @param {Function} apiFn api接口函数
 * @returns 从后端返回的数据
 */
export const useLazyData = (apiFn) => {
  // 要检测的DOM元素
  const target = ref(null)
  // 待请求的数据
  const result = ref([])
  // stop可以用来停止监测
  const { stop } = useIntersectionObserver(
    target,
    // isIntersecting布尔值，表示当前元素是否处于浏览器可视区
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        // 当元素进入浏览器可视区时停止监测
        stop()
        // 当监视的元素处于可视区时，调用接口函数请求数据
        apiFn().then((data) => {
          result.value = data.result
        })
      }
    },
    // 接收的第三个参数是配置对象
    {
      threshold: 0 // threshold表示元素进入可视区页面的最小比例，大于最小比例时isIntersecting才为true
    }
  )
  return { target, result }
}
