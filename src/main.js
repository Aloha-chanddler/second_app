import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from '@/routers/index'
import './plugins/element'
import 'font-awesome/css/font-awesome.css'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
