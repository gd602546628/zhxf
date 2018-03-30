<template>
  <div class="inspection-standard flex">
    <el-scrollbar class="left">
      <div class="select-wrap">
        <div class="select-item"
            v-for="(item,index) in fireSystem"
            :class="item.isSelect ? 'active':''"
            @click="selectFireSystem($event,index)">
          {{item.name}}
        </div>
      </div>
    </el-scrollbar>
    <el-scrollbar class="right">
      <div class="inspection-content">
        <common-box title="消防设备选择" class="xfsb" :showBack="false">
          <div class="wrap">
            <div class="item all-center"
                :class="item.isSelect ? 'active':''"
                v-for="(item,index) in fireEqu"
                @click="selectFireEqu($event,index)"
            >
              <img v-if="item.icon" :src="item.icon" alt="">
              {{item.name}}</div>
          </div>
        </common-box>
        <common-box title="设备巡检指标" class="xfzb" :showBack="false">
          <div class="wrap">
            <div class="table-header">
              <p>检查部位</p>
              <p>检查方法</p>
              <p>正常指标</p>
              <p>检查确认</p>
            </div>
            <div class="table-content">
              <div class="item"  v-for="item in inspectionStandard">
                <p>{{item.position}}</p>
                <p>{{item.checkWay}}</p>
                <p>{{item.checkIndex}}</p>
                <p>{{item.txt}}</p>
              </div>
            </div>
          </div>
        </common-box>
      </div>
    </el-scrollbar>
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
      return{
        nowFireEquData:{
          systemId:null
        },
        nowFireStandardData:{
          equipmentId:null
        },
        fireSystem:[],
        fireEqu:[],
        inspectionStandard:[],
      }
    },
    async created(){
      this.fireSystem = await this.getFireSystem()
    },
    methods:{
      async getFireSystem(){
        let data = await Api.check.getFireSystemList()
        data = data.data
        data.forEach((item,index) => {
          item.isSelect = index==0 ? true : false
          if(index==0){
            this.nowFireEquData.systemId = item.id
          }
        })
        await this.getFireEquList()
        return data
      },
      async getFireEquList(){
        let data = await Api.check.getFireEquList(this.nowFireEquData)
        this.fireEqu = data.data
        if(this.fireEqu){
          this.fireEqu.forEach((item,index) => {
            item.isSelect = index==0 ? true : false
            if(index==0){
              this.nowFireStandardData.equipmentId = item.id
            }
          })
        }
        await this.getStandardList()
      },
      async getStandardList(){
        let data = await Api.check.getStandardList(this.nowFireStandardData)
        this.inspectionStandard = data.data
        if(this.inspectionStandard){
          this.inspectionStandard.forEach(item => {
            if(item.isImage==0&&item.isVideo==0){
              item.txt= "——"
            }else if(item.isImage==1&&item.isVideo==0){
              item.txt= "照片"
            }else if(item.isImage==0&&item.isVideo==1){
              item.txt= "视频"
            }else{
              item.txt= "照片、视频"
            }
          })
        }
      },
      selectFireSystem(event,$index){
        this.fireSystem.forEach((item,index) => {
          item.isSelect = index==$index ? true : false
        })
        this.nowFireEquData.systemId = this.fireSystem[$index].id
        this.getFireEquList()
      },
      selectFireEqu(event,$index){
        this.fireEqu.forEach((item,index) => {
          item.isSelect = index==$index ? true : false
        })
        this.nowFireStandardData.equipmentId = this.fireEqu[$index].id
        this.getStandardList()
      }
    }


  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .inspection-standard {
    overflow: hidden;
    height: 100%;
    .left {
      width: 210px;
      background: #454751;
      margin-bottom: -17px;
      .select-wrap {
        padding: 20px 14px;
        .select-item {
          height: 30px;
          border-bottom: 1px solid #686972;
          line-height: 30px;
          padding-left: 12px;
          color: #ffffff;
          background: #5c5d66;
          cursor: pointer;
          &.active {
            background: #07c362;
          }
        }
      }
    }
    .right {
      flex: 1;
      margin-bottom: -17px;
      .inspection-content {
        padding: 20px;
        .xfsb {
          .wrap {
            padding: 20px 30px;
            display: flex;
            flex-wrap: wrap;
            .item {
              width: 140px;
              height: 36px;
              background: #ffeedf;
              color: #fb7702;
              margin-right: 20px;
              margin-bottom: 20px;
              cursor: pointer;
              &.active{
                border: 1px solid #fb7702;
              }
            }
          }
        }
        .xfzb {
          .wrap {
            .table-header {
              display: flex;
              border-bottom: 1px dashed #d9d9d9;
              p {
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
                height: 60px;
              }
            }
            .table-content {
              padding-bottom: 26px;
              .item {
                display: flex;
                margin-top: 26px;
                p {
                  flex: 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0 10px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
