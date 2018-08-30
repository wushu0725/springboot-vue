import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import SysUser from '@/components/system/SysUser'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      }
    }
  ]
})


router.beforeEach((to, from, next) => {

  if (to.matched.some(r => r.meta.requireAuth)) {
    if (localStorage.getItem("token")) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

export default router
