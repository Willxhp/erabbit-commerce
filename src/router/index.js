import { createRouter, createWebHashHistory } from 'vue-router'

// 路由组件采用路由懒加载的方式导入
// 一级路由
const Layout = () => import('@/views/Layout')
const LoginCallback = () => import('@/views/login/callback')
const Register = () => import('@/views/login/register.vue')

// 二级路由
const Home = () => import('@/views/home')
const topCategory = () => import('@/views/category')
const subCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods')
const Login = () => import('@/views/login')
const Cart = () => import('@/views/cart')

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
      },
      {
        path: 'cart',
        component: Cart
      }
    ],
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: LoginCallback
  },
  {
    path: '/register',
    component: Register
  }
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
