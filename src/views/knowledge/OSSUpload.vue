<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识存储</el-breadcrumb-item>
      <el-breadcrumb-item>OSS上传</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <h1>
          请选择所导入知识的分类
        </h1>
      </el-row>
      <el-row :gutter="1">
        <div>
          <el-cascader
            style="width:500px;"
            v-model="value"
            :options="classificationData"
            :props="optionProps"
            @change="handleChange"></el-cascader>
        </div>
      </el-row>
      <div style="margin: 10px;">
        <el-divider>活到老，学到老</el-divider>
      </div>
      <el-upload
        ref="upload"
        action=""
        :auto-upload="false"
        :before-upload="beforeUpload"
         multiple>
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-upload>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'OSSUpload',
  data() {
    return {
      classificationData: [],
      optionProps: {
        value: "id",
        label: "classificationName",
        children: "children"
      },
      classificationId: '',
      url: ''
    }
  },
  created () {
    this.getClassificationTree()
  },
  methods: {
    beforeUpload(file) {
      let fd = new FormData();
      fd.append('file',file);//传文件
      fd.append('classificationId',this.classificationId)
      fd.append('userName',this.$store.state.userInfo.username);//传其他参数
      this.$http.post('/admin/oss/upload',fd).then(res => {
        if (res.data.code === 20000) {
          this.url = res.data.data
          console.log(this.url)
        }
      }).catch()
    },
    submitUpload() {
      this.$refs.upload.submit();
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



  },

}
</script>

<style scoped>

</style>
