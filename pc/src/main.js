import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import '@/assets/icon/iconfont.css'

import permission from '@/directive/permission/index.js' 

import App from './App'

import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
// import './mock' // simulation data

import * as filters from './filters' // global filters
Vue.use(Element, {
  size: Cookies.get('size') || 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

import ChoseUsers from '@/views/oa/flow/common/CChoseUsers.vue'
import ChoseDepts from '@/views/oa/flow/common/CChoseDepts.vue'
import ChoseUserStr from '@/views/oa/flow/common/CChoseUserStr.vue'
import ChoseDeptStr from '@/views/oa/flow/common/CChoseDeptStr.vue'
import ChoseDeptTreeStrExcludeJtgs from '@/views/oa/flow/common/CChoseDeptStrExcludeJtgs.vue'
import ChoseContact from '@/views/oa/flow/common/CChoseContact.vue'
import ChoseContactGroupModal from '@/views/oa/flowdesign/chose-contact/chose-contact-group-modal.vue'

Vue.use({
  install: function(Vue) {
    Vue.component('ChoseUsers', ChoseUsers)
    Vue.component('ChoseDepts', ChoseDepts)
    Vue.component('ChoseUserStr', ChoseUserStr)
    Vue.component('ChoseDeptStr', ChoseDeptStr)
    Vue.component('ChoseContact', ChoseContact)
    Vue.component('ChoseDeptTreeStrExcludeJtgs', ChoseDeptTreeStrExcludeJtgs)
    

    Vue.component('ChoseContactGroupModal', ChoseContactGroupModal)
  }
})

import FormMaking from '@jinzhitiankai/form-making'
import '@jinzhitiankai/form-making/dist/FormMaking.css'
Vue.use(FormMaking, {
  'funlist_api': '/api/oa/tablefun/funlist',
  'callback_default_api': '/api/oa/tablefun/callback'
})

Vue.directive('permission', permission)

import VueIconfont from 'vue-iconfont'

import './iconfont/iconfont.css'

import './iconfont/iconfont.js'

Vue.use(VueIconfont, [
  
  {
    tag: 'v-icon',
    prefix: 'v-icon',
    type: 'font'
  },

  
  {
    tag: 'v-svg-icon',
    prefix: 'v-icon',
    type: 'svg'
  }
])

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.isPc = true
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

