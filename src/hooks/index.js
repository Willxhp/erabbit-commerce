// 自定义钩子函数
// useIntersectionObserver函数可以监测某个DOM元素是否处于浏览器可视区
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref } from 'vue'
import Message from '@/components/library/Message'

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
      threshold: 0, // threshold表示元素进入可视区页面的最小比例，大于最小比例时isIntersecting才为true
    }
  )
  return { target, result }
}

/**
 * 发送短信验证码
 * @param {Object} schema - 表单校验规则
 * @param {Object} formEl - 表单ref对象
 * @param {Object} form - 表单信息对象
 * @param {Function} apiFn - api接口函数
 * @returns 普通对象，send函数用于发送短信验证码，time用于显示倒计时
 */
export const useCode = (schema, form, formEl, apiFn) => {
  // 发送验证码60s后才可以重新发送
  const time = ref(0)
  // 使用@vueuse/core提供的useIntervalFn来实现time每隔1s自动减1
  // pause和resume是两个函数，分别用于关闭和开启定时器
  // useIntervalFn接收三个参数，回调函数，时间间隔和配置对象
  const { pause, resume } = useIntervalFn(
    () => {
      time.value--
      if (time.value <= 0) pause()
    },
    1000,
    {
      immediate: false, // 设置定时器不会立即开启，必须调用resume方法才会开启
    }
  )

  // 发送验证码
  const send = () => {
    // 对mobile表单项进行单独校验
    const valid = schema.mobile(form.mobile)
    if (valid === true) {
      // 手机号格式正确，发送请求获取短信验证码，同时开启定时器
      if (time.value === 0) {
        apiFn(form.mobile).then(() => {
          Message({ type: 'success', text: '验证码发送成功' })
          time.value = 60
          pause() // 先关闭定时器再开启定时器，以防重复开启定时器
          resume()
        }).catch(error => {
          Message({type: 'error', text: error.response.data.message || '验证码发送失败'})
        })
      }
    } else {
      // 手机号格式错误
      formEl.value.setFieldError('mobile', valid)
    }
  }
  return { time, send }
}
