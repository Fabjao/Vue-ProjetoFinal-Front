import Vue from 'vue'
import Router from 'vue-router'
import { AUTH_TOKEN } from '@/plugins/apollo'
import AuthService from '@/modules/auth/services/auth-service'
import authRouters from '@/modules/auth/router'
import dashboardRouters from '@/modules/Dashboard/router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...authRouters,
    ...dashboardRouters,
    { path: '', redirect: 'login' }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    const token = window.localStorage.getItem(AUTH_TOKEN)
    const loginRoute = {
      path: '/login',
      query: { redirect: to.path }
    }
    if (token) {
      try {
        await AuthService.user({ fetchPolicy: 'network-only' })
        return next()
      } catch (error) {
        console.log('Auto login Error: ', error)
        return next(loginRoute)
      }
    }
    return next(loginRoute)
  }
  next()
})

export default router
