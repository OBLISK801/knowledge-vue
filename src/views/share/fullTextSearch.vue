<template>
  <div>
    <el-card>
      <span>搜索的关键字：{{searchText}}</span>
      <el-divider></el-divider>
      <div v-if="flag">
        <div v-for="item in result">
          <p v-html="item.content"></p>
          <el-divider></el-divider>
        </div>
      </div>
      <div v-else>
        <p>没有结果</p>
      </div>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'fullTextSearch',
  data() {
    return {
      searchText: '',
      queryData: {
        pageNum: 1,
        pageSize: 10,
        state: ''
      },
      result: [],
      flag: false

    }
  },
  methods: {
    searchFullDoc() {
      this.flag = false
      this.queryData.state = this.$route.query.searchText
      this.$http.get('/elastics/tinymce/searchPdf',{params:this.queryData}).then(res => {
        if (res.data.code === 20000) {
          this.result = res.data.data.results
          this.flag = res.data.data.results.length > 0;
          this.$message({
            type: 'success',
            message: '数据检索成功'
          })
        }
      })
    },
  },
  created () {
    this.searchText = this.$route.query.searchText
    this.searchFullDoc()
  },
  mounted () {

  },

}
</script>

<style scoped>

</style>
