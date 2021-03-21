import Vue from 'vue'
import VueRouter from 'vue-router'

// Error: Avoided redundant navigation to current location: xxx 重复路由，即从a url访问a url
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register')
  },
  {
    path: '/home',
    component: () => import('../views/Home'), //后台主体框架
    redirect: '/system/welcome',
    children: [
      {
        path: '/system/welcome',
        name: 'Welcome',
        component: () => import('../views/Welcome')
      },
      {
        path: '/system/users',
        name: 'User',
        component: () => import('../views/system/User')
      },
      {
        path: '/system/roles',
        name: 'Role',
        component: () => import('../views/system/Role')
      },
      {
        path: '/system/menus',
        name: 'Menu',
        component: () => import('../views/system/Menu')
      },
      // 管理员业务相关页面
      {
        path: '/admin/classification',
        name: 'Classification',
        component: () => import('../views/knowledge/Classification')
      },
      {
        path: '/admin/filemanagement',
        name: 'FileManagement',
        component: () => import('../views/knowledge/FileManagement')
      },
      {
        path: '/admin/myknowledge',
        name: 'MyKnowledge',
        component: () => import('../views/knowledge/MyKnowledge')
      },
      {
        path: '/admin/preview',
        name: 'preview',
        component: () => import('@/views/knowledge/preview')
      },
      {
        path: '/admin/knowledgeinduction',
        name: 'KnowledgeInduction',
        component: () => import('../views/knowledge/KnowledgeInduction')
      },
      {
        path: '/admin/mynotes',
        name: 'MyNotes',
        component: () => import('../views/knowledge/MyNotes')
      },
      {
        path: '/admin/edit',
        name: 'edit',
        component: () => import('@/views/knowledge/edit'),
      },
      {
        path: '/admin/oss',
        name: 'OSSUpload',
        component: () => import('@/views/knowledge/OSSUpload')
      },
      {
        path: '/admin/ossManage',
        name: 'OSSManagement',
        component: () => import('@/views/knowledge/OSSManagement')
      },
      {
        path: '/admin/label',
        name: 'Label',
        component: () => import('@/views/knowledge/Label')
      },
      // 知识获取相关页面
      {
        path: '/obtain/search',
        name: 'Search',
        component: () => import('@/views/obtain/Search')
      },
      {
        path: '/obtain/obtainIndex',
        name: 'obtainIndex',
        component: () => import('@/views/obtain/obtainIndex')
      },
      {
        path: '/obtain/fileIndex',
        name: 'fileIndex',
        component: () => import('@/views/obtain/fileIndex')
      },
      // 错误页面
      {
        path: '/error/401',
        name: '401',
        component: () => import( '../views/error/401'),
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  // ???
  base: process.env.BASE_URL,
  routes
})

import store from '../store'

// 白名单页面
const whiteList = []

// 路由导航守卫
router.beforeEach((to, from, next) => {
  const token = LocalStorage.get(LOCAL_KEY_KNOWLEDGE_ACCESS_TOKEN)
  if (to.path === '/login') {
    if (!token) {
      return next()
    } else {
      return next({ path: '/home' })
    }
  }

  if (to.path === '/register') {
    return next()
  }

  if (to.path === '/error/401') {
    return next()
  }

  if (!token) {
    return next('/login')
  } else {
    // 判断是否有访问该路径的权限
    const urls = store.state.userInfo.url
    // 如果是管理员
    if (store.state.userInfo.isAdmin) {
      return next()
    } else {
      if (urls.indexOf(to.path) > -1 || whiteList.indexOf(to.path) > -1) {
        //则包含该元素
        window.sessionStorage.setItem('activePath', to.path)
        return next()
      } else {
        return next('/error/401')
      }
    }
  }
})

export default router
