import Vue from 'vue'
import Router from 'vue-router'
import { getToken } from '@/utils/auth'
import store from './../store'
import { Message } from 'element-ui'


Vue.use(Router)

const HelloWorld = resolve => {
  require.ensure(['@/components/HelloWorld'], () => {
    resolve(require('@/components/HelloWorld'));
  });
};

const Error404 = resolve => {
  require.ensure(['../components/404.vue'], () => {
    resolve(require('../components/404.vue'));
  });
};
// const Loading = resolve => {
//   require.ensure(['../components/loading.vue'], () => {
//     resolve(require('../components/loading.vue'));
//   });
// };

// const Login = resolve => {
//   require.ensure(['../views/login/index.vue'], () => {
//     resolve(require('../views/login/index.vue'));
//   });
// };

const router = new Router({
  mode: 'hash',
  routes: [
    // { path: '/loading', name: 'loading', component: Loading, meta: { title: '...' }},
    {
      path: '/login',
      component: () => import('@/views/login/index')
    },
    { path: '*', name: 'error', component: Error404, meta: { title: '页面不存在' } },
    {
      path: '/',
      name: 'workbench',
      component:() => import('@/views/home/index'),
      meta:{
        name:'工作台',
        requiresAuth:true
      }
    },
    {
      path: '/flowchose',
      name: 'flowchose',
      component:() => import('@/views/oa/CFlowChose'),
      meta:{
        requiresAuth:true,
        name:'发起流程'
      }
    },
    {
      path: '/flowwaiting',
      name: 'flowwaiting',
      component:() => import('@/views/oa/CFlowListWaiting'),
      meta:{
        requiresAuth:true,
        name:'待我处理',
        keepAlive:true
      }
    },
    {
      path: '/flowmessage',
      name: 'flowmessage',
      component:() => import('@/views/oa/CFlowListMessage'),
      meta:{
        requiresAuth:true,
        name:'通知我',
        keepAlive:true
      }
    }
     ,
    {
      path: '/flowcc',
      name: 'flowcc',
      component:() => import('@/views/oa/CFlowListCc'),
      meta:{
        requiresAuth:true,
        name:'抄送我',
        keepAlive:true
      }
    },
    {
      path: '/flowfinish',
      name: 'flowfinish',
      component:() => import('@/views/oa/CFlowListFinish'),
      meta:{
        requiresAuth:true,
        name:'我完成的',
        keepAlive:true
      }
    },
    {
      path: '/flowicreat',
      name: 'flowicreat',
      component:() => import('@/views/oa/CFlowListIcreat'),
      meta:{
        requiresAuth:true,
        name:'我创建的',
        keepAlive:true
      }
    },
    {
      path: '/flowneedcreat',
      name: 'flowneedcreat',
      component:() => import('@/views/oa/CFlowNeedCreat'),
      meta:{
        requiresAuth:true,
        name:'待我创建',
        keepAlive:true
      }
    },
    
    {
      path: '/flowdeal',
      name: 'flowdeal',
      component:() => import('@/views/oa/FlowDealer'),
      meta:{
        requiresAuth:true,
        name:'处理流程'
      }
    },
    {
      path: '/flowdetail',
      name: 'flowdetail',
      component:() => import('@/views/oa/FlowDetail'),
      meta:{
        requiresAuth:true,
        name:'流程明细'
      }
    },

  ]
})



router.beforeEach((to, from, next) => {
  //获取store里面的token
  //let token = store.state.token;

  let token = getToken();

  //判断要去的路由有没有requiresAuth 需要有权限的情况；
  if (to.meta.requiresAuth) {
    if (!!token) {

       if(!!store.getters.name){
        next();
       }else{

        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          // const roles = res.data.data.roles // note: roles must be a array! such as: ['editor','develop']
          // store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
          //   router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          //   next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          // })
          next();

        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err)
            next({ path: '/' })
          })
        })

       }

    
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next();//如果无需token,那么随它去吧|展示页面等等
  }

});


export default router;

