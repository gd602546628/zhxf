<template>
  <div class="fire-unit-add" v-if="!showLineMap">
    <common-box title="添加消防单元">
      <div class="wrap" v-if="unitType===0">
        <el-form class="form-container"
                 ref="form_building"
                 :model="formBuilding"
                 label-width="160px"
                 :rules="buildingRules"
        >
          <div class="unit-add-left">
            <el-form-item label="消防单元名称：" prop="name">
              <el-input placeholder="请输入消防单元名称" v-model="formBuilding.name" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="地址：" prop="latitude">
              <p style="margin-right: 10px">{{formBuilding.areaName}}</p>
              <el-button @click="openMap">地图定位</el-button>
            </el-form-item>
            <el-form-item label="建筑物结构：" prop="structure">
              <el-select placeholder="请选建筑物结构" v-model="formBuilding.structure" filterable>
                <el-option
                  :key="item.number"
                  :label="item.name"
                  :value="item.number"
                  v-for="item in structureList"></el-option>
              </el-select>
              <el-tooltip class="tip-message" effect="dark"
                          :content="getTipMessage('structureList',formBuilding.structure)" placement="bottom-start">
                <p class="tip-message">?</p>
              </el-tooltip>

            </el-form-item>
            <el-form-item label="危险等级：" prop="dangerLevel">
              <el-select placeholder="请选择危险等级" v-model="formBuilding.dangerLevel" filterable>
                <el-option
                  :key="item.number"
                  :label="item.name"
                  :value="item.number"
                  v-for="item in dangerLevelList"></el-option>
              </el-select>
              <el-tooltip class="tip-message" effect="dark"
                          :content="getTipMessage('dangerLevelList',formBuilding.dangerLevel)"
                          placement="bottom-start">
                <p class="tip-message">?</p>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="地下楼层数：" prop="downCount">
              <el-input placeholder="请输入地下楼层数" v-model="formBuilding.downCount" type="number" :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="地下面积（平方米）：" prop="downArea">
              <el-input placeholder="请输入地下面积（平方米）" v-model="formBuilding.downArea" type="number" :maxlength="15"></el-input>
            </el-form-item>
            <el-form-item label="建筑年代：" prop="buildingAge">
              <el-date-picker
                type="date"
                placeholder="请选择日期"
                class="filter-input"
                value-format="yyyy-MM-dd"
                v-model="formBuilding.buildingAge"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="维保单位：" prop="maintenanceId">
              <el-select
                placeholder="请选择维保单位"
                v-model="formBuilding.maintenanceId"
                filterable
              >
                <el-option
                  v-for="item in maintenanceList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="监管部门：" prop="fireBrigadeId">
              <div>{{watchUnitName}}</div>
            </el-form-item>
          </div>
          <div class="unit-add-right">
            <el-form-item label="消防单元属性：">
              <el-select placeholder="请选择消防单元属性" v-model="unitType" filterable>
                <el-option label="建筑" :value="0"></el-option>
                <el-option label="公共区域" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消防网格：" prop="gridId">
              <el-select
                placeholder="请选消防网格"
                v-model="formBuilding.gridId"
                no-data-text="请先进行定位"
                @change="gridChange"
                filterable
              >
                <el-option
                  v-for="item in gridList"
                  :value="item.gridId"
                  :label="item.gridName"
                  :key="item.gridId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="传输装置" prop="transmitDeviceId">
              <el-select placeholder="请选择传输装置"
                         v-model="formBuilding.transmitDeviceId"
                         filterable
                         no-data-text="该网格没有传输装置"
              >
                <el-option :key="item.id"
                           :value="item.id"
                           v-for="item in transmitDeviceList"
                           :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属单位" prop="organizationId">
              <el-select placeholder="请选择所属单位"
                         v-model="formBuilding.organizationId"
                         filterable
                         no-data-text="该网格没有所属单位"
              >
                <el-option :key="item.id"
                           :value="item.id"
                           v-for="item in organizationList"
                           :label="item.name"

                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="建筑耐火等级：" prop="fireLevel">
              <el-select placeholder="请选择建筑耐火等级" v-model="formBuilding.fireLevel" filterable>
                <el-option :key="item.number"
                           :value="item.number"
                           v-for="item in fireList"
                           :label="item.name"
                ></el-option>
              </el-select>
              <el-tooltip class="tip-message" effect="dark"
                          :content="getTipMessage('fireList',formBuilding.fireLevel)" placement="bottom-start">
                <p class="tip-message">?</p>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="建筑高度（米）" prop="height">
              <el-input placeholder="请输入建筑物高度" v-model="formBuilding.height" type="number" :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="地上楼层数：" prop="topCount">
              <el-input placeholder="请输入地上楼层数" v-model="formBuilding.topCount" type="number" :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="地上面积（平方米）：" prop="topArea">
              <el-input placeholder="请输入地上面积（平方米）" v-model="formBuilding.topArea" type="number" :maxlength="15"></el-input>
            </el-form-item>
            <el-form-item label="验收日期：" prop="checkTime">
              <el-date-picker
                type="date"
                placeholder="请选择验收日期"
                class="filter-input"
                value-format="yyyy-MM-dd"
                v-model="formBuilding.checkTime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="巡检单位：" prop="pollingId">
              <div>{{checkUnitName}}</div>
            </el-form-item>
          </div>
        </el-form>
      </div>


      <div class="wrap" v-if="unitType===1">
        <el-form class="form-container"
                 ref="form_public"
                 :model="formPublic"
                 label-width="160px"
                 :rules="buildingRules"
        >
          <div class="unit-add-left">
            <el-form-item label="消防单元名称：" prop="name">
              <el-input placeholder="请输入消防单元名称" v-model="formPublic.name" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="消防网格：" prop="gridId">
              <el-select
                placeholder="请选消防网格"
                v-model="formPublic.gridId"
                no-data-text="请先进行定位"
                @change="gridChange"
                filterable
              >
                <el-option
                  v-for="item in allGridList"
                  :value="item.gridId"
                  :label="item.gridName"
                  :key="item.gridId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属单位" prop="organizationId">
              <el-select placeholder="请选择所属单位"
                         v-model="formPublic.organizationId"
                         filterable
                         no-data-text="该网格没有所属单位"
              >
                <el-option :key="item.id"
                           :value="item.id"
                           v-for="item in organizationList1"
                           :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消防单元范围：" prop="areaCoord">
              <el-button @click="openLineMap">范围划定</el-button>
            </el-form-item>
            <el-form-item label="巡检单位：" prop="pollingId">
              <div>{{checkUnitName}}</div>
            </el-form-item>
            <el-form-item label="主要建筑物结构：" prop="structure">
              <el-select placeholder="请选主要建筑物结构" v-model="formPublic.structure" filterable>
                <el-option
                  :key="item.number"
                  :label="item.name"
                  :value="item.number"
                  v-for="item in structureList"></el-option>
              </el-select>
              <el-tooltip class="tip-message" effect="dark"
                          :content="getTipMessage('structureList',formPublic.structure)" placement="bottom-start">
                <p class="tip-message">?</p>
              </el-tooltip>
            </el-form-item>
          </div>
          <div class="unit-add-right">
            <el-form-item label="消防单元属性：">
              <el-select placeholder="请选择消防单元属性" v-model="unitType" filterable>
                <el-option label="建筑" :value="0"></el-option>
                <el-option label="公共区域" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="传输装置" prop="transmitDeviceId">
              <el-select placeholder="请选择传输装置"
                         v-model="formPublic.transmitDeviceId"
                         filterable
                         no-data-text="该网格没有传输装置">
                <el-option :key="item.id"
                           :value="item.id"
                           v-for="item in transmitDeviceList1"
                           :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="建筑耐火等级：" prop="fireLevel">
              <el-select placeholder="请选择建筑耐火等级" v-model="formPublic.fireLevel" filterable>
                <el-option :key="item.number"
                           :value="item.number"
                           v-for="item in fireList"
                           :label="item.name"></el-option>
              </el-select>
              <el-tooltip class="tip-message" effect="dark"
                          :content="getTipMessage('fireList',formPublic.fireLevel)" placement="bottom-start">
                <p class="tip-message">?</p>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="危险等级：" prop="dangerLevel">
              <el-select placeholder="请选择危险等级" v-model="formPublic.dangerLevel" filterable>
                <el-option
                  :key="item.number"
                  :label="item.name"
                  :value="item.number"
                  v-for="item in dangerLevelList"

                ></el-option>
              </el-select>
              <el-tooltip class="tip-message" effect="dark"
                          :content="getTipMessage('dangerLevelList',formPublic.dangerLevel)" placement="bottom-start">
                <p class="tip-message">?</p>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="维保单位：" prop="maintenanceId">
              <el-select
                placeholder="请选择维保单位"
                v-model="formPublic.maintenanceId"
                filterable
              >
                <el-option
                  v-for="item in maintenanceList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="监管部门：" prop="fireBrigadeId">
              <div>{{watchUnitName1}}</div>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="btn-group">
        <el-button type="info" @click="close()">取消</el-button>
        <el-button type="primary" @click="next()">下一步</el-button>
      </div>
    </common-box>

    <common-model title="定位消防单元位置" :show="showMap" class="map-wrap" @closeModel="hideMap">
      <div class="map-content">
        <b-map style="width: 100%;height: 480px;" ref="bMap" @mapClick="mapClick" v-if="showMap"></b-map>
        <div class="btn-group">
          <el-button type="primary" @click="mapConfirm()">保存</el-button>
          <el-button type="info" @click="hideMap()">取消</el-button>
        </div>
        <div class="map-search">
          <input placeholder="请输入搜索的地址" v-model="mapSearchStr">
          <div @click.stop="mapSearch">搜索</div>
        </div>
      </div>
    </common-model>
  </div>

  <line-map
    @confirm="lineMapConfirm"
    @cancel="hideLineMap"
    v-else
    :notEditPoint="notEditPoint"
    :defaultPoint="lineMapCenterPoint"
    :editPoints="editPoints"
  ></line-map>

