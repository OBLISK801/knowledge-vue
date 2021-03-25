<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识分享</el-breadcrumb-item>
      <el-breadcrumb-item>我的文章</el-breadcrumb-item>
    </el-breadcrumb>

    <el-container>
      <el-aside style="width: 900px; background-color: white; margin-right: 15px;">
        <el-card>
          <el-row>
            <el-col :span="18">
              <span style="font-size: 20px;font-weight: bold;color: #2d8cf0;">博客</span>
            </el-col>
            <el-col :span="6">
              <span style="float: right; font-size: 18px;">共{{ articleNum }}篇</span>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <div>
            <el-row>
              <span style="font-size: 20px; font-weight: bold;">乐观锁CAS</span>
            </el-row>
            <el-row>
              <el-col :span="18">
                <p style="letter-spacing: 1px;">为了提高性能，JVM很多操作都依赖CAS实现，一种乐观锁的实现。本文锁优化中大量用到了CAS，故有必要先分析一下CAS的实现。
                  CAS：Compare and Swap。如果内存位置的值与预期原值相匹配，那么处理器会自动将该位置值更新为新值 。
                  否则，处理器不做任何操作。无论哪种情况，它都会在 CAS 指令之前返回该 位置的值......</p>
              </el-col>
              <el-col :span="6">
                <img src="https://test-0230.oss-cn-beijing.aliyuncs.com/imagepng/913075.png" width="200" height="120"
                     alt="">
              </el-col>
            </el-row>
            <el-row style="display: flex;align-items: center;">
              <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                         style="margin-right: 6px;"></el-avatar>
              <span style="color: #2d8cf0; margin-right: 10px;">国士无双</span>
              <span style="margin-right: 10px;"><i class="el-icon-date"></i>2021-03-20</span>
              <span style="margin-right: 30px;"><i class="el-icon-view"></i>99999</span>
              <el-tag type="primary">CAS</el-tag>
            </el-row>
            <el-divider></el-divider>
          </div>
          <div>
            <el-row>
              <span style="font-size: 20px; font-weight: bold;">乐观锁CAS</span>
            </el-row>
            <el-row>
              <el-col :span="18">
                <p style="letter-spacing: 1px;">为了提高性能，JVM很多操作都依赖CAS实现，一种乐观锁的实现。本文锁优化中大量用到了CAS，故有必要先分析一下CAS的实现。
                  CAS：Compare and Swap。如果内存位置的值与预期原值相匹配，那么处理器会自动将该位置值更新为新值 。
                  否则，处理器不做任何操作。无论哪种情况，它都会在 CAS 指令之前返回该 位置的值......</p>
              </el-col>
              <el-col :span="6">
                <img src="https://test-0230.oss-cn-beijing.aliyuncs.com/imagepng/913075.png" width="200" height="120"
                     alt="">
              </el-col>
            </el-row>
            <el-row style="display: flex;align-items: center;">
              <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                         style="margin-right: 6px;"></el-avatar>
              <span style="color: #2d8cf0; margin-right: 10px;">国士无双</span>
              <span style="margin-right: 10px;"><i class="el-icon-date"></i>2021-03-20</span>
              <span style="margin-right: 30px;"><i class="el-icon-view"></i>99999</span>
              <el-tag type="primary">CAS</el-tag>
            </el-row>
            <el-divider></el-divider>
          </div>
          <div>
            <el-row>
              <span style="font-size: 20px; font-weight: bold;">乐观锁CAS</span>
            </el-row>
            <el-row>
              <el-col :span="18">
                <p style="letter-spacing: 1px;">为了提高性能，JVM很多操作都依赖CAS实现，一种乐观锁的实现。本文锁优化中大量用到了CAS，故有必要先分析一下CAS的实现。
                  CAS：Compare and Swap。如果内存位置的值与预期原值相匹配，那么处理器会自动将该位置值更新为新值 。
                  否则，处理器不做任何操作。无论哪种情况，它都会在 CAS 指令之前返回该 位置的值......</p>
              </el-col>
              <el-col :span="6">
                <img src="https://test-0230.oss-cn-beijing.aliyuncs.com/imagepng/913075.png" width="200" height="120"
                     alt="">
              </el-col>
            </el-row>
            <el-row style="display: flex;align-items: center;">
              <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                         style="margin-right: 6px;"></el-avatar>
              <span style="color: #2d8cf0; margin-right: 10px;">国士无双</span>
              <span style="margin-right: 10px;"><i class="el-icon-date"></i>2021-03-20</span>
              <span style="margin-right: 30px;"><i class="el-icon-view"></i>99999</span>
              <el-tag type="primary">CAS</el-tag>
            </el-row>
            <el-divider></el-divider>
          </div>
          <div>
            <el-row>
              <span style="font-size: 20px; font-weight: bold;">乐观锁CAS</span>
            </el-row>
            <el-row>
              <el-col :span="18">
                <p style="letter-spacing: 1px;">为了提高性能，JVM很多操作都依赖CAS实现，一种乐观锁的实现。本文锁优化中大量用到了CAS，故有必要先分析一下CAS的实现。
                  CAS：Compare and Swap。如果内存位置的值与预期原值相匹配，那么处理器会自动将该位置值更新为新值 。
                  否则，处理器不做任何操作。无论哪种情况，它都会在 CAS 指令之前返回该 位置的值......</p>
              </el-col>
              <el-col :span="6">
                <img src="https://test-0230.oss-cn-beijing.aliyuncs.com/imagepng/913075.png" width="200" height="120"
                     alt="">
              </el-col>
            </el-row>
            <el-row style="display: flex;align-items: center;">
              <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                         style="margin-right: 6px;"></el-avatar>
              <span style="color: #2d8cf0; margin-right: 10px;">国士无双</span>
              <span style="margin-right: 10px;"><i class="el-icon-date"></i>2021-03-20</span>
              <span style="margin-right: 30px;"><i class="el-icon-view"></i>99999</span>
              <el-tag type="primary">CAS</el-tag>
            </el-row>
            <el-divider></el-divider>
          </div>
          <div>
            <el-row>
              <span style="font-size: 20px; font-weight: bold;">乐观锁CAS</span>
            </el-row>
            <el-row>
              <el-col :span="18">
                <p style="letter-spacing: 1px;">为了提高性能，JVM很多操作都依赖CAS实现，一种乐观锁的实现。本文锁优化中大量用到了CAS，故有必要先分析一下CAS的实现。
                  CAS：Compare and Swap。如果内存位置的值与预期原值相匹配，那么处理器会自动将该位置值更新为新值 。
                  否则，处理器不做任何操作。无论哪种情况，它都会在 CAS 指令之前返回该 位置的值......</p>
              </el-col>
              <el-col :span="6">
                <img src="https://test-0230.oss-cn-beijing.aliyuncs.com/imagepng/913075.png" width="200" height="120"
                     alt="">
              </el-col>
            </el-row>
            <el-row style="display: flex;align-items: center;">
              <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                         style="margin-right: 6px;"></el-avatar>
              <span style="color: #2d8cf0; margin-right: 10px;">国士无双</span>
              <span style="margin-right: 10px;"><i class="el-icon-date"></i>2021-03-20</span>
              <span style="margin-right: 30px;"><i class="el-icon-view"></i>99999</span>
              <el-tag type="primary">CAS</el-tag>
            </el-row>
            <el-divider></el-divider>
          </div>
          <el-row>
            <el-button type="success">上一页</el-button>
            <el-button type="success" style="float: right;">下一页</el-button>
          </el-row>
        </el-card>
      </el-aside>

      <el-main style="background-color: #f2eada;">
        <el-container>

          <el-footer id="f1" style="margin-bottom: 150px;">
            <el-card>
              <div slot="header" class="clearfix">
                <span><i class="el-icon-c-scale-to-original"></i> 分类</span>
                <el-button style="float: right; padding: 3px 0" type="text">more</el-button>
              </div>
              <div v-for="o in 4" :key="o" class="text item">
                {{ 'Java线程 ' + o }}
              </div>
            </el-card>
          </el-footer>

          <el-footer style="margin-bottom: 150px;" id="f2">
            <el-card>
              <div slot="header" class="clearfix">
                <span><i class="el-icon-c-scale-to-original"></i> 标签</span>
                <el-button style="float: right; padding: 3px 0" type="text">more</el-button>
              </div>
              <div v-for="o in 4" :key="o" class="text item">
                {{ 'Java线程 ' + o }}
              </div>
            </el-card>
          </el-footer>

          <el-footer style="margin-bottom: 15px;" id="f3">
            <el-card>
              <div slot="header" class="clearfix">
                <span><i class="el-icon-c-scale-to-original"></i> 热门推荐</span>
              </div>
              <div v-for="o in 4" :key="o" class="text item">
                {{ 'Java线程 ' + o }}
              </div>
            </el-card>
          </el-footer>

        </el-container>
      </el-main>
    </el-container>

  </div>
</template>

<script>
export default {
  name: 'ArticleIndex',
  data () {
    return {
      articleNum: 10,

    }
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
