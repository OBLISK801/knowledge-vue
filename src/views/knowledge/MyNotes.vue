<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识存储</el-breadcrumb-item>
      <el-breadcrumb-item>我的笔记</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form inline>
        <el-form-item>
          <el-input placeholder="检索笔记" v-model="queryData.searchText" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchText"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tinymceData"
                style="width: 100%;height: auto;"
                border>
        <el-table-column prop="id" label="笔记ID" width="70" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>
        <el-table-column prop="writeUser" label="作者" width="120" align="center"></el-table-column>
        <el-table-column label="笔记名">
          <template slot-scope="{row}">
            <router-link :to="{path:'/admin/edit',query: {id: row.id}}" class="link-type">
              <span>{{ row.title }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="笔记标签">
          <template slot-scope="scope">
            <!--            <el-tag v-for="item in scope.row.tags" style="margin-right: 3px;" type="success">{{labelMap.get(item)}}</el-tag>-->
            <el-tag v-for="item in scope.row.tagName" style="margin-right: 3px;" type="success">{{ item }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="scope">
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row)" type="primary">编辑</el-button>
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
  name: 'MyNotes',
  data () {
    return {
      tinymceData: [],
      search: '',
      queryData: {
        pageNum: 1,
        pageSize: 10,
        isArticle: 0,
        username: '',
        searchText: ''
      },
      total: 0,
      labelData: [],
      labelMap: new Map(),

    }
  },
  created () {
    this.getTinymceData()
    this.getLabel()
  },
  mounted () {
  },
  methods: {
    getTinymceData () {
      this.queryData.isArticle = 0
      this.queryData.username = this.$store.state.userInfo.username
      this.$http.get('/admin/tinymce/listAll', { params: this.queryData }).then(res => {
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
    edit (row) {
      this.$router.push({
        path: '/admin/edit',
        query: { id: row.id }
      })
    },
    deleteTinymce (row) {
      this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        this.$http.delete('/admin/tinymce/delete', { params: { id: row.id } }).then(res => {
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
    getLabel () {
      this.$http.get('/admin/tag/list').then(res => {
        if (res.data.code === 20000) {
          this.labelData = res.data.data
          for (let i = 0; i < this.labelData.length; i++) {
            this.labelMap.set(this.labelData[i].id, this.labelData[i].tagName)
          }
        }
      }).catch()
    },
    searchText () {
      this.getTinymceData()
    },
    resetSearch () {
      this.queryData.searchText = ''
      this.getTinymceData()
    },

  },

}
</script>
<style>
.el-table th.gutter {
  display: table-cell !important;
}
</style>
<style scoped>
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
