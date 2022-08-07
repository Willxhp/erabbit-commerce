import { createRouter, createWebHashHistory } from 'vue-router'

// 路由组件采用路由懒加载的方式导入
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const topCategory = () => import('@/views/category')
const subCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home,
      },
      {
        path: 'category/:id',
        component: topCategory,
      },
      {
        path: 'category/sub/:id',
        component: subCategory,
      },
      {
        path: 'product/:id',
        component: Goods
      }
    ],
  },
]

const router = createRouter({
  // 设置路由模式为hash模式
  history: createWebHashHistory(),
  routes,
  // 控制路由切换后页面的滚动位置
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
