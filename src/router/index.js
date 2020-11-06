import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import welcome from '../components/Welcome'
import Users from '../components/users/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import List from '../components/goods/List'
import Add from '../components/goods/Add'
import Params from '../components/goods/Params'
import Orders from '../components/order/Order'
import Reports from '../components/report/Report'

//全局配置路由
Vue.use(VueRouter)

//每个路由就是一个数组，路由存放于routers对象中
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
      }
    ]
  }
]

//把routers对象挂载到router
const router = new VueRouter({
  //mode: 'history',
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //访问登录页直接跳转
  if (to.path === '/login') return next()

  //获取token值
  const tokenStr = window.sessionStorage.getItem('token')

  //访问其他页面时判断其token值
  if (!tokenStr) return next('/login')
  next()
})

//返回
export default router
