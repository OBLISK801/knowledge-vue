<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识获取</el-breadcrumb-item>
      <el-breadcrumb-item>我的下载</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        :data="fileTableData"
        style="width: 100%;height: auto;"
        border>
        <el-table-column prop="id" label="文件ID" width="70" align="center"></el-table-column>
        <el-table-column prop="fileName" label="文件名" align="center"></el-table-column>
        <el-table-column label="文件类型" width="100" align="center">
          <template slot-scope="scope">
            <div v-if=" getType(scope.row.fileName) === '.jpg'">
              <img src="/icon/c3.ico" alt="" height="50px" width="50px">
            </div>
            <div v-else-if=" getType(scope.row.fileName) === '.png'">
              <img src="/icon/c9.ico" alt="" height="50px" width="50px">
            </div>
            <div v-else-if=" getType(scope.row.fileName) === '.mp4'">
              <img src="/icon/c6.ico" alt="" height="50px" width="50px">
            </div>
            <div v-else-if=" getType(scope.row.fileName) === '.mp3'">
              <img src="/icon/c5.ico" alt="" height="50px" width="50px">
            </div>
            <div v-else-if=" getType(scope.row.fileName) === '.doc'">
              <img src="/icon/c1.ico" alt="" height="50px" width="50px">
            </div>
            <div v-else-if=" getType(scope.row.fileName) === '.xlsx'">
              <img src="/icon/c15.ico" alt="" height="50px" width="50px">
            </div>
            <div v-else-if=" getType(scope.row.fileName) === '.pptx'">
              <img src="/icon/c10.ico" alt="" height="50px" width="50px">
            </div>
            <div v-else-if=" getType(scope.row.fileName) === '.pdf'">
              <img src="/icon/c8.ico" alt="" height="50px" width="50px">
            </div>
            <div v-else>
              <img src="/icon/c7.ico" alt="" height="50px" width="50px">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalSize" label="文件大小" width="110" align="center"></el-table-column>
        <el-table-column prop="classificationId" label="所属分类" width="200" align="center"></el-table-column>
        <el-table-column prop="downloadTime" label="下载时间" width="200" align="center"></el-table-column>
        <el-table-column prop="uploadUser" label="上传用户" width="200" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="warning" round size="small" @click="preview(scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'MyDownload',
  data () {
    return {
      queryData: {
        pageNum: 1,
        pageSize: 6,
        username: ''
      },
      total: 0,
      fileTableData: []

    }
  },

  methods: {
    handleSizeChange (newSize) {
      this.queryData.pageSize = newSize
      this.getFile()
    },
    handleCurrentChange (current) {
      this.queryData.pageNum = current
      this.getFile()
    },
    getFile () {
      this.queryData.username = this.$store.state.userInfo.username
      this.$http.get('/admin/file/findByUser', { params: this.queryData }).then(res => {
        if (res.data.code === 20000) {
          this.fileTableData = res.data.data.results
          this.total = res.data.data.total
        }
      })
    },
    //获取文件后缀
    getType (filename) {
      const index1 = filename.lastIndexOf('.')
      const index2 = filename.length
      // console.log(type)
      return filename.substring(index1, index2)
    },
    //在线预览
    preview (row) {
      let a = this.$router.resolve({
        path: '/admin/preview',
        query: { id: row.id }
      })
      window.open(a.href, '_blank')
    },

  },

  created () {
    this.getFile()
  },

}
</script>

<style scoped>

</style>
