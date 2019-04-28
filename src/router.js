import Vue from 'vue'
import Router from 'vue-router'
import authRouters from '@/modules/auth/router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...authRouters,
    { path: '', redirect: 'login' }
  ]
})
