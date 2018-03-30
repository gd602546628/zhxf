<template>
  <div class="warn-info-box">
    <el-form class="form-container" :inline="true" ref="form" :model="form" label-width="200px">
      <common-box title="告警信息">
        <div class="information-box">
          <div class="info-img">
            <plan :src="addFilePre(detailData.flatUrl)"
                  :canDrag="false"
                  :showDelete="false"
                  :points="pointArr"
                  v-if="unitType===0"
                  style="width: 100%;height: 600px;"></plan>
            <b-map style="width: 100%;height: 600px;" v-if="unitType===1" ref="imgMap"></b-map>
          </div>
          <div class="warn-information">
            <div class="row-bg">
              <div class="warn-info-text">
                <div class="grid-content bg-purple ">告警信息</div>
                <div class="grid-content bg-purple ">告警设备：<span>{{detailData.equipmentName}}</span></div>
                <div class="grid-content bg-purple ">告警时间：<span>{{detailData.createTime}}</span></div>
                <div class="grid-content bg-purple ">所属建筑：<span>{{detailData.unitName}}</span></div>
                <div class="grid-content bg-purple ">所在楼层：<span>{{detailData.floorLevel}}F</span></div>
                <div class="grid-content bg-purple ">告警内容：<span>{{detailData.typeName}}</span></div>
              </div>
            </div>
            <div class="row-bg">
              <div class="warn-info-text">
                <div class="grid-content bg-purple-light">建筑信息</div>
                <div class="grid-content bg-purple ">名称：<span>{{fireUnitDetail.name}}</span></div>
                <div class="grid-content bg-purple ">属性：<span>{{attribute[fireUnitDetail.attribute]}}</span></div>
                <div class="grid-content bg-purple ">地址：<span>{{fireUnitDetail.areaName}}</span></div>
                <div class="grid-content bg-purple ">耐火等级：<span>{{fireLevel[fireUnitDetail.fireLevel]}}</span></div>
                <div class="grid-content bg-purple ">结构：<span>{{fireUnitDetail.structureName}}</span></div>
                <div class="grid-content bg-purple ">高度：<span>{{fireUnitDetail.height}}米</span></div>
                <div class="grid-content bg-purple ">危险等级：<span>{{fireUnitDetail.dangerLevelName}}</span></div>
                <div class="grid-content bg-purple ">地上层数：<span>{{fireUnitDetail.topCount}}</span></div>
                <div class="grid-content bg-purple ">地下层数：<span>{{fireUnitDetail.downCount}}</span></div>
                <div class="grid-content bg-purple ">地上面积：<span>{{fireUnitDetail.topArea}}平方米</span></div>
                <div class="grid-content bg-purple ">地下面积：<span>{{fireUnitDetail.downArea}}平方米</span></div>
                <div class="grid-content bg-purple ">验收日期：<span>{{checkDate(fireUnitDetail.checkTime)}}</span></div>
                <div class="grid-content bg-purple ">建筑年代：<span>{{checkYear(fireUnitDetail.buildingAge)}}</span></div>
                <div class="grid-content bg-purple ">巡检单位：<span>{{fireUnitDetail.pollingName}}</span></div>
                <div class="grid-content bg-purple ">维保单位：<span>{{fireUnitDetail.maintenanceName}}</span></div>
                <div class="grid-content bg-purple ">监管部门：<span>{{fireUnitDetail.fireBrigadeName}}</span></div>
              </div>
            </div>
            <div class="row-bg">
              <div class="warn-info-text">
                <div class="grid-content bg-purple ">附近消防设施</div>
                <div class="grid-content bg-purple device-img"
                     ref="webMap"
                     :class="{fullScreen:fullScreen}"
                >
                  <b-map style="width: 100%;height: 100%;"
                         ref="bMap"
                         @mapClick="mapClick"
                         v-if="showMap"></b-map>
                  <el-button class="open-full-screen-look" @click="goFullScreen()" v-if="fullScreen">关闭全屏</el-button>
                </div>
                <el-button class="full-screen-look" @click="goFullScreen()">全屏查看</el-button>
              </div>
            </div>
          </div>
        </div>
      </common-box>
    </el-form>
  </div>
