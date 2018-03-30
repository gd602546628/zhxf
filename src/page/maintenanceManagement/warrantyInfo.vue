<template>
  <div class="warrantyInfo">
    <common-box title="报修工单">
      <div class="group">
        <p class="subtitle">设备信息</p>
        <div class="content">
          <div class="row">
            <div class="col-3">
              <span class="tip">设备名称：</span>
              <span>{{repairDetailData.equipmentName}}</span>
            </div>
            <div class="col-3">
              <span class="tip">消防单元：</span>
              <span>{{repairDetailData.fireUnitName}}</span>
            </div>
            <div class="col-3">
              <span class="tip">楼层：</span>
              <span>{{repairDetailData.floor}}F</span>
            </div>
            <div class="col-3">
              <span class="tip">位置：</span>
              <span>{{repairDetailData.location}}</span>
            </div>

            <div class="col-3">
              <span class="tip">报修时间：</span>
              <span>{{repairDetailData.createTime}}</span>
            </div>

            <div class="col-3">
              <span class="tip">报修状态：</span>
              <span>{{repairState[repairDetailData.status]}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="group">
        <p class="subtitle">报修问题描述</p>
        <div class="content">
          <div>
            {{repairDetailData.description}}
          </div>
        </div>
      </div>
      <div class="group1" v-if="repairDetailData.type!==1">
        <p class="subtitle">巡检故障</p>
        <div class="content1" v-for="check in checkRecordList">
          <div><span class="tip">检查部位：</span><span>{{check.position}}</span></div>
          <div><span class="tip">检查方法：</span><span>{{check.checkWay}}</span></div>
          <div><span class="tip">正常标准：</span><span>{{check.checkIndex}}</span></div>
          <div><span class="tip">故障描述：</span><span>{{check.problemDescription}}</span></div>
          <el-button class="btn" @click="goDatails(check.checkInfoId)">查看巡检报告</el-button>
        </div>
      </div>
      <div class="group">
        <p class="subtitle">维修进度</p>
        <div class="content progress row" column>
          <div class="line" v-for="pro in repairProcesses">
            <p><span>{{pro.people}}</span>{{pro.operating}}</p>
            <p>{{pro.createTime}}</p>
            <div class="circle"></div>
          </div>
        </div>
      </div>
    </common-box>
  </div>
</template>

<script>

  import CommonBox from '../../component/commonBox.vue'
  import repair from '@/api/repair'
  import {Code} from '@/config/config'

  export default {
    data() {
      return {
        repairDetailData:[],
        checkRecordList: [],
        repairProcesses: [],
        repairState:['新报修','维修中','已完成','被驳回']
      }
    },
    created(){
      this.getRepairDetail()
    },
    methods: {
      async getRepairDetail(){ // 获取报修工单详情
        let params = {
          id: this.$route.params.id
        }
        let data = await repair.repairDetails(params).catch( e =>{
        })
        if(data.code === Code.SUCCESS){
          this.repairDetailData = data.data.repair
          this.checkRecordList = data.data.checkRecordList
          this.repairProcesses = data.data.repairProcesses
        } else {
          this.$message.error(data.mesg)
        }
      },
      goDatails(id){
        this.$router.push({
          name: 'lookRecord',
          params:{
            id: id
          }
        })
      }
    },
    mounted() {
    },
    components: {
      CommonBox
    }
  }
</script>
<style lang="scss" scoped type="text/scss">
  .warrantyInfo {
    padding: 20px;
    .group {
      padding: 10px;
      border-bottom: 1px solid #dddddd;
      .btn {
        background-color: #5cc463;
        border-color: #5cc463;
      }
      .subtitle {
        padding: 10px;
        font-size: 15px;
        font-weight: 600;
      }
      .tip {
        color: #7b7c7c;
      }
      .content {
        padding-left: 30px;
        line-height: 25px;
        font-size: 14px;
      }
      .content1 {
        padding: 24px;
        border-bottom: 1px dashed #d9d9d9;
      }
      .progress {
        .line {
          font-size: 13px;
          line-height: 16px;
          padding: 15px 10px;
          margin-left: 40px;
          min-width: 300px;
          width: 300px;
          border-radius: 5px;
          background-color: #fdf2e7;
          margin-bottom: 5px;
          position: relative;
          &:before{
            content: '';
            display: block;
            height: 0px;
            width: 0px;
            border-bottom: 6px solid transparent;
            border-top:  6px solid transparent;
            border-right: 8px solid #fdf2e7;
            position: absolute;
            left: -8px;
            top:50%;
            margin-top: -6px;
            z-index: 1;
          }
          &:after{
            position: absolute;
            content: '';
            display: block;
            height: 100%;
            width: 2px;
            background-color: #5cc463;
            top:50%;
            margin-top: 4px;
            left: -31px;
            z-index: 1;
          }
          &:last-child{
            &:after{
              display: none;
            }
          }
          .circle{
            width: 20px;
            height: 20px;
            border: 2px solid #5cc463;
            border-radius: 50%;
            top:50%;
            margin-top: -10px;
            position: absolute;
            left: -40px;
            &:before{
              content: '';
              display: block;
              height: 10px;
              width: 10px;
              background-color: #5cc463;
              position: absolute;
              left: 50%;
              top:50%;
              margin-left: -5px;
              margin-top: -5px;
              z-index: 1;
              border-radius: 50%;
            }
          }
          p{
            span{
              color: #f17e35;
            }
          }
        }
      }
    }
    .group1 {
      border-bottom: 1px solid #dddddd;
      .btn {
        background-color: #5cc463;
        border-color: #5cc463;
        color: white;
        color: white;margin-top: 5px;
      }
      .subtitle {
        padding: 20px 10px 0px 20px;
        font-size: 15px;
        font-weight: 600;
      }
      .tip {
        color: #7b7c7c;
      }
      .content1 {
        font-size: 14px;
        padding: 10px 24px 10px 24px;
        border-bottom: 1px dashed #d9d9d9;
      }
    }
  }
</style>
