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
            <el-input id="search" prefix-icon="el-icon-search" placeholder="搜你所想" style="width: 550px;"></el-input>
          </div>
        </el-header>
        <el-main style="background-color: white;">
          <el-container>
            <el-aside style="background-color: white;width: 750px;">
              <el-row>
                <span style="float: left; font-size: 18px; font-weight: bold; color: green;"><i class="el-icon-s-flag"></i> 知识分类</span>
              </el-row>
              <el-divider id="devider"></el-divider>
            </el-aside>
            <el-main style="background-color: white;">
              <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column prop="address" label="热门知识" width="300px;">
                  <template slot="header" slot-scope="scope">
                    <span style="float: left; font-size: 18px; font-weight: bold; color: red;"><i class="el-icon-medal"></i> 知识分类</span>
                  </template>
                </el-table-column>
                <el-table-column align="right">
                  <template slot-scope="scope">
                   <i class="el-icon-view">5</i>
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
  data() {
    return {
      tableData: [{
        address: '我用分布式干掉一骡子简历'
      }, {
        address: '读过这篇文章，年薪百万不是梦'
      }, {
        address: 'BAT高级前端必备知识'
      }, {
        address: '弄懂Java线程底层，看这一篇就够了'
      },{
        address: '弄懂Java线程底层，看这一篇就够了'
      },{
        address: '弄懂Java线程底层，看这一篇就够了'
      },{
        address: '弄懂Java线程底层，看这一篇就够了'
      }],

    }
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
</style>
