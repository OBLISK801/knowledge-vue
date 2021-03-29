<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识存储</el-breadcrumb-item>
      <el-breadcrumb-item>知识导入</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <h1 style="float: left">
          请选择所导入知识的分类
        </h1>
        <h1 style="float: right; margin-right:500px;">
          请选择所导入知识的标签
        </h1>
      </el-row>
      <el-row :gutter="1">
        <div style="float: left;">
          <el-cascader
            style="width:500px;"
            v-model="value"
            :options="classificationData"
            :props="optionProps"
            @change="handleChange"></el-cascader>
        </div>
        <div style="float: right; margin-right: 208px;">
          <el-select v-model="selections" multiple filterable placeholder="可以输入标签名自动检索" style="width: 500px;">
            <el-option
              v-for="item in labelOptions"
              :key="item.id"
              :label="item.tagName"
              :value="item.id">
            </el-option>
            <el-pagination
              style="margin-top:10px;"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryData.pageNum"
              :page-sizes="[5, 10, 20, 30]"
              :page-size="queryData.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </el-select>
        </div>
      </el-row>
      <div style="margin: 10px;">
        <el-divider>上传文件前给文件规则命名，更有利于后面的查找哦！</el-divider>
      </div>
      <uploader
        ref="uploader"
        :options="options"
        :auto-start="false"
        :file-status-text="statusText"
        @file-added="onFileAdded"
        @file-progress="onFileProgress"
        @file-success="onFileSuccess"
        @file-error="onFileError">
        <!--不支持 HTML5 File API 的时候会显示。-->
        <uploader-unsupport></uploader-unsupport>
        <!--拖拽上传区域。-->
        <uploader-drop style="border: none;background-color: white;">
          <uploader-btn style="margin-right: 5px; background-color: #2d8cf0; color: white; border:#2d8cf0"
                        :attrs="attrs">
            <i class="el-icon-upload2"></i>&nbsp;选择文件
          </uploader-btn>
          <uploader-btn :directory="true" :single="true" style="background-color: green; color: white; border:#2d8cf0"
                        :attrs="attrs">
            <i class="el-icon-folder-add"></i>&nbsp;选择文件夹
          </uploader-btn>
        </uploader-drop>
        <!--文件、文件夹列表，同等对待。-->
        <uploader-list>
          <div slot-scope="props">
            <ul>
              <li v-for="file in props.fileList" :key="file.id" style="list-style-type:none;">
                <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
              </li>
              <div></div>
              <div v-if="!props.fileList.length">暂无待上传文件</div>
            </ul>
          </div>
        </uploader-list>
      </uploader>
    </el-card>
  </div>
</template>

<script>
import { ACCEPT_CONFIG } from '@/assets/js/config'
import SparkMD5 from 'spark-md5'

