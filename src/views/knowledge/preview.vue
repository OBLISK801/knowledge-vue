<template>
  <div>
    <el-breadcrumb separator="/" style="padding-left:10px;padding-bottom:10px;font-size:15px;" id="aaa">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>知识存储</el-breadcrumb-item>
      <el-breadcrumb-item>资源预览</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-container>
        <el-aside style="width: 850px; background-color: white;">
          <el-card>
            <div v-if="showImage">
              <img :src="imageUrl" style="height: 500px;">
            </div>
            <div v-if="showPdf" :style="{width: scale + '%'}">
              <el-button-group>
                <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="prePage">上一页</el-button>
<!--                <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="scaleD">放大</el-button>-->
<!--                <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="scaleX">缩小</el-button>-->
              </el-button-group>
              <div style="marginTop: 10px; color: #409EFF">{{ pageNum }} / {{ pageTotalNum }}</div>
              <pdf
                :page="pageNum"
                :src="pdfUrl"
                @progress="loadedRatio = $event"
                @num-pages="pageTotalNum=$event"
              ></pdf>
              <el-button-group style="float: right;margin-bottom: 5px;">
                <el-button type="primary" size="mini" @click="nextPage">下一页<i
                  class="el-icon-arrow-right el-icon--right"></i></el-button>
              </el-button-group>
            </div>
            <div v-if="showVideo">
              <div class="input_video">
                <video-player  class="video-player vjs-custom-skin"
                               ref="videoPlayer"
                               :playsinline="true"
                               :options="playerOptions"
                ></video-player>
              </div>
            </div>
            <div v-if="showAudio">
              <audio autoplay controls loop>
                <source :src="audioUrl">
              </audio>
            </div>
            <div v-if="showDoc">
              <el-button-group>
                <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="prePage">上一页</el-button>
              </el-button-group>
              <div style="marginTop: 10px; color: #409EFF">{{ pageNum }} / {{ pageTotalNum }}</div>
              <pdf
                :page="pageNum"
                :src="pdfUrl"
                @progress="loadedRatio = $event"
                @num-pages="pageTotalNum=$event"
              ></pdf>
              <el-button-group style="float: right;margin-bottom: 5px;">
                <el-button type="primary" size="mini" @click="nextPage">下一页<i
                  class="el-icon-arrow-right el-icon--right"></i></el-button>
              </el-button-group>
            </div>
          </el-card>
        </el-aside>
        <el-main style="background-color: white;">
          <el-card>
            <div slot="header" class="clearfix">
              <span>文件信息</span>
            </div>
            <el-form label-width="80px" label-position="left" :model="fileInfo">
              <el-form-item label="文件名称">
                <el-input v-model="fileInfo.fileName"></el-input>
              </el-form-item>
              <el-form-item label="文件大小">
                <el-input v-model="fileInfo.totalSize"></el-input>
              </el-form-item>
              <el-form-item label="上传用户">
                <el-input v-model="fileInfo.uploadUser"></el-input>
              </el-form-item>
              <el-form-item label="上传时间">
                <el-input v-model="fileInfo.uploadTime"></el-input>
              </el-form-item>
              <el-form-item label="文件简介">
                <el-input></el-input>
              </el-form-item>
            </el-form>
          </el-card>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  name: 'preview',
  components: {
    pdf
  },

  data () {
    return {
      id: '',
      fileInfo: {
        id: '',
        fileName: '',
        totalSize: '',
        uploadUser: '',
        uploadTime: ''
      },
      showDoc: false,
      showPdf: false,
      showImage: false,
      showVideo: false,
      showAudio: false,
      imageUrl: '',
      videoUrl: '',
      audioUrl: '',
      pdfUrl: '',
      pageNum: 1,
      pageTotalNum: 1,
      loadedRatio: 0,
      playerOptions : {
        playbackRates : [ 0.5, 1.0, 1.5, 2.0 ], //可选择的播放速度
        autoplay : false, //如果true,浏览器准备好时开始回放。
        muted : false, // 默认情况下将会消除任何音频。
        loop : false, // 视频一结束就重新开始。
        preload : 'auto',
        language : 'zh-CN',
        aspectRatio : '16:9',
        fluid : true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources : [ {
          type : "",
          src : ''
        } ],
        poster : "",
        notSupportedMessage : '此视频暂无法播放，请稍后再试',
        controlBar : {
          timeDivider : true,
          durationDisplay : true,
          remainingTimeDisplay : false,
          fullscreenToggle : true
        }
      },
      scale: 100


    }
  },
  created () {
    this.id = this.$route.query.id
    this.getFile()
  },
  methods: {
    getFile () {
      this.$http.get('/admin/file/getUrl', { params: { id: this.id,userName: this.$store.state.userInfo.username } }).then(res => {
        if (res.data.code === 20000) {
          this.fileInfo = res.data.data
          this.setFileType(this.fileInfo.fileName,this.fileInfo.id)
        }
      }).catch()
    },
    getFileType (fileName) {
      return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length)
    },
    setFileType (fileName,id) {
      let type = this.getFileType(fileName)
      if (type.indexOf('doc') !== -1 || type.indexOf('docx') !== -1 || type.indexOf('xsl') !== -1 || type.indexOf('xlsx') !== -1
          || type.indexOf('pptx') !== -1) {
        this.$http.get('/admin/file/preview',{params: {id: id}}).then(res => {
          if (res.data.code === 20000) {
            this.pdfUrl = 'http://localhost:8443/image/preview/'+res.data.data
          }
        }).catch()
        this.showDoc = true
      } else if (type.indexOf('pdf') !== -1) {
        this.pdfUrl = 'http://localhost:8443/image/' + this.fileInfo.identifier + '/' + this.fileInfo.fileName
        this.showPdf = true
      } else if (type.indexOf('jpg') !== -1 || type.indexOf('png') !== -1 || type.indexOf('jpeg') !== -1) {
        this.imageUrl = 'http://localhost:8443/image/' + this.fileInfo.identifier + '/' + this.fileInfo.fileName
        this.showImage = true
      } else if (type.indexOf('avi') !== -1 || type.indexOf('mp4') !== -1 || type.indexOf('webm') !== -1
        || type.indexOf('m4v') !== -1 || type.indexOf('rmvb') !== -1 || type.indexOf('mpg') !== -1
        || type.indexOf('3gp') !== -1 || type.indexOf('swf') !== -1 || type.indexOf('mkv') !== -1) {
        this.videoUrl = 'http://localhost:8443/image/' + this.fileInfo.identifier + '/' + this.fileInfo.fileName
        this.playerOptions['sources'][0]['src'] =this.videoUrl;
        this.showVideo = true
      } else if (type.indexOf('mp3') !== -1 || type.indexOf('flac') !== -1) {
        this.audioUrl = 'http://localhost:8443/image/' + this.fileInfo.identifier + '/' + this.fileInfo.fileName
        this.showAudio = true
      } else {
        this.$message('当前文件暂不支持预览')
      }
    },
    // 上一页
    prePage () {
      let page = this.pageNum
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum = page
    },

    // 下一页
    nextPage () {
      let page = this.pageNum
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum = page
    },

    //放大
    scaleD() {
      this.scale += 5
    },

    //缩小
    scaleX() {
      if (this.scale === 100) {
        return
      }
      this.scale += -5
    },


  },

}
</script>

<style scoped>

</style>
<style>
.input_video{
  margin: 0 auto;
}
</style>
