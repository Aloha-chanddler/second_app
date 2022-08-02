import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from '@/routers/index'
import './plugins/element'
import 'font-awesome/css/font-awesome.css'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
