<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识获取</el-breadcrumb-item>
      <el-breadcrumb-item>知识搜索</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-container>
        <el-header style="height: 200px; background-color: lightgreen;">
          <div style="margin: auto; text-align: center;">
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">知识 & 专注</div>
            <el-autocomplete id="search" prefix-icon="el-icon-search" placeholder="搜你所想" style="width: 550px;"
                              v-model="state"
                             :fetch-suggestions="querySearch"
                             @select="handleSubmit">
              <template slot-scope="scope">
                <span v-html="scope.item.title"></span>
              </template>

            </el-autocomplete>
          </div>

        </el-header>
        <el-main style="background-color: white;">
          <el-container>
            <el-aside style="background-color: white;width: 750px; overflow: hidden;">
              <el-row>
                <span style="float: left; font-size: 20px; font-weight: bold; color: green;"><i
                  class="el-icon-s-flag"></i> 知识分类</span>
              </el-row>
              <el-divider id="devider"></el-divider>

              <el-row>
                <el-col :span="12" v-for="item in title">
                  <div style="margin: 20px;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">{{ item.classificationName }}</div>
                    <router-link v-for="item in item.children" :to="{path:'/obtain/fileIndex',query: {id: item.id}}" target="_blank" tag="a">
                      {{item.classificationName}}&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;</router-link>
                  </div>
                </el-col>


              </el-row>

            </el-aside>
            <el-main style="background-color: white;">
              <el-table
                :data="topTinymce"
                style="width: 100%">
                <el-table-column prop="title" width="300px;">
                  <template slot="header" slot-scope="scope">
                    <span style="float: left; font-size: 20px; font-weight: bold; color: #ff0000;"><i
                      class="el-icon-medal"></i> 热门文章</span>
                  </template>
                  <template slot-scope="scope">
                    <router-link :to="{path:'/obtain/obtainIndex',query: {id: scope.row.id}}" target="_blank" tag="a">{{scope.row.title}}</router-link>
                  </template>
                </el-table-column>
                <el-table-column align="right">
                  <template slot-scope="scope">
                    <i class="el-icon-view">&nbsp;&nbsp;&nbsp;&nbsp;{{scope.row.clickCount}}</i>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script>
// create mounted两者的区别
// vue路由中router-link传参方式以及参数的使用方法
// 怎么取消router-link文字下面的下划线
//  this.$router.push 传参
export default {
  name: 'Search',
  watch: {
  },
  data () {
    return {
      topTinymce: [],
      topFileInfo: [],
      state: '',
      pageNum: 1,
      pageSize: 10,
      data:[],
      title: [],
      class: []


    }
  },
  created () {
    this.getTopTinymce()
    this.getTopFileInfo()
    this.getClassificationTree()
  },
  methods: {
    getTopTinymce () {
      this.$http.get('/obtain/fiery/getTopTinymce').then(res => {
        if (res.data.code === 20000) {
          this.topTinymce = res.data.data
        }
      }).catch()
    },
    getTopFileInfo () {
      this.$http.get('/obtain/fiery/getTopFileInfo').then(res => {
        if (res.data.code === 20000) {
          this.topFileInfo = res.data.data
        }
      }).catch()
    },

    querySearch(q,callback) {
      let list = [{}]
      this.state = this.state.toLowerCase()
      this.$http.get('/elastics/tinymce/search',{params:{
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          state: this.state
        }}).then(res => {
          if (res.data.code === 20000) {
            for(let i of res.data.data.results){
              i.value = i.title
            }
            list = res.data.data.results
            console.log(list)
            callback(list);
          }
      }).catch()
    },
    handleSubmit(item) {
      this.state = item.value.replace(/<[^>]+>/g,"")
      let a = this.$router.resolve({ path: '/obtain/obtainIndex', query: { id: item.id } });
      window.open(a.href, '_blank');
    },
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



  },

}
</script>

<style>
#search.el-input__inner {
  border-radius: 20px;
}

#devider.el-divider--horizontal {
  margin-top: 8px;
  margin-bottom: 15px;
}

link-type,
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

.el-autocomplete {
  width: 400px;
}
.p2 {
  margin-left: 160px;
  text-align: left;
  font-size: 20px;
}
a {
  color: #4f5a75;
}
.div2 {
  /* background: blue; */
  margin-top: 25px;
  padding-top: 25px;
  margin-left: 270px;
  width: 750px;
  height: 600px;
  border: 1px solid #b0c4de;
}

</style>
