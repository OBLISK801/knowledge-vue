<template>
  <div>
    <el-card style="float: left; width: 250px; margin-right: 15px;">
      <div>
          <span style="font-size: 20px; font-weight: bold; color: red;"><i
            class="el-icon-s-flag"></i> 知识分类</span>
      </div>
      <el-divider style="margin: 5px;"></el-divider>
      <el-tree
        style="margin-top: 10px;"
        node-key="id"
        :data="data"
        :props="defaultProps"
        default-expand-all
        ref="tree">
      </el-tree>
    </el-card>
    <el-card>
      <div>
          <span style="font-size: 20px; font-weight: bold; color: red;"><i
            class="el-icon-medal"></i> 热门知识</span>
      </div>
      <el-divider style="margin: 5px; width: 300px;"></el-divider>
      <div>
        <div v-for="item in articleData">
          <el-row>
            <router-link :to="{path:'/obtain/obtainindex',query: {id: item.id}}" class="link-type">
              <span style="font-size: 20px; font-weight: bold;">{{item.title}}</span>
            </router-link>
          </el-row>
          <el-row>
            <el-col :span="18">
              <p style="letter-spacing: 1px;">{{item.summary}}</p>
            </el-col>
          </el-row>
          <el-row style="display: flex;align-items: center;">
            <el-avatar :size="30" :src=item.avatar
                       style="margin-right: 6px;"></el-avatar>
            <span style="color: #2d8cf0; margin-right: 10px;">{{item.username}}</span>
            <span style="margin-right: 10px;"><i class="el-icon-date" style="margin-right: 5px;"></i>{{item.createTime}}</span>
            <span style="margin-right: 30px;"><i class="el-icon-view" style="margin-right: 5px;"></i>{{ item.clickCount }}</span>
            <el-tag type="warning" v-for="item in item.tagName" style="margin-right: 5px;">{{ item }}</el-tag>
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
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'fileIndex',
  data() {
    const data = []
    return {
      data: JSON.parse(JSON.stringify(data)),
      defaultProps: {
        children: 'children',
        label: 'classificationName'
      },

      queryData: {
        pageNum: 1,
        pageSize: 5,
        classificationId: ''
      },
      total: 0,
      articleData:[]



    }
  },
  created () {
    this.queryData.classificationId = this.$route.query.id
    this.getClassificationTree()
    this.getArticle()
  },
  methods: {
    // 加载数据
    getClassificationTree () {
      this.$http.get('/admin/classification/tree').then(res => {
        if (res.data.code === 20000) {
          this.data = res.data.data.tree
          this.title=this.data[0].children
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取数据失败'
        })
      })
    },
    handleSizeChange (newSize) {
      this.queryData.pageSize = newSize
      this. getArticle()
    },
    handleCurrentChange (current) {
      this.queryData.pageNum = current
      this. getArticle()
    },
    getArticle() {
      this.queryData.classificationId = this.$route.query.id
      this.$http.get('/admin/tinymce/getArticleById',{params: this.queryData}).then(res => {
        if (res.data.code === 20000) {
          this.articleData = res.data.data.results
          this.total = res.data.data.total
          console.log(this.articleData)
        }
      }).catch()
    },


  }

}
</script>

<style>
.el-divider--horizontal {
  margin: 5px;
}
</style>
