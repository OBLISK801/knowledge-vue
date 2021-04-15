<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识获取</el-breadcrumb-item>
      <el-breadcrumb-item>我的收藏</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="tinymceData"
                style="width: 100%;height: auto;"
                border>
        <el-table-column prop="tinymceId" label="文章ID" width="70" align="center"></el-table-column>
        <el-table-column prop="writeUser" label="作者" width="120" align="center"></el-table-column>
        <el-table-column label="文章名">
          <template slot-scope="scope">
            <router-link :to="{path:'/obtain/obtainIndex',query: {id: scope.row.tinymceId}}" target="_blank" tag="a">
              <span>{{ scope.row.title }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="文章标签">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.tags" style="margin-right: 3px;" type="success">{{labelMap.get(item)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="收藏时间" width="200" align="center"></el-table-column>
        <el-table-column align="center" prop="isPublic" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="unFavoriteArticle(scope.row.tinymceId)">取消收藏</el-button>
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
  name: 'MyFavorite',
  data () {
    return {
      queryData: {
        pageNum: 1,
        pageSize: 10,
        username: ''
      },
      total: 0,
      tinymceData:[],
      labelData: [],
      labelMap: new Map(),
      favoriteArticleForm: {
        tinymceId: '',
        username: ''
      },

    }
  },
  created () {
    this.getLabel()
    this.getFavorite()
  },
  methods: {
    getFavorite() {
      this.queryData.username = this.$store.state.userInfo.username
      this.$http.get('/obtain/favorites/listAll',{params:this.queryData}).then(res => {
        if (res.data.code === 20000) {
          console.log(res.data.data.results)
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
    getLabel() {
      this.$http.get('/admin/tag/list').then(res => {
        if (res.data.code === 20000) {
          this.labelData = res.data.data
          for (let i=0; i<this.labelData.length; i++) {
            this.labelMap.set(this.labelData[i].id, this.labelData[i].tagName)
          }
        }
      }).catch()
    },
    unFavoriteArticle(tinymceId) {
      this.favoriteArticleForm.tinymceId = tinymceId
      this.favoriteArticleForm.username = this.$store.state.userInfo.username
      this.$http.post('/obtain/favorites/unFavoriteArticle',this.favoriteArticleForm).then(res => {
        if (res.data.code === 20000) {
          this.$message({
            type: 'success',
            message: '取消收藏成功'
          })
          this.getFavorite()
        }
      }).catch()
    },

  },

}
</script>

<style>
.el-table th.gutter{
  display: table-cell!important;
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
