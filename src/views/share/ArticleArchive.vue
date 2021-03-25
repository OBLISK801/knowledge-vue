<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识分享</el-breadcrumb-item>
      <el-breadcrumb-item>文章归档</el-breadcrumb-item>
    </el-breadcrumb>

  </div>
</template>

<script>
export default {
  name: 'ArticleArchive'
}
</script>

<style scoped>

</style>
