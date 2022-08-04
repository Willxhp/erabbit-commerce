// vue插件，向全局注册组件或自定义指令
// 该文件作为自定义UI组件库的入口文件
import defaultImg from '@/assets/images/200.png'
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'

// 利用webpack提供的require.context()函数实现组件的批量自动导入
// require.context()会加载某一个目录下所有指定的文件，并返回一个导入函数
// require.context()函数接收三个参数，1. 文件目录 2. 是否加载子目录 3. 加载文件的正则或字符串匹配
// 返回的importFn函数有一个keys方法，调用该方法会返回所有匹配的文件路径组成的数组
// importFn本身就是一个导入函数，可以导入组件
const importFn = require.context('./', false, /\.vue$/)

export default {
  install(app) {
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)
    importFn.keys().forEach(key => {
      const component = importFn(key).default
      app.component(component.name, component)
    })
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