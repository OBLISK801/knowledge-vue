<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识获取</el-breadcrumb-item>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>

    </el-card>
  </div>
</template>

<script>
// create mounted两者的区别
// vue路由中router-link传参方式以及参数的使用方法
// 怎么取消router-link文字下面的下划线
//  this.$router.push 传参
export default {
  name: 'index'
}
</script>

<style>

</style>
