import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from '@/routers/index'
import './plugins/element'
import 'font-awesome/css/font-awesome.css'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置请求拦截器，添加token令牌，保证拥有获取数据的权限
// axios请求拦截 为每次API的请求挂载一个包含token的authorization字段的
axios.interceptors.request.use(config=>{
  // 为请求头添加token的authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