</template>
<script>
  import CommonBox from '../../component/commonBox.vue'
  import bMap from '../../component/BMap.vue'
  import Monitor from '@/api/monitor'
  import {Code, FilePre} from '@/config/config'
  import plan from '../../component/plan.vue'
  export default {
    components: {
      CommonBox,
      bMap,
      plan
    },
    data() {
      return {
        form: {
          name: '',
          region: '',
          department: '',
          pageNum: 1
        },
        fullScreen: false,
        showMap: true,
        detailData: [],
        fireUnitDetail: [],
        fireLevel: ['', '一级耐火', '二级耐火', '三级耐火', '四级耐火'],
        attribute: ['建筑物', '公共区域'],
        unitType: 0,
        id: 0,
        pointArr: []
      }
    },
    created() {
      this.unitType = parseInt(this.$route.params.unitType)
      this.id = parseInt(this.$route.params.id)
    },
    mounted() {
      // this.$refs.bMap.centerByAddress('云南省玉溪市创新路11号')
      this.getDetails()
    },
    methods: {
      mapClick(){
      },
      goFullScreen() {
        this.$refs.bMap.centerByAddress('云南省玉溪市创新路11号')
        this.showMap = false
        this.fullScreen = !this.fullScreen
        setTimeout(() => {
          this.showMap = true
          this.$nextTick(() => {
            this.mapShow()
          })
        }, 0)
      },
      async getDetails() { // 告警信息详情
        let params = {
          id: this.id
        }
        let data = await Monitor.alarmDetails(params).catch(e => {
        })
        if (data.code === Code.SUCCESS) {
          this.detailData = data.data
          this.mapShow()
          this.getFireUnitDetails()
          if (this.unitType === 0) {
            this.pointArr.push({ // 建筑
              positionX: data.data.positionX,
              positionY: data.data.positionY,
              _url: data.data.equipIcon
            })
          } else { // 公共区域
            this.$refs.imgMap.addIconPoint(data.data.longitude, data.data.latitude, {icon: FilePre + data.data.equipIcon})
            this.$refs.imgMap.centerByPoint(data.data.longitude, data.data.latitude)
          }
        } else {
          this.$message.error(data.mesg)
        }
      },
      async getFireUnitDetails() { // 获取建筑信息
        let params = {
          unitId: this.detailData.unitId
        }
        let data = await Monitor.fireUnitDetails(params).catch(e => {
        })
        if (data.code === Code.SUCCESS) {
          this.fireUnitDetail = data.data
        } else {
          this.$message.error(data.mesg)
        }
      },
      addFilePre(val){
        return FilePre + val
      },
      checkDate(data){
        return `${new Date(data).getFullYear()}-${new Date(data).getMonth() + 1}`
      },
      checkYear(data){
        return `${new Date(data).getFullYear()}`
      },
      mapShow() {
        if (!this.detailData.nearEquipments) return
        this.$refs.bMap.removeAllOverlay()
        this.detailData.nearEquipments.forEach(item => {
          this.$refs.bMap.addPoint(item.longitude, item.latitude)
        })
        this.$refs.bMap.centerByPoint(this.detailData.nearEquipments[0].longitude, this.detailData.nearEquipments[0].latitude)
      },
    },
  }

</script>
<style lang="scss" type="text/scss" rel='stylesheet/scss' scoped>
  .warn-info-box {
    padding: 20px;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    .information-box {
      width: 100%;
      display: flex;
      .info-img {
        flex: 1;
        margin: 30px 2% 0 2%;
        img {
          display: block;
          width: 100%;
        }
      }
      .warn-information {
        width: 240px;
        .warn-info-text {
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
          .device-img {
            width: 100%;
            border-radius: 5px;
            height: 160px;
            .open-full-screen-look {
              position: absolute;
              bottom: 0;
              background-color: #07c362;
              width: 300px;
              color: #ffffff;
              border-color: #07c362;
              left: 50%;
              margin-left: -150px;
            }
            &.fullScreen {
              position: fixed;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              height: auto;
              z-index: 100;
            }
          }
          .full-screen-look {
            background-color: #07c362;
            width: 100%;
            color: #ffffff;
            border-color: #07c362;
            margin-top: 10px;
          }
        }
      }
    }
  }
</style>
