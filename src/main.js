import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入自定义UI组件库
import UI from '@/components/library'

// 导入重置样式和公用样式
import 'normalize.css'
import '@/assets/styles/common.less'

createApp(App).use(store).use(router).use(UI).mount('#app')
