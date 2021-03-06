import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import {hasPermission} from './utils/permissionDirect'
// import echarts from 'echarts' 这样引入时：Cannot read property 'init' of undefined (this.$echarts.init(document.getElementById("loginReport")))
import * as echarts from 'echarts'
// 上传组件
import uploader from 'vue-simple-uploader'
//pdf
import print from '@/assets/js/print'
Vue.use(print)

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

import hljs from 'highlight.js' //导入代码高亮文件
import 'highlight.js/styles/monokai-sublime.css'  //导入代码高亮样式
//自定义一个代码高亮指令
Vue.directive('highlight',function (el) {
  let highlight = el.querySelectorAll('pre code');
  highlight.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})



Vue.use(uploader)

const Plugins = [hasPermission]
Plugins.map((plugin) => {
  Vue.use(plugin)
})

Vue.use(ElementUI)
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://localhost:8443/'

Vue.prototype.$echarts = echarts

// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = LocalStorage.get(LOCAL_KEY_KNOWLEDGE_ACCESS_TOKEN)
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
// axios.interceptors.response.use(response => {
//   const res = response.data
//   if (res.code === 20000) {
//     console.log("请求成功")
//     return response
//   }
//   if (res.data != null && res.data.errorCode === 20001) {
//     LocalStorage.clearAll()
//     return router.push('/login')
//   }
//   return response
// }, error => {
//   return Promise.reject(error)
// })
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

import Videojs from 'video.js'

import 'video.js/dist/video-js.css'

Vue.prototype.$video = Videojs

Vue.use(VideoPlayer)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
