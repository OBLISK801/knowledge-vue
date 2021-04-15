<template>
  <el-container class="home-container">
    <!--头部导航栏-->
    <el-header>
      <div>
        <span style="margin-left:20px;">个人知识管理系统</span>
      </div>
      <div style="align-items: center; display: flex;justify-content: left">
        <el-dropdown trigger="click">
          <div>
            <el-avatar :size="50" :src="this.userInfo.avatar" style="cursor: pointer;" shape="square"></el-avatar>
            <span style="font-size: 18px;color: #fff;margin-left: 8px;">{{ userInfo.username }}<i
              class="el-icon-arrow-down el-icon--right"></i></span>
          </div>
          <el-dropdown-menu slot="dropdown" trigger="click">
            <el-dropdown-item>
              <span type="danger" @click="toWelcome"><span class="el-icon-house"></span> &nbsp;系统首页</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span type="danger" @click="drawer = true"><span class="el-icon-user"></span> &nbsp;个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span type="danger" @click="logout"><span class="el-icon-switch-button"></span> &nbsp;退出登入</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!--主体-->
    <el-container style="height: 500px;">
      <!--菜单-->
      <el-aside :width="isOpen===true?'64px':'200px'">
        <div class="toggle-btn" @click="toggleMenu"><i class="el-icon-s-operation"></i> </div>
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isOpen"
          :router="true"
          :default-active="activePath"
          background-color="#001529"
          :collapse-transition="false"
          text-color="rgba(255,255,255,0.7)"
          unique-opened>
          <MenuTree :menuList="this.menuList"></MenuTree>
        </el-menu>
      </el-aside>
      <!--右边主体-->
      <el-main v-loading="loading" style="background-color: #F2F6FC">
        <router-view></router-view>
      </el-main>
    </el-container>
    <!--个人中心-->
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      style="height: auto">
      <el-card style="padding: 5px;">
        <div slot="header">
          <span>用户信息</span>
          <el-button style="float: right;" size="mini" plain loading type="primary">用户中心</el-button>
        </div>
        <div>
          <el-avatar shape="square" :size="80" :src="userInfo.avatar" style="float:left; margin-right: 10px;" :key="1" ></el-avatar>
          <div>
            <span>用户名：{{userInfo.username}}</span><br>
            <span>用户昵称：{{userInfo.nickname}}</span><br>
            <span>手机号：{{userInfo.phoneNumber}}</span><br>
            <span>用户角色：{{userInfo.roles[0]}}</span>
          </div>
        </div>
      </el-card>
    </el-drawer>
  </el-container>
</template>

<script>
export default {
  name: 'layout'
}
</script>

<style scoped>

</style>
