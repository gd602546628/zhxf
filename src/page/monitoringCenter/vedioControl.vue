<template>
  <area-select class="inspectionDensity" :showVedio="true">
    <div class="monitor-list-box">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="btn-box">
      <el-button>单视图</el-button>
      <el-button>四宫格</el-button>
      <el-button>九宫格</el-button>
      <el-button>12宫格</el-button>
      <el-button style="background-color: #1d83d8;color:#fff">全部暂停</el-button>
    </div>
  </area-select>
</template>
<script>
  import areaSelect from '@/component/areaSelect.vue'

  export default {
    data() {
      return {}
    },
    components: {
      areaSelect
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .inspectionDensity {
    .monitor-list-box {
      height: 96%;
      width: 96%;
      margin:2% 2%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      div {
        width: 25%;
        height: 50%;
        background-color: #000;
        border: 1px #2Fcb38 solid
      }
    }
    .btn-box{
      width: 94%;
      margin: 3% 3%;
    }
  }
</style>