export default {
  name: 'FileManagement',
  computed: {
    uploader () {
      return this.$refs.uploader.uploader
    }
  },
  data () {
    return {
      value: [],
      classificationData: [],
      optionProps: {
        value: "id",
        label: "classificationName",
        children: "children"
      },
      classificationId: '',
      user: '',
      uploadBtn: false,
      options: {
        target: 'http://localhost:8443/admin/file/chunk',  // api
        chunkSize: '2048000',  // 分块大小
        fileParameterName: 'file',  // 上传文件时文件的参数名，默认file
        maxChunkRetries: 3,  // 最大自动失败重试上传次数
        testChunks: true,  // 是否开启服务器分片校验
        // 上传分片前, 会先向后端发送一个get请求, 该函数就是响应这个get请求 get option post
        /**
         * {"skipUpload":true,
         * "uploadedChunks":null,
         * "message":"完整文件已存在，直接跳过上传，实现秒传",
         * "location":"D:\\GraduationProject\\StageOne\\knowledge-back\\upload\\98cdefc73b772919bd77f510f47f81e5\\录制_2021_01_27_18_33_35_55.mp4"}
        */
         checkChunkUploadedByResponse: function (chunk, response_msg) {
          //console.log(response_msg)
          let objMessage = JSON.parse(response_msg);
          if (objMessage.skipUpload) {
            return true;
          }
          return (objMessage.uploadedChunks || []).indexOf(chunk.offset + 1) >= 0;
        },
        headers: {
          Authorization: LocalStorage.get(LOCAL_KEY_KNOWLEDGE_ACCESS_TOKEN)
        },
        query: {}
      },
      attrs: {
        accept: ACCEPT_CONFIG.getAll()
      },
      statusText: {
        success: '成功了',
        error: '出错了',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      },
      fileInfo: {
        fileName: '',
        identifier: '',
        totalSize: '',
        fileType: '',
        classificationId: '',
        uploadUser: ''
      },
      labelOptions:[],
      selections: [],
      //分页
      queryData: {
        pageNum: 1,
        pageSize: 5,
      },
      total: 0,
      labelForm: {
        identifier: '',
        selections: [],
      }


    }
  },
  created () {
    this.user = this.$store.state.userInfo.username
    this.getClassificationTree()
    this.getTableData()
  },
  methods: {
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
      for(var i=0;i<data.length;i++){
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
    handleChange(value) {
      this.classificationId = value[2]
    },
    // 选择文件后，开始md5的计算
    onFileAdded (file) {
      this.computeMD5(file)
    },
    // 上传成功
      /*
       第一个参数 rootFile 就是成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件；
       第二个参数 file 就是当前成功的 Uploader.File 对象本身；
       第三个参数就是 message 就是服务端响应内容，永远都是字符串；
       第四个参数 chunk 就是 Uploader.Chunk 实例，它就是该文件的最后一个块实例，如果你想得到请求响应码的话，chunk.xhr.status就是
       */
    onFileSuccess (rootFile, file, message, chunk) {
      this.fileInfo.fileName = file.name
      this.fileInfo.identifier = file.uniqueIdentifier
      this.fileInfo.totalSize = file.size
      this.fileInfo.fileType = file.fileType
      this.fileInfo.uploadUser = this.user
      this.fileInfo.classificationId = this.classificationId
      //console.log(this.fileInfo)
      this.$http.post("/admin/file/mergeFile",this.fileInfo).then(res => {
        if (res.data.code === 415) {
          this.$message({
            type: 'warning',
            message: '"合并操作未成功，结果码："+responseData.data.code'
          })
          // 调用插入标签的函数
        }
      }).catch()
      this.addFileTag(file.uniqueIdentifier)
    },
    // 插入标签
    addFileTag(identifier) {
      this.labelForm.identifier = identifier
      this.labelForm.selections = this.selections
      this.$http.post('/admin/tag/addFileTag',this.labelForm).then(res => {
        if (res.data.code === 20000) {
          console.log("插入成功")
        }
      }).catch()
    },
    onFileProgress (rootFile, file, chunk) {
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    onFileError (rootFile, file, response, chunk) {
      this.$message({
        message: response,
        type: 'error'
      })
    },
    computeMD5 (file) {
      let fileReader = new FileReader()
      let time = new Date().getTime()
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000
      let chunks = Math.ceil(file.size / chunkSize)
      let spark = new SparkMD5.ArrayBuffer()
      file.pause()
      loadNext()
      fileReader.onload = e => {
        spark.append(e.target.result)
        currentChunk++
        if (currentChunk < chunks) {
          console.log(`第${currentChunk}分片解析完成, 开始第${currentChunk + 1} / ${chunks}分片解析`)
          loadNext()
        } else {
          let md5 = spark.end()
          this.computeMD5Success(md5, file)
          spark.destroy() // 释放缓存
          console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`)
        }
      }
      fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        file.cancel()
      }

      function loadNext () {
        let start = currentChunk * chunkSize
        let end =
          start + chunkSize >= file.size ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },
    computeMD5Success (md5, file) {
      // 将自定义参数直接加载uploader实例的opts上
      Object.assign(this.uploader.opts, {
        query: {
          user: this.user,
          classificationId: this.classificationId
        }
      })
      file.uniqueIdentifier = md5 // 将文件md5赋值给文件唯一标识
      file.resume()
    },
    error (msg) {
      this.$notify({
        title: '错误',
        message: msg,
        type: 'error',
        duration: 2000
      })
    },
    // 获取标签
    getTableData () {
      this.$http.get('/admin/tag/listAll', { params: this.queryData }).then(res => {
        if (res.data.code === 20000) {
          this.labelOptions = res.data.data.results
          this.total = res.data.data.total
        }
      }).catch()
    },
    handleSizeChange (newSize) {
      this.queryData.pageSize = newSize
      this.getTableData()
    },
    handleCurrentChange (current) {
      this.queryData.pageNum = current
      this.getTableData()
    },



  }
}
</script>

<style scoped>

</style>
