import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './assets/sass/style.sass'
import './assets/js/rem.js'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
