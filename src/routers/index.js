import Vue from "vue";
import Router from 'vue-router'
import LoginPage from '@/components/LoginPage'
Vue.use(Router)

const router = new Router({
  routes:[
    {
      path:'/login',
      name:LoginPage,
      component:LoginPage
    }
  ]
})
export default router