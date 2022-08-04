// vue插件，向全局注册组件或自定义指令
// 该文件作为自定义UI组件库的入口文件
import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'
import defaultImg from '@/assets/images/200.png'

export default {
  install(app) {
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
    defineDirective(app)
  }
}

// 注册全局自定义指令
const defineDirective = app => {
  // 图片懒加载指令 v-lazy="src"
  // 图片懒加载原理，当图片的请求地址返回后，先不赋值给图片的src属性，而是将其储存起来，当图片元素进入可视区时
  // 再将地址赋值给图片的src属性
  app.directive('lazy', {
    // el是指令绑定的DOM元素，binding中有传入指令的相关信息
    mounted(el, binding) {
      // IntersectionObserver是内置构造函数，用于监视某个DOM元素是否处于可视区，接受两个参数
      // vueuse中的useIntersectionObserver的Composition API就是基于此进行封装的
      // observer对象有两个方法，observe开启监视，unobserve关闭监视
      const observer = new IntersectionObserver(([{isIntersecting}]) => {
        if (isIntersecting) {
          // 当图片进入可视区时关闭监视
          observer.unobserve(el)
          // 实现图片懒加载
          el.src = binding.value
          // 当图片地址失效时，让图片加载默认图片
          el.onerror = () => {
            el.src = defaultImg
          }
        }
      }, {
        threshold: 0
      })
      // 开启监视
      observer.observe(el)
    }
  })
}