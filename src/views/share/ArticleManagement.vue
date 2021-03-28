<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识分享</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="tinymceData"
                style="width: 100%;height: auto;"
                border>
        <el-table-column prop="id" label="文章ID" width="70" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>
        <el-table-column prop="writeUser" label="作者" width="120" align="center"></el-table-column>
        <el-table-column label="文章名">
          <template slot-scope="{row}">
            <router-link :to="{path:'/share/edit',query: {id: row.id}}" class="link-type">
              <span>{{ row.title }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column align="center">
<!--          <template slot="header" slot-scope="scope">-->
<!--            <el-input-->
<!--              v-model="search"-->
<!--              size="mini"-->
<!--              placeholder="输入关键字搜索"/>-->
<!--          </template>-->
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteTinymce(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:10px;"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pageNum"
        :page-sizes="[6, 10, 20, 30]"
        :page-size="queryData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArticleManagement',
  data() {
    return {
      tinymceData:[],
      search: '',
      queryData: {
        pageNum: 1,
        pageSize: 10,
        isArticle: 1
      },
      total: 0,

    }
  },
  created () {
    this.getTinymceData()
  },
  mounted () {
  },
  methods: {
    getTinymceData() {
      this.queryData.isArticle = 1
      this.$http.get('/admin/tinymce/listAll',{params:this.queryData}).then(res => {
        if (res.data.code === 20000) {
          this.tinymceData = res.data.data.results
          this.total = res.data.data.total
        }
      })
    },
    handleSizeChange (newSize) {
      this.queryData.pageSize = newSize
      this.getTinymceData()
    },
    handleCurrentChange (current) {
      this.queryData.pageNum = current
      this.getTinymceData()
    },
    edit(row) {
      this.$router.push({path:'/share/edit',query: {id: row.id}})
    },
    deleteTinymce(row) {
      this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        this.$http.delete('/admin/tinymce/delete',{params:{id: row.id}}).then(res => {
          if (res.data.code === 20000) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getTinymceData()
          }
        }).catch()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已经取消删除'
        })
      })




    },



  },
}
</script>

<style>
.el-table th.gutter{
  display: table-cell!important;
}
.link-type,
.link-type:focus {
  color: #337ab7;
  cursor: pointer;
}
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
</style>
