<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识获取</el-breadcrumb-item>
      <el-breadcrumb-item>知识下载</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container>
      <el-header style="background-color: #f2eada; height: auto;">
        <el-card style="width: 100%;">
          <el-tag style="margin: 5px;" type="success" >
            <el-button type="text" @click="getFile">全部</el-button>
          </el-tag>
          <el-tag v-for="item in classificationData" style="margin: 5px;">
            <el-button type="text" @click="findByClassId(item.id)">{{ item.classificationName }}</el-button>
          </el-tag>
        </el-card>
      </el-header>
      <el-container>
        <el-aside width="260px" style="background-color: #f2eada;">
          <el-card style="float: right; margin-top: 10px;">
            <div style="font-weight: bold;">相关资源标签</div>
            <el-tag v-for="item in tagData" style="margin: 10px;" >
              <el-button type="text" @click="findByTag(item.id)"> {{ item.tagName }}</el-button>
            </el-tag>
          </el-card>
        </el-aside>
        <el-main style="background-color: #f2eada;" id="main">
          <el-card style="float: left; width: 97%; margin-top: 10px; margin-left: 10px;">
            <div v-for="item in fileData">
              <el-row>
                <el-col :span="2">
                  <div v-if=" getType(item.fileName) === '.jpg'">
                    <img src="/icon/c3.ico" alt="" height="50px" width="50px">
                  </div>
                  <div v-else-if=" getType(item.fileName) === '.png'">
                    <img src="/icon/c9.ico" alt="" height="50px" width="50px">
                  </div>
                  <div v-else-if=" getType(item.fileName) === '.mp4'">
                    <img src="/icon/c6.ico" alt="" height="50px" width="50px">
                  </div>
                  <div v-else-if=" getType(item.fileName) === '.mp3'">
                    <img src="/icon/c5.ico" alt="" height="50px" width="50px">
                  </div>
                  <div v-else-if=" getType(item.fileName) === '.doc'">
                    <img src="/icon/c1.ico" alt="" height="50px" width="50px">
                  </div>
                  <div v-else-if=" getType(item.fileName) === '.xlsx'">
                    <img src="/icon/c15.ico" alt="" height="50px" width="50px">
                  </div>
                  <div v-else-if=" getType(item.fileName) === '.pptx'">
                    <img src="/icon/c10.ico" alt="" height="50px" width="50px">
                  </div>
                  <div v-else-if=" getType(item.fileName) === '.pdf'">
                    <img src="/icon/c8.ico" alt="" height="50px" width="50px">
                  </div>
                  <div v-else>
                    <img src="/icon/c7.ico" alt="" height="50px" width="50px">
                  </div>
                </el-col>
                <el-col :span="14">
                  <span style="font-weight: bold; font-size: 18px;">{{item.fileName}}</span>
                </el-col>
                <el-col :span="8">
                  <span style="float: right;">{{item.uploadTime}}</span>
                </el-col>
              </el-row>
              <el-row>
                <span>{{ (item.totalSize/1024/1024).toFixed(2)}}MB</span>
                <el-button style="float: right;" type="text" id="download" @click="downloadMyFile(item.id,item.fileName)">下载</el-button>
              </el-row>
              <el-divider></el-divider>
            </div>
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

        </el-main>
      </el-container>
    </el-container>




  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OpenResources',
  data () {
    return {
      classificationData: [],
      tagData: [],
      fileData: [],
      queryData: {
        pageNum: 1,
        pageSize: 8,
      },
      total: 0,
      downloadFile: {
        fileId: '',
        downloadUser: ''
      },

    }
  },
  methods: {
    getClassification () {
      this.$http.get('/admin/classification/listChildren').then(res => {
        if (res.data.code === 20000) {
          this.classificationData = res.data.data
        }
      }).catch()
    },
    getTag () {
      this.$http.get('/admin/tag/list').then(res => {
        if (res.data.code === 20000) {
          this.tagData = res.data.data
        }
      }).catch()
    },
    getFile() {
      this.$http.get('/admin/file/findPublicFile',{params:this.queryData}).then(res => {
        if (res.data.code === 20000) {
          this.fileData = res.data.data.results
          this.total = res.data.data.total
        }
      }).catch()
    },
    handleSizeChange (newSize) {
      this.queryData.pageSize = newSize
      this.getFile()
    },
    handleCurrentChange (current) {
      this.queryData.pageNum = current
      this.getFile()
    },
    getType(filename) {
      const index1 = filename.lastIndexOf('.')
      const index2 = filename.length
      return filename.substring(index1, index2);
    },
    downloadMyFile(fileId,name) {
      this.downloadFile.fileId = fileId
      this.downloadFile.downloadUser = this.$store.state.userInfo.username
      let fileName = name
      axios({
        method: 'post',
        url: 'admin/file/downloadFile',
        data: this.downloadFile,
        responseType: 'blob'
      }).then(res => {
        console.log(res)
        const data = res.data
        let url = window.URL.createObjectURL(data) // 将二进制文件转化为可访问的url
        const a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.download = fileName
        a.click()
        window.URL.revokeObjectURL(url)
      })
    },
    findByTag(id) {
      this.$http.get('/admin/file/findByTagId/' + id,{params:this.queryData}).then(res => {
        this.fileData = res.data.data.results
        this.total = res.data.data.total
      }).catch()
    },
    findByClassId(id) {
      this.$http.get('/admin/file/findByClassId/' + id,{params:this.queryData}).then(res => {
        this.fileData = res.data.data.results
        this.total = res.data.data.total
      }).catch()
    }

  },
  created () {
    this.getClassification()
    this.getTag()
    this.getFile()
  },

}
</script>

<style>
#main.el-main{
  padding: 0;
}
#download.el-button{
  padding: 0;
}
</style>
