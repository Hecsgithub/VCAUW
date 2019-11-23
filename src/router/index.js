import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
 import index from '@/components/index'
import Login from '@/components/Login'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      hidden: true,
      component: Login
    },
    {
      path: '/home',
      name: '',
      component: Home,
      hidden: true,
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: '主页',
          component: index,
          meta: {
            keepAlive: true
          }
        }
        ]
    }
    // ,
    // {
    //   path: '/home',
    //   component: Home,
    //   name: '文章管理',
    //   iconCls: 'fa fa-file-text-o',
    //   children: [
    //     {
    //       path: '/articleList',
    //       name: '文章列表',
    //       component: A,
    //       meta: {
    //         keepAlive: true
    //       }
    //     }, {
    //       path: '/postArticle',
    //       name: '发表文章',
    //       component: B,
    //       meta: {
    //         keepAlive: false
    //       }
    //     }, {
    //       path: '/blogDetail',
    //       name: '博客详情',
    //       component: C,
    //       hidden: true,
    //       meta: {
    //         keepAlive: false
    //       }
    //     }, {
    //       path: '/editBlog',
    //       name: '编辑博客',
    //       component: B,
    //       hidden: true,
    //       meta: {
    //         keepAlive: false
    //       }
    //     }
    //   ]
    // }, {
    //   path: '/home',
    //   component: Home,
    //   name: '用户管理',
    //   children: [
    //     {
    //       path: '/user',
    //       iconCls: 'fa fa-user-o',
    //       name: '用户管理',
    //       component: E
    //     }
    //   ]
    // }, {
    //   path: '/home',
    //   component: Home,
    //   name: '栏目管理',
    //   children: [
    //     {
    //       path: '/cateMana',
    //       iconCls: 'fa fa-reorder',
    //       name: '栏目管理',
    //       component: F
    //     }
    //   ]
    // }, {
    //   path: '/home',
    //   component: Home,
    //   name: '数据统计',
    //   iconCls: 'fa fa-bar-chart',
    //   children: [
    //     {
    //       path: '/charts',
    //       iconCls: 'fa fa-bar-chart',
    //       name: '数据统计',
    //       component: G
    //     }
    //   ]
    // }
  ]
})

