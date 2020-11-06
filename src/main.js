import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//全局样式导入
import './assets/css/global.css'

//导入第三方图标库
import './assets/fonts/iconfont.css'

//第三方插件导入
import TreeTable from 'vue-table-with-tree-grid'
import Echarts from 'echarts'

//element-ui引入(全部导入)
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//导入axios
import axios from 'axios'

//api根路径
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
axios.interceptors.request.use(config => {
  //为请求头添加token值
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.prototype.$echarts = Echarts

//注册第三方插件
Vue.component('tree-table', TreeTable)

new Vue({
  ElementUI,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
