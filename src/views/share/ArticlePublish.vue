<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识分享</el-breadcrumb-item>
      <el-breadcrumb-item>文章发布</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form label-width="80" :model="tinymceData" :rules="tinymceDataRules">
        <el-row :gutter="4" style="margin-bottom: 10px;">
          <span style="font-size: 18px; font-weight: bold; margin-right: 30px;">文章分类:</span>
          <el-cascader
            style="width: 300px;"
            placeholder="请选择所归纳知识的分类"
            v-model="tinymceData.classificationId"
            :options="classificationData"
            :props="optionProps"
            @change="handleChange"></el-cascader>
          <el-button type="success" @click="complete" style="float: right;">保存文章</el-button>
          <el-button type="primary" @click="save" style="float: right;margin-right: 5px;">暂存草稿</el-button>
        </el-row>
        <el-row :gutter="4">
          <el-col :span="2">
            <el-form-item>
              <span style="font-size: 18px; font-weight: bold">文章标题:</span>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item prop="title">
              <el-input v-model="tinymceData.title" class="title"
                        style="font-size: 18px; font-weight: bold;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="4">
          <el-col :span="2">
            <el-form-item>
              <span style="font-size: 18px; font-weight: bold">文章摘要:</span>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item prop="summary">
              <el-input v-model="tinymceData.summary" class="title"
                        style="font-size: 18px; font-weight: bold;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <mavon-editor v-model="content" :ishljs="true" id="markdown"/>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArticlePublish',
  data () {
    return {
      // 操作富文本
      content: '', //富文本的内容
      tinymceData: {
        content: '',
        state: '',
        writeUser: '',
        classificationId: '',
        title: '',
        summary: '',
        isArticle: 1,
        isPublic: 0,
      },
      tinymceDataRules: {
        classificationId: [
          {
            required: true,
            message: '请选择文章分类',
            trigger: 'blur'
          },
        ],
        title: [
          {
            required: true,
            message: '请输入文章名',
            trigger: 'blur'
          },
        ]
      },
      classificationData: [],
      optionProps: {
        value: 'id',
        label: 'classificationName',
        children: 'children'
      },
    }
  },
  methods: {
    save () {
      this.tinymceData.content = this.content
      this.tinymceData.state = 0
      this.tinymceData.isArticle = 1
      this.tinymceData.isPublic = 0
      if (this.tinymceData.classificationId === '') {
        this.$message({
          type: 'info',
          message: '请先选择归纳总结所属的分类'
        })
        return
      }
      if (this.tinymceData.title === '') {
        this.$message({
          type: 'info',
          message: '请先填写文章名'
        })
        return
      }
      this.$http.post('/admin/tinymce/save', this.tinymceData).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type: 'success',
            message: '您的草稿已经保存'
          })
        }
      }).catch()
    },
    complete () {
      this.tinymceData.content = this.content
      this.tinymceData.state = 1
      this.tinymceData.isArticle = 1
      this.tinymceData.isPublic = 0
      if (this.tinymceData.classificationId === '') {
        this.$message({
          type: 'info',
          message: '请先选择归纳总结所属的分类'
        })
        return
      }
      if (this.tinymceData.title === '') {
        this.$message({
          type: 'info',
          message: '请先填写文章名'
        })
        return
      }
      this.$http.post('/admin/tinymce/complete', this.tinymceData).then(res => {
        if (res.data.code === 20000) {
          this.content = ''
          this.tinymceData = {
            content: '',
            state: '',
            writeUser: '',
            classificationId: '',
            fileName: ''
          }
          this.$message({
            type: 'success',
            message: '您的文章已保存至您的笔记中'
          })
        }
      })
    },
    // 获取用户暂存的草稿
    listContent () {
      this.tinymceData.isArticle = 1
      this.$http.get('/admin/tinymce/listContent', { params:
          { writeUser: this.tinymceData.writeUser,isArticle: this.tinymceData.isArticle }
      }).then(res => {
        if (res.data.code === 20000) {
          if (res.data.data !== null) {
            // console.log(res.data.data)
            this.content = res.data.data.content
            this.tinymceData.classificationId = res.data.data.classificationId
            this.tinymceData.title = res.data.data.title
            this.tinymceData.summary = res.data.data.summary
          }
        }
      }).catch()
    },
    // 加载级联选择器数据
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
    // 处理级联选择器数据
    fixData (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.fixData(data[i].children)
        }
      }
      return data
    },
    // 保存级联选择器数据
    handleChange (value) {
      this.tinymceData.classificationId = value[2]
    },

  },
  created () {
    this.tinymceData.writeUser = this.$store.state.userInfo.username
    this.getClassificationTree()
    this.listContent()
  }

}
</script>

<style>
#markdown.v-note-wrapper {
  min-height: 600px;
}
</style>
