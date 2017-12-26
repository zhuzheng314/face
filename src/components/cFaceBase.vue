<template>
  <div class="z-modal-wrap">
    <!-- <el-dialog title="人脸重置" :visible.sync="dialogVisible" size="tiny">
      <p class="text"><i class="el-icon-warning"></i>清除当前账号的人脸信息后，当前账号人脸信息将置空，需要重新录入</p>
      <div class="button-cont">
        <el-button type="primary" @click="submitForm">清除并重新录入</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </div>
    </el-dialog> -->
    <el-dialog title="人脸重置" :visible.sync="faceVisible" size="tiny">
      <div class="face--wrap">
        <p :class="{'tips-success': faceStatus === 'success','tips-fail': faceStatus === 'fail', 'tips-error':faceStatus === 'error','tips':faceStatus === 'wait'}" >
          <i class="el-icon-circle-check" v-if="faceStatus === 'success'"></i>
          <i class="el-icon-warning" v-else-if="faceStatus === 'fail'|| faceStatus === 'error'"></i>
          {{ message }}
        </p>
        <div class="camera" @click="begin" v-if="faceStatus !== 'success'">
          <div class="faceBg"></div>
          <p>点击开始识别</p>
          <video id="resetVedio" width="200" height="166.666" preload autoplay loop muted></video>
          <canvas width="160" height="134" id="resetImg" class="finImg"></canvas>
          <canvas id="resetDraw" width="200" height="166.666" class="canvas"></canvas>
        </div>
        <div class="button-cont">
          <el-button type="primary" :disabled="disabled" @click="again">{{finishMessage}}</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import face from '@/utils/face/face'
export default {
  name: 'c-face',
  props: ['dialogFaceVisible'],
  data () {
    return {
      dialogVisible: false,
      faceVisible: false,
      message: '重新录入人脸，请将脸部对准摄像头',
      disabled: true,
      faceStatus: 'wait',
      finishMessage: '重新识别'
    }
  },
  watch: {
    faceVisible (val) {
      if (val === false) {
        this._.checkCamera()
      }
    },
    dialogFaceVisible (val) {
      this.faceVisible = this.dialogFaceVisible
      if (val === false) {
        this._.checkCamera()
      }
    },
    dialogVisible (val) {
      if (val === false) {
        this.$emit('emit', false)
      }
    }
  },
  methods: {
    getImgAndAxios (base64) {
      sessionStorage.setItem('faceing', 'a')
      this.verifyFace(base64) // 给算法,获取faceId
    },
    verifyFace (params) {
      this.$axios.post(this.$urls.faceUrl, params)
        .then((res) => {
          console.log(res)
          let datas = res.data
          if (datas.flag === 0) { // 如果人脸识别失败,
            sessionStorage.removeItem('faceing')
            this.begin()
          } else {
            let params = {
              mobile: sessionStorage.getItem('mobile'),
              password: sessionStorage.getItem('password'),
              userId: sessionStorage.getItem('acountId'),
              faceFeas: datas.facefeas,
              faceId: datas.faceid,
              faceUrl: datas.faceurl
            }
            this.axiosAccountFace(params)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    axiosAccountFace (params) {
      this.$axios.post(this.$urls.url + this.$urls.faceReset, params)
        .then((res) => {
          console.log(res)
          let datas = res.data
          if (datas.code === 0) {
            this.faceStatus = 'success'
            this.disabled = false
            this.finishMessage = '完成'
            this.$message('人脸重置成功')
            this.message = '人脸重置成功'
          } else {
            this.disabled = false
            this.$message.error(datas.message)
            this.faceStatus = 'error'
            this.message = datas.message
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    submitForm () {
      this.dialogVisible = false
      this.$emit('emit', false)
      this.faceVisible = true
    },
    begin () {
      this.message = '人脸识别中…'
      sessionStorage.removeItem('faceing')
      face.face('#resetVedio', '#resetDraw', '#resetImg', this.getImgAndAxios)
    },
    resetForm () {
      this.dialogVisible = false
      this.$emit('emit', false)
    },
    again () {
      if (this.finishMessage === '重新识别') {
        this.message = '再次识别中…'
        this.faceStatus = 'wait'
        sessionStorage.removeItem('faceing')
      } else {
        this.faceVisible = false
      }
    },
    cancel () {
      this.faceVisible = false
    }
  },
  destroyed () {
    this.message = '清除成功，正在重新录入，请将脸部对准摄像头'
  }
  // mounted () {
  //   console.log(this.account)
  // }
}
</script>
<style lang="scss" scoped>
.z-modal-wrap {
  // width: 100%;
  // height: 100%;
  // text-align: left;
  [class^="el-icon-warning"] {    
    /* 以下内容参照第三方图标库本身的规则 */
    margin-right: 3px;
    font-size: 20px;
    color: #f6a623;
  }
  .text {
    width: 421px;
    font-size: 16px;
    margin: 0 auto;
    margin-top: 95px;
    margin-bottom: 144px;
    color: #f6a623;
  }
  .button-cont {
    text-align: right;
  }
  .tips {
    margin: 23px 0 19px 0;
    text-align: center;
    color: #666666;
  }
  .tips-success {
    margin: 23px 0 19px 0;
    text-align: center;
    color: #3ebb44;
  }
  .tips-fail {
    margin: 23px 0 19px 0;
    text-align: center;
    color: #f6a623;
    p {
      text-align: center;
    }
  }
  .tips-error {
    margin: 23px 0 19px 0;
    text-align: center;
    color:  #f6a623;
  }
  .camera{
    width: 240px;
    height: 180px;
    margin: 0 auto;
    position: relative;
    margin-bottom: 33px;
    background-color: rgba(0, 0, 0, 0.6);
    p{
      position: absolute;
      width: 240px;
      height: 180px;
      color: white;
      text-align: center;
      font-size: 14px;
      line-height: 180px;
    }
    .finImg{
      width: 200px;
      height: 166.66px;
      position: absolute;
      margin: 15px 20px;
      z-index: -1000;
    }
    video, .canvas {
      width: 200px;
      height: 166.66px;
      position: absolute;
      margin: 7px 20px;
    }
    .faceBg{
      width: 240px;
      height: 180px;
      margin: 0 auto;
      background-image: url("../../../public/img/face.png");
      background-size: 240px 180px;
      position: absolute;
      z-index: 1000;
    }
  }
}
</style>
