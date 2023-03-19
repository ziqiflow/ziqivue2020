// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// import Cookies from 'js-cookie'

import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element);
Vue.use(Element, {
  size:  'medium', // set element-ui default size
})

import App from './App'
import router from './router'
import store from './store'

import FormMaking from '@jinzhitiankai/form-making'
import '@jinzhitiankai/form-making/dist/FormMaking.css'
Vue.use(FormMaking)



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


import { NavBar } from 'vant';
Vue.use(NavBar);



// import ChoseUsers from '@/views/oa/common/CChoseUsers.vue';

import ChoseUsers from '@/views/oa/common/CChoseUsers.vue';
import ChoseDepts from '@/views/oa/common/CChoseDepts.vue';
import ChoseUserStr from '@/views/oa/common/CChoseUserStr.vue';
import ChoseDeptStr from '@/views/oa/common/CChoseDeptStr.vue';
import ChoseDeptTreeStrExcludeJtgs from '@/views/oa/common/CChoseDeptStrExcludeJtgs.vue'

import ChoseContact from '@/views/oa/common/CChoseContact.vue'
import ChoseContactGroupModal from '@/views/oa/flowdesign/chose-contact/chose-contact-group-modal.vue'




Vue.use({
  install:function(Vue){
    Vue.component('ChoseUsers',ChoseUsers);
    Vue.component('ChoseDepts',ChoseDepts);
    Vue.component('ChoseUserStr',ChoseUserStr);
    Vue.component('ChoseDeptStr',ChoseDeptStr);

    Vue.component('ChoseContact', ChoseContact)
    Vue.component('ChoseDeptTreeStrExcludeJtgs', ChoseDeptTreeStrExcludeJtgs)
    Vue.component('ChoseContactGroupModal', ChoseContactGroupModal)



  }
});


Vue.config.productionTip = false
Vue.prototype.isPc=false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
