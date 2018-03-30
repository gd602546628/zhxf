<template>
  <div class="look-record">
    <common-box title="巡检信息">
      <div class="xjxx-wrap">
        <div class="xjxx-item">
          <span>设备名称：</span>
          <p>{{checkInfo.equipmentName}}</p>
        </div>
        <div class="xjxx-item">
          <span>巡检频率：</span>
            <p>{{checkInfo.checkFrequency}}</p>
        </div>
        <div class="xjxx-item">
          <span>巡检时间：</span>
            <p>{{checkInfo.createTime}}</p>
        </div>
        <div class="xjxx-item">
          <span>上次巡检时间：</span>
            <p>{{checkInfo.previousCheckTime}}</p>
        </div>
        <div class="xjxx-item">
          <span>巡检人员：</span>
            <p>{{checkInfo.userName}}</p>
        </div>
        <div class="xjxx-item">
          <span>巡检状态：</span>
            <p>{{checkInfo.checkStatus}}</p>
        </div>
        <div class="xjxx-item">
          <span>设备状态：</span>
            <p>{{checkInfo.equipmentStatus}}</p>
        </div>
      </div>
    </common-box>
    <common-box title="巡检记录" :showBack="false">
      <div class="record-list">
        <div class="record-list-item" v-for="item in checkRecords">
          <div class="list-title" style="position: relative;">
            <span>{{item.position}}</span>
            <span class="record-list-icon"><i :class="item.status ? 'icon-right' : 'icon-wrong' "></i></span>
          </div>
          <div class="item">
            <span>检查方法：</span>
              <p>{{item.checkWay}}</p>
          </div>
          <div class="item">
            <span>正常标准：</span>
              <p>{{item.checkIndex}}</p>
          </div>
            <div class="item">

            </div>
        </div>
        <div class="record-back">
          <div class="record-back-title">巡检反馈</div>
          <div class="record-back-content">{{checkInfo.checkFeedback}}</div>
        </div>
      </div>
    </common-box>
  </div>
</template>
<script>
  import commonBox from '../../component/commonBox.vue'
  import Api from '../../api/index'

  export default{
    components: {
      commonBox
    },
    data(){
      return {
        checkInfo:{},
        checkRecords:[],
      }
    },
    async created(){
      await this.getList()
      console.log(this.checkInfo)
      console.log(this.checkRecords)
    },
    methods:{
      async getList(){
        let data = await Api.check.getInspectionDetail({id:this.$route.params.id})
        data = data.data
        if(data){
          data.checkInfo.equipmentStatus = data.checkInfo.equipmentStatus == 0 ? "正常":"异常"
          data.checkInfo.checkStatus = data.checkInfo.checkStatus == 0 ? "未完成":"已完成"
          this.checkInfo = data.checkInfo
          data.checkRecords.forEach(item => {
            item.status = item.status == 0 ? true:false
          })
          this.checkRecords = data.checkRecords
          console.log(this.checkRecords)
        }
      },
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .look-record {
    padding: 16px;
    .xjxx-wrap {
      display: flex;
      flex-wrap: wrap;
      padding: 30px 50px;
      padding-bottom: 10px;
      .xjxx-item {
        width: 25%;
        display: flex;
        margin-bottom: 20px;
        span {
          color: #a8a8a8;
        }
        p {
          margin-left: 20px;
        }
      }
    }
    .record-list {
      .record-list-item {
        padding: 24px;
        border-bottom: 1px dashed #d9d9d9;
        .list-title {
          font-weight: bold;
          margin-bottom: 16px;
        }
        .record-list-icon{
          position: absolute;
          left:200px;
          i{
            font-size: 25px;
          }
        }
        .item {
          display: flex;
          margin-bottom: 12px;
          font-size: 14px;
          span {
            color: #a8a8a8;
          }
          p {
            margin-left: 16px;
          }
        }
      }
    }
    .record-back{
      padding: 24px;
      .record-back-title{
        font-weight: bold;
        margin-bottom: 16px;
        font-size: 16px;
      }
      .record-back-content{
        font-size: 14px;
      }
    }
  }
</style>
