<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识分享</el-breadcrumb-item>
      <el-breadcrumb-item>我的文章</el-breadcrumb-item>
    </el-breadcrumb>


        <el-card>
          <el-row>
            <el-col :span="18">
              <span style="font-size: 20px;font-weight: bold;color: #2d8cf0;">博客</span>
            </el-col>
            <el-col :span="6">
              <span style="float: right; font-size: 18px;">共{{ total }}篇</span>
            </el-col>
          </el-row>
          <el-divider></el-divider>
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
<!--              <el-col :span="6">-->
<!--                <img src="https://test-0230.oss-cn-beijing.aliyuncs.com/imagepng/913075.png" width="200" height="120"-->
<!--                     alt="">-->
<!--              </el-col>-->
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
        </el-card>

  </div>
</template>

<script>
export default {
  name: 'ArticleIndex',
  data () {
    return {
      queryData: {
        pageNum: 1,
        pageSize: 5,
        classificationId: ''
      },
      total: 0,
      articleData:[]

    }
  },
  methods: {
    handleSizeChange (newSize) {
      this.queryData.pageSize = newSize
      this. getArticle()
    },
    handleCurrentChange (current) {
      this.queryData.pageNum = current
      this. getArticle()
    },
    getArticle() {
      this.$http.get('/admin/tinymce/getArticle',{params: this.queryData}).then(res => {
        if (res.data.code === 20000) {
          this.articleData = res.data.data.results
          this.total = res.data.data.total
          console.log(this.articleData)
        }
      }).catch()

    },



  },
  created () {
    this.getArticle()
  },

}
</script>

<style>
#f1.el-footer {
  padding: 0;
}

#f2.el-footer {
  padding: 0;
}

#f3.el-footer {
  padding: 0;
}
</style>
