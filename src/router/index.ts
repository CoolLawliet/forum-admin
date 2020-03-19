import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/LayOut/Index.vue'

Vue.use(VueRouter);

/**
 * hidden: true                   如果hidden为true则在左侧菜单栏展示，否则不显示
 * name:'router-name'             路由名称，必须填写
 * meta : {
    title: 'title'               对应路由在左侧菜单栏的标题名称
    icon: 'icon-class'           对应路由在左侧菜单栏的图标样式，样式使用fontawesome图标库
  }
 **/

export const asyncRouterMap=[
  {
    path:'/',
    name:"dashboard",
    component:Layout,
    hidden:true,
    redirect:'/home',
    children:[
      {
        path:'/home',
        name:'home',
        meta:{
          title:'首页',icon:'fa fa-home'
        },
        component:()=>import('@/views/Home.vue')
      }
    ]
  },
  {
    path:'/dataManage',
    name:"dataManage",
    component:Layout,
    hidden: true,
    meta:{title:'内容管理',icon:'fa fa-pencil-square-o'},
    redirect:'/postData',
    children:[
      {
        path:'/postData',
        name:'postData',
        meta:{title:'帖子管理',icon:'fa fa-file-o'},
        component:()=>import('@/views/DataManage/PostData.vue')
      },
      {
        path:'/commentData',
        name:'commentData',
        meta:{title:'评论管理',icon:'fa fa-comments'},
        component:()=>import('@/views/DataManage/CommentData.vue')
      },
      {
        path:'/plateData',
        name:'plateData',
        meta:{title:'板块管理',icon:'fa fa-map-signs'},
        component:()=>import('@/views/DataManage/PlateData.vue')
      },
    ]
  },
  {
    path:'/userManage',
    name:"userManage",
    component:Layout,
    hidden: true,
    redirect:'/accountData',
    meta:{title:'账户管理',icon:'fa fa-user-plus'},
    children:[
      {
        path:'/accountData',
        name:'accountData',
        meta:{title:'管理员账户',icon:'fa fa-user-circle-o'},
        component:()=>import('@/views/UserManage/AccountData.vue')
      },
      {
        path:'/userData',
        name:'userData',
        meta:{title:'用户账户',icon:'fa fa-users'},
        component:()=>import('@/views/UserManage/UserData.vue')
      }
    ]
  },
  {
    path:'/user',
    component:Layout,
    redirect:'/userInfo',
    hidden: false,
    children:[
      {
        path:'/userInfo',
        name:'userInfo',
        meta: {title:'个人中心'},
        component:()=>import('@/views/UserManage/UserInfo.vue')
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    hidden: false,
    meta: {title: '404'},
    component: ()=>import('@/views/404.vue')
  },
  {
    path: "*",redirect: '/404'
  },
  {
    path: '/login',
    name:'login',
    hidden: false,
    meta: {title: '系统登录'},
    component: ()=>import('@/views/Login/Login.vue')
  },
  {
    path: '/password',
    name:'password',
    hidden: false,
    meta: {title: '找回密码'},
    component: ()=>import("@/views/Login/Password.vue")
  }
];


const router:any= new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes:asyncRouterMap
});

router.beforeEach((to:any,from:any,next:any)=>{
  const isLogin = localStorage.tsToken?true:false;
  if (to.path ==='/login' || to.path==='/password'){
    next();
  }else{
    isLogin?next():next('/login')
  }
});

export default router
