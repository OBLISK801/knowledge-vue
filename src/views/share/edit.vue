<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识分享</el-breadcrumb-item>
      <el-breadcrumb-item>文章编辑</el-breadcrumb-item>
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
          <span style="font-size: 18px; font-weight: bold; margin-right: 30px; margin-left: 30px;">文章标签:</span>
          <el-select v-model="selections" multiple filterable placeholder="可以输入标签名自动检索" style="width: 300px;">
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
          <el-button type="success" @click="edit" style="float: right;">保存修改</el-button>
        </el-row>
        <el-row :gutter="4">
          <el-col :span="2">
            <el-form-item>
              <span style="font-size: 18px; font-weight: bold">文章标题:</span>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item prop="title">
              <el-input v-model="tinymceData.title" class="title" style="font-size: 18px; font-weight: bold;"></el-input>
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
              <el-input v-model="tinymceData.summary" class="title" style="font-size: 18px; font-weight: bold;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <mavon-editor v-model="content"  :ishljs = "true" id="markdown" />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'edit',
  data() {
    return {
      // 操作富文本
      content: '', //富文本的内容
      tinymceData: {
        content: '',
        state: '',
        writeUser: '',
        classificationId: '',
        title: '',
        summary: ''
      },
      tinymceDataRules: {
        classificationId: [
          { required: true, message: '请选择文章分类', trigger: 'blur' },
        ],
        title: [
          { required: true, message: '请输入文章名', trigger: 'blur' },
        ]
      },
      classificationData: [],
      optionProps: {
        value: 'id',
        label: 'classificationName',
        children: 'children'
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
        tinymceId: '',
        selections: [],
      },

    }
  },
  methods: {
    getContents() {
      this.$http.get('/admin/tinymce/listById', { params: { tinymceId: this.tinymceId,userName: this.$store.state.userInfo.username } }).then(res => {
        if (res.data.code === 20000) {
          if (res.data.data !== null) {
            this.content = res.data.data.content
            this.tinymceData.classificationId = res.data.data.classificationId
            this.tinymceData.title = res.data.data.title
            this.tinymceData.summary = res.data.data.summary
            this.selections = res.data.data.tags
          }
        }
      }).catch()
    },
    edit() {
      this.tinymceData.content = this.content
      this.tinymceData.state = 1
      this.tinymceData.id = this.tinymceId
      this.tinymceData.writeUser = this.$store.state.userInfo.username
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
      this.$http.post('/admin/tinymce/edit', this.tinymceData).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type:'info',
            message:'保存修改成功'
          })
          this.tinymceData = {
            id:'',
            content: '',
            state: '',
            writeUser: '',
            classificationId: '',
            title: '',
            summary: ''
          }
          this.addArticleTag(this.tinymceId)
          this.$router.push('/share/articleManagement')
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
    addArticleTag(tinymceId) {
      this.labelForm.tinymceId = tinymceId
      this.labelForm.selections = this.selections
      this.$http.post('/admin/tag/addArticleTag',this.labelForm).then(res => {
        if (res.data.code === 20000) {
          console.log("插入成功")
        }
      }).catch()
    },

  },
  created () {
    this.tinymceData.writeUser = this.$store.state.userInfo.username
    this.getClassificationTree()
    this.tinymceId = this.$route.query.id
    this.getContents()
    this.getTableData()
  }
}
</script>

<style>
#markdown.v-note-wrapper{
  min-height: 600px;
}
</style>
