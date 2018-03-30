<template>
  <div class="warn-info-box">
    <el-form class="form-container" :inline="true" ref="form" :model="form" label-width="200px">
      <common-box title="故障信息">
        <div class="information-box">
          <div class="info-img">
            <img :src="imgUrl()"/>
          </div>
          <div class="warn-information">
            <div class="warn-info-text">
              <div>故障信息</div>
              <div>故障设备：<span>{{detailData.equipmentName}}</span></div>
              <div>故障时间：<span>{{detailData.createTime}}</span></div>
              <div>所属建筑：<span>{{detailData.unitName}}</span></div>
              <div>所在楼层：<span>{{detailData.floorLevel}}F</span></div>
              <div>故障内容：<span>{{detailData.typeName}}</span></div>
            </div>
          </div>
        </div>
      </common-box>
    </el-form>
  </div>
</template>
<script>
  import CommonBox from '../../component/commonBox.vue'
  import Monitor from '@/api/monitor'
  import {Code} from '@/config/config'
  import {UrlPre} from '@/config/config'
export default {
  data(){
    return{
      detailData:[],
      form:{

      }
    }
  },
  created(){
    this.getDetails()
  },
  methods:{
    async getDetails() { // 告警信息详情
      let params = {
        id: JSON.parse(this.$route.params.id)
      }
      let data = await Monitor.alarmDetails(params).catch(e => {
      })
      if (data.code === Code.SUCCESS) {
        this.detailData = data.data
      } else {
        this.$message.error(data.mesg)
      }
    },
    imgUrl() {
      if (this.detailData.flatUrl) {
        return 'http://172.31.60.190/ftp' + this.detailData.flatUrl
      }
    }
  },
  components: {
    CommonBox
  }
}
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.warn-info-box{
  padding: 20px;
  height: 100%;
  width: 100%;
  .form-container{
    .information-box{
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      .info-img{
        width: 81%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 2% 0 2%;
        img {
          display: block;
          width: 100%;
        }
      }
      .warn-information{
        width: 15%;
        .warn-info-text{
          background: rgba(0, 0, 0, 0.7);
          color: #ffffff;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          padding: 10px;
          margin: 10px;
          border-radius: 5px;
          div:first-child {
            font-size: 14px;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>
