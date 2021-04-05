<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识获取</el-breadcrumb-item>
      <el-breadcrumb-item>我的收藏</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="favoriteData" style="width:100%;height:auto;" border>
        <el-table-column prop="title" label="文章标题"  align="center"></el-table-column>
        <el-table-column prop="username" label="收藏人"  align="center"></el-table-column>
        <el-table-column prop="time" label="收藏时间"  align="center"></el-table-column>
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
      favoriteData: [],
      queryData: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,

    }
  },
  created () {
    this.getFavorite()
  },
  methods: {
    getFavorite() {
      this.$http.get('/obtain/favorites/listAll',{params:this.queryData}).then(res => {
        if (res.data.code === 20000) {
          this.favoriteData = res.data.data.results
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

  },

}
</script>

<style scoped>

</style>