</template>
<script>
  import lineMap from '../../component/delineationMap.vue'
  import CommonBox from '../../component/commonBox.vue'
  import {Code as Code} from '../../config/config'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import BMap from '../../component/BMap.vue'
  import CommonModel from '../../component/commonModel.vue'
  import Api from '../../api/index'
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        id: '',
        formBuilding: {  //建筑类表单
          areaCoord: '',
          areaName: '',
          attribute: '',
          buildingAge: '',
          checkTime: '',
          dangerLevel: '',
          downArea: '',
          downCount: '',
          fireBrigadeId: '',
          fireLevel: '',
          gridId: '',
          height: '',
          id: '',
          latitude: '',
          longitude: '',
          maintenanceId: '',
          name: '',
          pollingId: '',
          structure: '',
          topArea: '',
          topCount: '',
          organizationId: '',
          transmitDeviceId: ''
        },
        buildingRules: {
          areaCoord: [{required: true, message: '请进行范围划定', trigger: 'blur'},],
          areaName: [{required: true, message: '请输入详细地址', trigger: 'blur'},],
          buildingAge: [{required: true, message: '请选择建筑年代', trigger: 'blur'},],
          checkTime: [{required: true, message: '请选择验收时间', trigger: 'blur'},],
          dangerLevel: [{required: true, message: '请选择危险等级', trigger: 'blur'},],
          downArea: [{required: true, message: '请输入地下面积', trigger: 'blur'},],
          downCount: [{required: true, message: '请输入地下楼层', trigger: 'blur'},],
          fireBrigadeId: [{required: true, message: '请输入监管部门', trigger: 'blur'},],
          fireLevel: [{required: true, message: '请选择耐火等级', trigger: 'blur'},],
          gridId: [{required: true, message: '请选择消防网格', trigger: 'blur'},],
          height: [{required: true, message: '请输入建筑物高度', trigger: 'blur'},],
          latitude: [{required: true, message: '请选择建筑物位置', trigger: 'blur'},],
          maintenanceId: [{required: true, message: '请选择维保单位', trigger: 'blur'},],
          name: [{required: true, message: '请输入消防单元名称', trigger: 'blur'},],
          pollingId: [{required: true, message: '请输入巡检单位', trigger: 'blur'},],
          structure: [{required: true, message: '请选择建筑物结构', trigger: 'blur'},],
          topArea: [{required: true, message: '请输入地上面积', trigger: 'blur'},],
          topCount: [{required: true, message: '请输入地上楼层数', trigger: 'blur'},],
          transmitDeviceId: [{required: true, message: '请选择传输装置', trigger: 'blur'},],
          organizationId: [{required: true, message: '请选择单位', trigger: 'blur'},],
        },
        formPublic: {  //公共区域类表单
          areaCoord: '',
          areaName: '',
          attribute: '',
          buildingAge: '',
          checkTime: '',
          dangerLevel: '',
          downArea: '',
          downCount: '',
          fireBrigadeId: '',
          fireLevel: '',
          gridId: '',
          height: '',
          id: '',
          latitude: '',
          longitude: '',
          maintenanceId: '',
          name: '',
          pollingId: '',
          structure: '',
          topArea: '',
          topCount: '',
          organizationId: '',
          transmitDeviceId: ''
        },
        unitType: 0,  // 0建筑 1公共区域
        showMap: false,// 显示定位地图
        mapSearchStr: '',
        showLineMap: false, //显示网格地图
        dangerLevelList: [],
        fireList: [],
        structureList: [],
        gridList: [], // 建筑类网格列表，先定位再选网格
        mapAddress: {
          province: '',
          city: '',
          county: '',
          lat: '',
          lng: '',
          address: ''
        },
        checkUnitName: '', // 巡检单位名称
        watchUnitName: '', // 建筑监管部门名称
        watchUnitName1: '', // 区域监管部门名称
        maintenanceList: [], // 维保单位列表
        allGridList: [], // 所有消防网格列表  针对公共区域，先选网格再划分
        notEditPoint: [], // 消防网格点
        editPoints: [], // 划分区域网格点
        lineMapCenterPoint: null,
        transmitDeviceList: [], // 建筑传输装置列表
        organizationList: [], //建筑单位列表
        transmitDeviceList1: [], // 区域传输装置列表
        organizationList1: [],// 区域单位列表
      }
    },
    computed: {
      ...mapGetters(['q_cityInfo', 'parent_user', 'sysUserBg'])
    },
    created(){
      this.unitType = parseInt(this.$route.params.unitType) || 0
      if (this.parent_user) { // 子级账号
        this.checkUnitName = this.parent_user.name
        this.formBuilding.pollingId = this.parent_user.id
        this.formPublic.pollingId = this.parent_user.id
      } else { // super 或者一级账号
        this.checkUnitName = this.sysUserBg.name
        this.formBuilding.pollingId = this.sysUserBg.id
        this.formPublic.pollingId = this.sysUserBg.id
      }
      this.getEnumList()
      this.getMaintenanceList()
      this.getAllGridList()
    },
    mounted() {
      if (this.$route.params.id) {
        this.getUnitDetail()
      }
    },
    methods: {
      close() {
        this.$router.back()
      },
      next() {
        if (this.unitType === 0) {
          this.$refs.form_building.validate(async flag => {
            if (flag) {
              this.formBuilding.attribute = 0
              let data = await Api.fireUnit.addOrUpdateUnit(this.formBuilding)
              if (data.code === Code.SUCCESS) {
                this.$router.replace({name: 'floorSetting', params: {id: data.data.unitId}})
              }
              else {
                this.$message.success(data.mesg)
              }
            }
          })
        } else if (this.unitType === 1) {
          this.$refs.form_public.validate(async flag => {
            if (flag) {
              this.formPublic.attribute = 1
              let data = await Api.fireUnit.addOrUpdateUnit(this.formPublic)
              if (data.code === Code.SUCCESS) {
                this.$router.replace({name: 'fireUnitEquipment', params: {id: data.data.unitId, unitType: 1}})
              }
              else {
                this.$message.error(data.mesg)
              }
            }
          })
        }
      },
      openLineMap(){ //打开范围划定
        if (this.formPublic.gridId) {
          this.allGridList.forEach(item => {
            if (item.gridId === this.formPublic.gridId) {
              console.log(item)
              this.lineMapCenterPoint = {
                lat: item.longitudeLatitudeList[0].latitude,
                lon: item.longitudeLatitudeList[0].longitude
              }
              item.longitudeLatitudeList.forEach((point) => {
                this.notEditPoint.push({lng: point.longitude, lat: point.latitude})
              })
            }
          })
          this.showLineMap = true
        } else {
          this.$alert('请先选择消防网格')
        }
      },
      openMap(){ // 打开地图定位
        if (this.formBuilding.gridId) {
          this.showMap = true
          let result = []
          this.gridList.forEach(item => {
            if (item.gridId === this.formBuilding.gridId) {
              item.longitudeLatitudeList.forEach((point) => {
                result.push({lng: point.longitude, lat: point.latitude})
              })
            }
          })
          this.$nextTick(() => {
            if (this.formBuilding.longitude) {
              this.$refs.bMap.addPoint(this.formBuilding.longitude, this.formBuilding.latitude)
              this.$refs.bMap.centerByPoint(this.formBuilding.longitude, this.formBuilding.latitude)
              this.mapSearchStr = this.formBuilding.areaName
            } else {
              // this.$refs.bMap.addPoint(result[0].lng, result[0].lat)
              this.$refs.bMap.centerByPoint(result[0].lng, result[0].lat)
              this.mapSearchStr = this.formBuilding.areaName
            }
            this.$refs.bMap.createGridByPoints(result, 'red').disableMassClear()
          })
        } else {
          this.$alert('请先选择消防网格')
        }
      },
      async mapConfirm(){ //地图定位确定
        this.formBuilding.latitude = this.mapAddress.lat
        this.formBuilding.longitude = this.mapAddress.lng
        this.formBuilding.areaName = this.mapAddress.address
        this.showMap = false
        //let province = this.getCityObjByName(this.mapAddress.province)
        //let city = this.getCityObjByName(this.mapAddress.city)
        // let county = this.getCityObjByName(this.mapAddress.county)
        // await this.getGridList(province.id, city.id, county.id)
        //  this.getOrganizationList(province.id, city.id, county.id)
      },
      hideMap(){
        this.showMap = false
      },
      async mapClick(point){ // 定位地图点击
        this.$refs.bMap.removeAllOverlay()
        this.$refs.bMap.addPoint(point.point.lng, point.point.lat)
        let zoom = this.$refs.bMap.map.getZoom()
        zoom = zoom === 3 ? 15 : zoom
        this.$refs.bMap.centerByPoint(point.point.lng, point.point.lat, zoom)
        this.mapAddress.lat = point.point.lat
        this.mapAddress.lng = point.point.lng
        let data = await this.$refs.bMap.pointToAddress(point.point.lng, point.point.lat)
        this.mapSearchStr = data.address
        this.mapAddress.address = data.address
        this.mapAddress.province = data.addressComponents.province
        this.mapAddress.city = data.addressComponents.city
        this.mapAddress.county = data.addressComponents.district
      },
      async mapSearch(){ // 定位地图搜索
        this.$refs.bMap.removeAllOverlay()
        this.$refs.bMap.addPointByAddress(this.mapSearchStr)
        let zoom = this.$refs.bMap.map.getZoom()
        zoom = zoom === 3 ? 15 : zoom
        this.$refs.bMap.centerByAddress(this.mapSearchStr, zoom)
        let point = await this.$refs.bMap.addressToPoint(this.mapSearchStr)
        let address = await this.$refs.bMap.pointToAddress(point.lng, point.lat)
        this.mapAddress.lng = point.lng
        this.mapAddress.lat = point.lat
        this.mapSearchStr = address.address
        this.mapAddress.address = address.address
        this.mapAddress.province = address.addressComponents.province
        this.mapAddress.city = address.addressComponents.city
        this.mapAddress.county = address.addressComponents.district
      },
      getCityObjByName(name){ // 更具id获取城市对象
        let result = null
        let step = function (item) {
          if (item.name.indexOf(name) >= 0) {
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
      hideLineMap(){
        this.showLineMap = false
      },
      lineMapConfirm(value){
        let result = ''
        this.editPoints = []
        value.forEach(point => {
          this.editPoints.push(point)
          result += `(${point.lng},${point.lat}),`
        })
        this.formPublic.areaCoord = result.substr(0, result.length - 1)
        this.showLineMap = false
      },
      async getEnumList(){
        let data = await Api.fireUnit.getEnumList()
        this.dangerLevelList = data.data.dangerLevelList
        this.fireList = data.data.fireList
        this.structureList = data.data.structureList
      },
      async getGridList(province, city, county){
        let data = await Api.fireUnit.getGridListToUnit({
          cityCode: city,
          countyCode: county,
          provinceCode: province
        })
        this.gridList = data.data.list
      },
      gridChange(val){ // 选择网格
        this.getTransmitDeviceList(val)
        this.transmitDeviceList = []
        this.transmitDeviceList1 = []
        if (this.unitType === 0) {
          this.gridList.forEach(item => {
            if (item.gridId === val) {
              this.formBuilding.fireBrigadeId = item.supUserId
              this.watchUnitName = item.supName
              this.getOrganizationList(item.provinceCode, item.cityCode, item.countyCode)
            }
          })
        } else {
          this.organizationList1 = []
          this.allGridList.forEach(item => {
            if (item.gridId === val) {
              this.formPublic.fireBrigadeId = item.supUserId
              this.watchUnitName1 = item.supName
              this.getOrganizationList(item.provinceCode, item.cityCode, item.countyCode)
            }
          })
        }
      },
      async getMaintenanceList(){
        /*TODO:跟换接口*/
        let data = await Api.setting.getAccount({
          pageSize: 1000,
          pageNum: 1,
          type: 1
        })
        this.maintenanceList = data.data.list
      },
      async getAllGridList(){
        let data = await Api.fireUnit.getGridListToUnit()
        this.allGridList = data.data.list
        this.gridList = data.data.list
      },
      async getUnitDetail(){
        let data = await Api.fireUnit.getUnitDetail({
          unitId: parseInt(this.$route.params.id)
        })
        if (parseInt(this.$route.params.unitType) === 0) {
          Object.assign(this.formBuilding, data.data)
          console.log(this.formBuilding)
          this.mapSearchStr = data.data.areaName
          this.gridChange(data.data.gridId)
        } else {
          Object.assign(this.formPublic, data.data)
          this.gridChange(data.data.gridId)
          let areaCoord = data.data.areaCoord
          areaCoord = areaCoord.replace(/\(/g, '[')
          areaCoord = areaCoord.replace(/\)/g, ']')
          areaCoord = '[' + areaCoord
          areaCoord = areaCoord + ']'
          areaCoord = JSON.parse(areaCoord)
          areaCoord.forEach(point => {
            this.editPoints.push({
              lng: point[0],
              lat: point[1]
            })
          })
        }
      },
      getTipMessage(type, number){
        let result = ''
        this[type].forEach(item => {
          if (number === item.number) {
            result = item.description
          }
        })
        return result
      },
      async getTransmitDeviceList(gridId){
        let data = await Api.base.getTransmitDeviceList({gridId: gridId})
        if (this.unitType === 0) {
          this.transmitDeviceList = data.data.list
        } else if (this.unitType === 1) {
          this.transmitDeviceList1 = data.data.list
        }
      },
      async getOrganizationList(provinceCode, cityCode, countyCode){
        let data = await Api.base.getOrganizationList({provinceCode, cityCode, countyCode})
        if (this.unitType === 0) {
          this.organizationList = data.data.list
        } else if (this.unitType === 1) {
          this.organizationList1 = data.data.list
        }
      }
    },
    components: {
      ElCol,
      ElRow,
      CommonBox,
      BMap,
      CommonModel,
      lineMap
    }
  }
</script>
<style lang="scss" type="text/scss">
  .el-tooltip__popper {
    max-width: 30%;
  }

  .fire-unit-add {
    padding: 20px;
    .form-container {
      display: flex;
      width: 80%;
      margin: 0 auto;
      .unit-add-right, .unit-add-left {
        padding: 20px;
        flex: 1;
      }
      .el-form-item {
        .el-form-item__content {
          display: flex;
          align-items: center;
        }
        .tip-message {
          margin-left: 20px;
          width: 20px;
          height: 20px;
          background: #ff3c3c;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .btn-group {
      display: flex;
      justify-content: center;
      margin: 10px 0;
    }

    .map-wrap {
      position: absolute !important;
      .wrap {
        width: 70%;
      }
      .map-content {
        position: relative;
        .map-search {
          width: 500px;
          display: flex;
          height: 40px;
          border: 1px solid #07c362;
          border-radius: 6px;
          overflow: hidden;
          position: absolute;
          top: 20px;
          left: 50%;
          margin-left: -250px;
          input {
            outline: none;
            background: #ffffff;
            flex: 1;
            border: none;
            padding-left: 20px;
          }
          div {
            background: #07c362;
            width: 70px;
            color: #ffffff;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }

    }
  }

</style>
