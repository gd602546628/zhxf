<template>
  <div class="main-index">
    <div v-show="!showBuildingInfo" class="map-box">
      <div class="left-tree-scroll">
        <div class="tab">
          <p :class="{active:currentIndex===0}" @click.stop="tabClick(0)">按网格显示</p>
          <p :class="{active:currentIndex===1}" @click.stop="tabClick(1)">按单位显示</p>
        </div>
        <el-scrollbar>
          <div class="left-tree">
            <div class="title">组织树</div>
            <el-tree :data="treeData"
                     :props="defaultProps"
                     @node-click="handleNodeClick"
                     class="tree"
                     node-key="id"
                     ref="tree"
                     :default-expanded-keys="defaultExpand"
            ></el-tree>
          </div>
        </el-scrollbar>
      </div>
      <div class="right-view">
        <b-map style="height: 100%;width: 100%" ref="bMap"></b-map>
      </div>
    </div>
    <div class="base-info info-box" v-if="currentType===0">
      <div class="title">基本信息</div>
      <div class="info-item-wrap">
        <div class="info-item">
          <p>消防单元</p>
          <ul>
            <li v-for="item in baseInfo.organizationCount">{{item}}</li>
          </ul>
        </div>
        <div class="info-item">
          <p>消防网格</p>
          <ul>
            <li v-for="item in baseInfo.gridCount">{{item}}</li>
          </ul>
        </div>
        <div class="info-item">
          <p>单位</p>
          <ul>
            <li v-for="item in baseInfo.organizationCount">{{item}}</li>
          </ul>
        </div>
        <div class="info-item">
          <p>传输装置</p>
          <ul>
            <li v-for="item in baseInfo.transmitCount">{{item}}</li>
          </ul>
        </div>
        <div class="info-item">
          <p>巡检点</p>
          <ul>
            <li v-for="item in baseInfo.checkCount">{{item}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="building-info" v-if="currentType===2">
      <div class="building-info-box">
        <div class="title">建筑信息</div>
        <div class="building-info-item">
          <div class="item">
            <span>名称：</span>
            <p>{{currentBuilding.name}}</p>
          </div>
          <div class="item">
            <span>地址：</span>
            <p>{{currentBuilding.areaName}}</p>
          </div>
        </div>
      </div>
      <div class="building-info-box">
        <div class="title">重点位置监控视频</div>
        <div class="video-wrap">
          <div class="video"></div>
          <div class="video"></div>
          <el-button type="primary" style="width: 100%">查看更多视频</el-button>
        </div>
      </div>
    </div>
    <div class="info-box grid-info" v-if="currentType===1">
      <div class="title">{{currentGrid.name}}</div>
      <div class="content">{{currentGrid.remark}}</div>
    </div>
    <div class="building-info-page" v-if="showBuildingInfo">
      <div class="close" @click.stop="closeBuildingInfo">关闭</div>
      <div class="content">
        <div class="floor-box">
          <div class="title">选择楼层</div>
          <div class="floor">
            <p
              v-for="item in floorList"
              @click="floorClick(item)"
              :class="{active:item.id===currentFloor.id}"
            >{{item.nameLevel}}</p>
          </div>
        </div>
        <div class="img-box">
          <div class="system-box">
            <p @click="systemClick(item)"
               v-for="item in systemList"
               :class="{active:item.id===currentSystem.id}"
            >{{item.name}}</p>
          </div>
          <div class="plan-box">
            <plan :src="addFilePre(currentInstallList.url)"
                  :canDrag="false"
                  :showDelete="false"
                  :points="currentInstallList.installList"
                  @pointClick="pointClick"
                  class="img-plan"></plan>
          </div>

        </div>
      </div>
    </div>
    <common-model :show="showEquipmentModel" title="设备资料" @closeModel="closeModel">
      <div class="equipment-model-box">
        <div class="item-wrap">
          <div class="title">设备信息</div>
          <div class="box">
            <div class="content">
              <div class="item">
                <span>设备名称：</span>
                <p>{{currentEquipment.equipmentName}}</p>
              </div>
              <div class="item">
                <span>设备型号：</span>
                <p>{{currentEquipment.model}}</p>
              </div>
              <div class="item">
                <span>所属系统：</span>
                <p>{{currentEquipment.systemName}}</p>
              </div>
              <div class="item">
                <span>网络号：</span>
                <p>{{currentEquipment.netId}}</p>
              </div>
              <div class="item">
                <span>回路号：</span>
                <p>{{currentEquipment.loopId}}</p>
              </div>
            </div>
            <div class="content">
              <div class="item">
                <span>所在位置：</span>
                <p>{{currentEquipment.location}}</p>
              </div>
              <div class="item">
                <span>投产时间：</span>
                <p>{{currentEquipment.producedTime}}</p>
              </div>
              <div class="item">
                <span>详细地址：</span>
                <p>{{currentBuilding.areaName}}</p>
              </div>
              <div class="item">
                <span>主机号：</span>
                <p>{{currentEquipment.hostId}}</p>
              </div>
              <div class="item">
                <span>地址号：</span>
                <p>{{currentEquipment.addressId}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="item-wrap">
          <div class="title">相关责任人</div>
        </div>
      </div>
    </common-model>
  </div>
</template>
<script>
  import BMap from '../../component/BMap.vue'
  import {mapGetters} from 'vuex'
  import Api from '../../api/index'
  import plan from '../../component/plan.vue'
  import {FilePre} from '../../config/config'
  import commonModel from '../../component/commonModel.vue'
  import jz from '../../assets/image/icon/jz.png'
  import Util from '../../service/util'
  export default{
    components: {
      BMap,
      plan,
      commonModel
    },
    data(){
      return {
        defaultProps: {
          label: 'name',
          children: 'nextList',
          value: 'cityCode'
        },
        treeData: [],
        defaultExpand: ['530400'],
        currentIndex: 0,
        showBuildingInfo: false,
        currentSystem: {},
        currentFloor: {},
        systemList: [],
        floorList: [],
        currentBuilding: {}, // 当前建筑
        currentInstallList: {}, // 当前设备安装列表
        currentType: 0, // 当前类型 0基本信息  1 网格信息 2建筑信息
        currentGrid: {},
        showEquipmentModel: false,
        currentEquipment: {},
        cashType: 0,
        baseInfo: {}
      }
    },
    computed: {
      ...mapGetters(['q_cityInfo'])
    },
    async mounted(){
      await this.getTreeInfo(0)
      this.init()
      this.getFireSystem()
    },
    methods: {
      init(){
        this.renderCity('530000', '530400')
      },
      addFilePre(val){
        return FilePre + val
      },
      tabClick(index){
        this.$refs.bMap.removeAllOverlay()
        this.currentIndex = index
        this.getTreeInfo(index)
      },
      async handleNodeClick(data) {
        if (data.level === '市') {
          this.currentType = 0
          this.renderCity(data.provinceCode, data.cityCode)
        } else if (data.level === '县区') {
          this.currentType = 0
          this.renderCity(data.provinceCode, data.cityCode, data.countyCode)
        } else if (data.level === '网格') {
          this.currentType = 1
          this.renderGrid(data.id)
        } else if (data.level === '单元') {
          this.buildingClick(data)
        } else if (data.level === '单位') {
          this.currentType = 0
          this.organizationClick(data)
        }
      },
      async getTreeInfo(type){
        let data = await Api.fireUnit.getHomeList({type: type})
        data.data.forEach(city => {
          city.id = city.cityCode
        })
        this.treeData = data.data
      },
      async renderCity(provinceCode, cityCode, countyCode = null){ //渲染 市  区
        let unitList = await this.getUnitList(provinceCode, cityCode, countyCode)
        let gridList = await this.getGridList(provinceCode, cityCode, countyCode)
        await  this.getBaseInfo(provinceCode, cityCode, countyCode)
        let city = this.getCityObjById(countyCode || cityCode)
        this.$refs.bMap.removeAllOverlay()
        this.$refs.bMap.centerByPoint(city.lng, city.lat, 15)
        this.renderBuildingByUnitList(unitList)
        gridList.forEach(item => {
          let points = item.longitudeLatitudeList.map((point) => {
            return {lng: point.longitude, lat: point.latitude}
          })
          let pro = this.$refs.bMap.createGridByPoints(points, Util.getRandomColor())
          pro.addEventListener('click', () => {
            this.renderGrid(item.gridId)
          })
        })
      },
      renderBuildingByUnitList(unitList, shouldCenterMap = false){
        let point = null
        unitList.forEach(item => { // 渲染建筑
          if (item.attribute === 0) { // 建筑
            let maker = this.$refs.bMap.addIconPoint(item.longitude, item.latitude, {icon: jz, width: 30, height: 43})
            point = item
            maker.addEventListener('click', () => {
              this.buildingClick(item)
            })
          }
        })
        if (shouldCenterMap) {
          this.$refs.bMap.centerByPoint(point.longitude, point.latitude)
        }
      },
      renderAreaByUnitList(unitList){ // 根据单元列表渲染公共区域
        unitList.forEach(item => {
          if (item.attribute === 1) {
            let points = item.longitudeLatitudeDos.map((point) => {
              return {lng: point.longitude, lat: point.latitude}
            })
            this.$refs.bMap.createGridByPoints(points, Util.getRandomColor())
          }
        })
      },
      async buildingClick(item){ // 单元点击
        let detail = await Api.fireUnit.getUnitDetail({unitId: item.unitId || item.id})
        detail = detail.data
        if (detail.attribute === 0) { // 建筑物
          this.cashType = this.currentType
          this.currentType = 2
          this.currentBuilding = detail
          await this.getFloorList(item.unitId || item.id)
          await this.getFloorEquipmentStallList()
          this.showBuildingInfo = true
        } else { // 公共区域
          let points = detail.longitudeLatitudeDos.map((point) => {
            return {lng: point.longitude, lat: point.latitude}
          })
          this.$refs.bMap.removeAllOverlay()
          this.$refs.bMap.centerByPoint(points[0].lng, points[0].lat, 15)
          this.$refs.bMap.createGridByPoints(points, 'red')
        }
      },
      async organizationClick(item){ // 单位点击
        let unitList = await Api.fireUnit.getUnitListByOrganizationId({organizationId: item.id})
        unitList = unitList.data.list
        this.$refs.bMap.removeAllOverlay()
        this.renderBuildingByUnitList(unitList, true)
        this.renderAreaByUnitList(unitList)
      },
      async renderGrid(id){ // 渲染网格
        let gridDetail = await Api.base.getGridDetail({gridId: id})
        let unitList = await Api.fireUnit.getUnitListByGridId({gridId: id})
        gridDetail = gridDetail.data
        unitList = unitList.data.list
        this.currentGrid = gridDetail
        this.$refs.bMap.removeAllOverlay()
        this.renderBuildingByUnitList(unitList)
        this.renderAreaByUnitList(unitList)
        let points = gridDetail.longitudeLatitudeList.map((point) => {
          return {lng: point.longitude, lat: point.latitude}
        })
        this.$refs.bMap.createGridByPoints(points, 'red', 0.5,)
        this.$refs.bMap.centerByPoint(points[0].lng, points[0].lat, 15)


      },
      async getGridList(provinceCode, cityCode, countyCode){
        let data = await Api.fireUnit.getGridListToUnit({
          provinceCode: provinceCode,
          countyCode: countyCode,
          cityCode: cityCode
        })
        return data.data.list
      },
      async getUnitList(provinceCode, cityCode, countyCode){ //获取消防单元
        let data = await Api.fireUnit.getUnitListByArea({
          provinceCode: provinceCode,
          countyCode: countyCode,
          cityCode: cityCode
        })
        return data.data.list
      },
      async getBaseInfo(provinceCode, cityCode, countyCode = null){
        let data = await Api.fireUnit.getBasicInfo({
          cityCode: cityCode,
          countyCode: countyCode
        })
        Object.keys(data.data).forEach(item => {
          data.data[item] = data.data[item].toString()
        })
        this.baseInfo = data.data
      },
      getCityObjById(id){ // 更具id获取城市对象
        let result = null
        let step = function (item) {
          if (item.id === id) {
            result = item
            return
          }
          if (item.nextArea && item.nextArea.length > 0) {
            item.nextArea.forEach(innerItem => {
              step(innerItem)
            })
          }
        }
        this.q_cityInfo.forEach(item => {
          step(item)
        })
        return JSON.parse(JSON.stringify(result))
      },

      systemClick(item){
        this.currentSystem = item
        this.getFloorEquipmentStallList()
      },
      floorClick(item){
        this.currentFloor = item
        this.getFloorEquipmentStallList()
      },
      closeBuildingInfo(){
        this.currentType = this.cashType
        this.showBuildingInfo = false
      },
      async getFireSystem(){
        let data = await Api.base.getSystemList()
        this.systemList = data.data
        this.currentSystem = data.data[0]
      },
      async getFloorList(unit){
        let data = await Api.fireUnit.getFloorList({unitId: unit})
        this.floorList = data.data.list
        this.currentFloor = this.floorList[0]
      },
      async getFloorEquipmentStallList(){
        let data = await Api.fireUnit.getFloorEquipmentStallList({
          floorId: this.currentFloor.id,
          systemId: this.currentSystem.id,
          unitId: this.currentBuilding.id
        })
        this.currentInstallList = data.data
        this.currentInstallList.installList.forEach(item => {
          item._url = item.equipmentImg
        })
      },
      pointClick(item){
        this.currentEquipment = item
        this.showEquipmentModel = true
      },
      closeModel(){
        this.showEquipmentModel = false
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss'>
  .main-index {
    height: 100%;
    width: 100%;
    position: relative;
    .info-box {
      padding: 14px;
      background: rgba(0, 0, 0, 0.5);
      color: #ffffff;
      position: absolute;
      top: 26px;
      right: 22px;
      border-radius: 6px;
      z-index: 10;
      .title {
        font-weight: bold;
        margin-bottom: 10px;
      }
    }
    .base-info {
      .info-item-wrap {
        .info-item {
          display: flex;
          height: 32px;
          margin-bottom: 2px;
          align-items: center;
          background: #3c3d42;
          p {
            margin-left: 7px;
          }
          ul {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            margin-left: 36px;
            li {
              background: #07c362;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              width: 16px;
              margin-right: 2px;
            }
          }
        }
      }
    }
    .building-info {
      width: 200px;
      position: absolute;
      top: 26px;
      right: 22px;
      color: #ffffff;
      .building-info-box {
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.5);
        padding: 14px;
        margin-bottom: 10px;
        .title {
          font-weight: bold;
          margin-bottom: 10px;
        }
        .building-info-item {
          font-size: 14px;
          .item {
            display: flex;
            p {
              flex: 1
            }
          }
        }
        .video-wrap {
          .video {
            margin-bottom: 12px;
            background: #000000;
            height: 100px;
            border-radius: 6px;
          }
        }
      }
    }
    .grid-info {
      width: 200px;
      .content {
        text-indent: 20px;
      }
    }
    .map-box {
      height: 100%;
      width: 100%;
      display: flex;
      .left-tree-scroll {
        margin-bottom: -17px;
        overflow: hidden;
        background: #323542;
        .tab {
          display: flex;
          width: 100%;
          p {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            height: 50px;
            background: #454751;
            flex: 1;
            font-size: 14px;
            cursor: pointer;
            &.active {
              background: #07c362;
            }
          }
        }
        .el-scrollbar {
          height: 100%;
          background: #323542;
          .left-tree {
            width: 200px;
            height: 100%;
            background: #323542;
            padding: 20px;
            .tree {
              background: #323542;
              color: #ffffff;
              .el-tree-node__content {
                &:hover {
                  background: #51535e;
                }
              }
              .el-tree-node {
                &.is-checked {
                  background-color: #51535e;
                  color: #0fb45e;
                }
                &:focus > .el-tree-node__content {
                  background-color: #51535e;
                  color: #0fb45e;
                }
              }
            }
            .title {
              color: #0fb45e;
              margin-bottom: 14px;
            }
          }
        }
      }
      .right-view {
        flex: 1;
        position: relative;
        height: 100%;
      }
    }
    .building-info-page {
      .close {
        height: 30px;
        width: 56px;
        background: #fb7702;
        margin: 20px;
        color: #ffffff;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
      .content {
        display: flex;
        border-top: 1px solid #d9d9d9;
        .floor-box {
          padding: 24px;
          border-right: 1px solid #d9d9d9;
          .title {
            color: #333333;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .floor {
            p {
              border-bottom: 1px solid #6c6c72;
              height: 40px;
              width: 180px;
              background: #5d5f67;
              line-height: 40px;
              text-align: center;
              color: #ffffff;
              font-weight: bold;
              cursor: pointer;
              &.active {
                background: #07c362;
              }
            }
          }
        }
        .img-box {
          flex: 1;
          padding: 24px;
          .system-box {
            display: flex;
            border-bottom: 1px solid #d9d9d9;
            padding-bottom: 10px;
            p {
              color: #333333;
              font-weight: bold;
              font-size: 14px;
              margin-right: 36px;
              cursor: pointer;
              &.active {
                color: #07c362;
              }
            }
          }
          .plan-box {
            flex: 1;
            margin-right: 200px;
            margin-left: 130px;
            margin-top: 30px;
            .img-plan {
              width: 100%;
              height: 700px;
            }
          }
        }
      }
    }
    .equipment-model-box {
      padding-top: 14px;
      .item-wrap {
        .title {
          font-weight: bold;
          color: #333333;
          margin-left: 20px;
          margin-bottom: 14px;
        }
        .box {
          display: flex;
          margin-left: 44px;
          min-width: 600px;
          .content {
            flex: 1;
            .item {
              font-size: 14px;
              margin-bottom: 12px;
              display: flex;
            }
          }
        }
      }
    }
  }
</style>
