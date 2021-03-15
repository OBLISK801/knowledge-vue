<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识存储</el-breadcrumb-item>
      <el-breadcrumb-item>我的资源</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-bottom: 8px; padding: 5px;" id="knowledgeId">
      <div style="display: flex;justify-content: space-between;align-items: center;" >
        <div style="float: left;">查询条件</div>
        <div style="float: right" v-if="searchShow">
          <el-button type="text" @click="clickSearchShow()">收起查询<i class="el-icon-arrow-up"></i></el-button>
        </div>
        <div style="float: right" v-if="!searchShow">
          <el-button type="text" @click="clickSearchShow()">展开查询<i class="el-icon-arrow-down"></i></el-button>
        </div>
      </div>
      <div v-if="searchShow">
        <el-form ref="queryForm" :model="queryFormData" label-width="80px">
          <el-row :gutter="4">
            <el-col :span="6">
              <el-form-item label="文件名">
                <el-input v-model="queryFormData.fileName" placeholder="请输入文件名查询"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="知识分类">
                <el-cascader
                  style="width: 380px;"
                  v-model="queryFormData.classificationId"
                  :options="classificationData"
                  :props="optionProps"
                  @change="handleChange"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="文件类型">
                <el-select v-model="queryFormData.fileType" placeholder="请选择文件类型进行查询">
                  <el-option
                    v-for="item in fileTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="4">
            <el-col :span="6">
              <el-form-item label="文件大小">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="上传时间">
                <el-date-picker
                  style="width: 380px;"
                  v-model="dateValue"
                  unlink-panels
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="info" @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card>
      <el-table
        :data="fileTableData"
        style="width: 100%;height: auto;"
        border>
        <el-table-column prop="id" label="文件ID" width="70" align="center"></el-table-column>
        <el-table-column prop="fileName" label="文件名" align="center"></el-table-column>
        <el-table-column label="文件类型" width="100" align="center">
          <template slot-scope = "scope">
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
        <el-table-column prop="uploadTime" label="上传时间" width="200" align="center"></el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button type="warning" round size="small" @click="preview(scope.row)">预览</el-button>
            <el-button type="success" round size="small" @click="downloadMyFile(scope.row)">下载</el-button>
            <el-button type="danger" round size="small" @click="deleteFile(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:10px;"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryFormData.pageNum"
        :page-sizes="[6, 10, 20, 30]"
        :page-size="queryFormData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'MyKnowledge',
  data () {
    return {
      dateValue: '',
      searchShow: false,
      queryFormData: {
        pageNum: 1,
        pageSize: 6,
        fileName: '',
        fileType: '',
        classificationId: '',
        totalSize: '',
        beginDate:'',
        endDate:''
      },
      fileTypeOptions: [
        { value: 'image', label: '图片' },
        { value: 'video', label: '视频' },
        { value: 'audio', label: '音频' },
        { value: 'application', label: '文档' }
      ],
      classificationData: [],
      optionProps: {
        value: "id",
        label: "classificationName",
        children: "children"
      },
      fileTableData:[],
      total: 0,
      deleteRow: {
        id: '',
        identifier: ''
      },
      downloadRow: {
        id: '',
        identifier: '',
        uploadUser: ''
      },

    }
  },
  created () {
    this.getClassificationTree()
    this.getFileList()
  },
  methods: {
    handleChange(value) {
      this.queryFormData.classificationId = value[2]
    },
    // 加载数据
    getClassificationTree () {
      this.$http.get('/admin/classification/tree').then(res => {
        if (res.data.code === 20000) {
          this.classificationData = this.fixData(res.data.data.tree)
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取数据失败'
        })
      })
    },
    // 处理数据
    fixData(data) {
      for(let i=0;i<data.length;i++){
        if(data[i].children.length<1){
          // children若为空数组，则将children设为undefined
          data[i].children=undefined;
        }else {
          // children若不为空数组，则继续 递归调用 本方法
          this.fixData(data[i].children);
        }
      }
      return data;
    },
    clickSearchShow () {
      this.searchShow = !this.searchShow
    },
    getFileList() {
      if (this.dateValue !== '' && this.dateValue !== null) {
        this.queryFormData.beginDate = this.dateValue[0]
        this.queryFormData.endDate = this.dateValue[1]
      }
      this.$http.get('/admin/file/findFileList', { params: this.queryFormData }).then(res => {
        if (res.data.code === 20000) {
          this.fileTableData = res.data.data.results
          this.total = res.data.data.total
          if (res.data.data.results.length === 0) {
            // 某页为空页且不是第一页时，加载上一页的数据
            if (this.queryFormData.pageNum >= 1) {
              this.queryFormData.pageNum = this.queryFormData.pageNum - 1
              this.getFileList()
            }
          }
        }
      }).catch()
    },
    handleSizeChange (newSize) {
      this.queryFormData.pageSize = newSize
      this.getFileList()
    },
    handleCurrentChange (current) {
      this.queryFormData.pageNum = current
      this.getFileList()
    },
    search() {
      console.log(this.queryFormData.fileType)
      this.getFileList()
    },
    reset() {
      this.queryFormData = {
          pageNum: 1,
          pageSize: 6,
          fileName: '',
          fileType: '',
          classificationId: '',
          totalSize: '',
          beginDate: '',
          endDate: ''
      }
      this.getFileList()
    },
    deleteFile(row) {
      this.deleteRow.id = row.id
      this.deleteRow.identifier = row.identifier
      this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        this.$http.delete('/admin/file/deleteFile', {data:this.deleteRow}).then(res => {
          if (res.data.code === 20000) {
            this.$message({
              type: 'success',
              message: '文件已经删除'
            })
            this.getFileList()
          }
        }).catch()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已经取消删除'
        })
      })
    },
    downloadMyFile(row) {
      this.downloadRow.id = row.id
      this.downloadRow.uploadUser = this.$store.state.userInfo.username
      let fileName = row.fileName
      axios({
        method: 'post',
        url: 'admin/file/download',
        data: this.downloadRow,
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
    //获取文件后缀
    getType(filename) {
      const index1 = filename.lastIndexOf('.')
      const index2 = filename.length
      const type = filename.substring(index1, index2)
      // console.log(type)
      return type;
    },
    //在线预览
    preview(row) {
      this.$router.push({ path: '/admin/preview', query: { id: row.id } })
    },

}



}
</script>

<style>
  #knowledgeId .el-card__body {
    padding: 5px;
  }
  .el-table th.gutter{
    display: table-cell!important;
  }
</style>
