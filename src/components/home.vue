<template>
  <div class="home">
    <video id="vedio" width="200" height="200" class="video" preload autoplay loop muted></video>
    <canvas id="img" class="img"></canvas>
    <canvas id="draw" class="canvas"></canvas>
  </div>
</template>

<script>
import face from '@/utils/face/face'
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    test (val) {
      console.log(val)
    }
  },
  mounted () {
    face.face('#vedio', '#draw', '#img', this.test)
  }
}
</script>

<style lang='scss' scoped>
.home{
  width: 100%;
  height:100%;
  background-color: white;
  .img, .canvas, .video{
    float: left;
    width: 200px;
    height: 200px;
    background-color: red;
    border: 1px solid black;
  }
}
</style>
