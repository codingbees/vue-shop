import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/style.css'

import ElementUI, {
  Message
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// axios.defaults.baseURL = `http://timemeetyou.com:8889/api/private/v1/`
// axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
// axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/login?username=admin&password=123456'
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.prototype.$message = Message

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
