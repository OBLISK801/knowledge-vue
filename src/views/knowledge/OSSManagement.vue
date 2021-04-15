<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识存储</el-breadcrumb-item>
      <el-breadcrumb-item>OSS预览</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>

    </el-card>
  </div>
</template>

<!--<script>-->
<!--export default {-->
<!--  name: 'OSSManagement',-->
<!--  -->
<!--}-->
<!--</script>-->
<script>
export default {
  data() {
    return {
      data: [{
        name: 'aa',
        age: 12
      },
        {
          name: 'bb',
          age: 13
        }
      ],//列举一部分的数据
      list: [], // 显示的数据
      limit: 10, // 条数，每一页显示的数量
      total: 20, // 所有的数量
      page: 1, //当前页
      searchData: '' // 搜索内容
    }
  },
  created() {
    this.pageList()
  },
  methods: {
    pageList() {
      this.getList()
    },
    // 处理数据
    getList() {
      // es6过滤得到满足搜索条件的展示数据list
      var list = this.data.filter((item, index) =>
        item.name.includes(this.searchData)
      ) // 搜索符号条件的内容
      console.log(list)
      this.list = list.filter((item, index) =>
        index < this.page * this.limit && index >= this.limit * (this.page - 1)
      ) //根据页数显示相应的内容
      this.total = list.length
    },
    // 当每页数量改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val
      this.getList()
    },
    // 当当前页改变
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val
      this.getList()
    },
    // 搜索过滤数据
    search() {
      this.page = 1
      this.getList()
    }
  },
}
</script>
<style scoped>

</style>
