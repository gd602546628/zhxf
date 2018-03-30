<template>
  <div class="fire-unit-equipment">
    <div class="header-operation">
      <div class="back all-center" @click="goBack">
        返回
      </div>
      <div class="save all-center" @click="save">
        保存
      </div>
      <div class="list all-center" @click.stop="switchShowTable">
        {{showTable ? '消防图显示' : '列表显示'}}
      </div>
    </div>
    <div class="content" v-show="!showTable">
      <div class="floor" v-if="unitType===0">
        <div class="title">选择楼层</div>
        <ul>
          <li
            v-for="(item,index) in floorList"
            :class="{active:currentFloorIndex===index}"
            @click="floorClick(item,index)"
          >{{item.nameLevel}}
          </li>
        </ul>
      </div>
      <div class="equipment">
        <ul class="system">
          <li
            :class="{active:currentSystemIndex===index}"
            v-for="(item,index) in fireSystemList"
            @click="systemClick(item,index)"
          >{{item.name}}
          </li>
        </ul>
        <ul class="equipment-item">
          <li
            draggable="true"
            v-for="(item,index) in fireEquipmentList"
            @dragstart="equipmentDrag(item)"
          >
            <img :src="addFilePre(item.icon)" width="24" height="24" style="margin-right: 10px">
            {{item.name}}
          </li>
        </ul>
        <div class="image-wrap">
          <ul class="count">
            <li v-for="item in currentSystem.equipmentCountList">{{item.equipmentName}} X{{item.counts}}</li>
          </ul>
          <div class="image-item">
            <plan
              style="height: 500px;"
              :src="addFilePre(currentFloor.url)"
              :points="planShowList"
              @drop="planDrop"
              ref="plan"
              @delete="planDelete"
              v-if="unitType===0&&currentFloor.url"
              @pointClick="pointClick"
            ></plan>
            <b-map style="height:500px;width: 100%"
                   ref="bMap"
                   @drop="mapDrop"
                   :showDelete="true"
                   v-if="unitType===1"
            ></b-map>
          </div>
        </div>
      </div>
    </div>
    <div class="table-content" v-show="showTable">
      <div class="filter-wrap flex">
        <div class="filter-form flex" column flex1>
          <div class="filter-form-item">
            <div class="item">
              <span>消防设备名称：</span>
              <el-input placeholder="请输入消防设备名称" class="filter-input" v-model="filterData.name"></el-input>
            </div>
            <div class="item">
              <span>设备所属系统：</span>
              <el-select placeholder="请选择设备所属系统"
                         class="filter-input"
                         v-model="filterData.systemId"
                         @change="filterSystemChange"
              >
                <el-option :label="item.name" :value="item.id" v-for="item in fireSystemList"
                           :key="item.id"></el-option>
              </el-select>
            </div>
          </div>
          <div class="filter-form-item">
            <div class="item">
              <span>创建时间：</span>
              <el-date-picker
                type="date"
                placeholder="选择开始时间"
                class="filter-input"
                value-format="yyyy-MM-dd"
                v-model="filterData.startTime"
              ></el-date-picker>
              <span class="line"></span>
              <el-date-picker
                type="date"
                placeholder="选择结束时间"
                class="filter-input"
                value-format="yyyy-MM-dd"
                v-model="filterData.endTime"
              ></el-date-picker>
            </div>
          </div>
        </div>
        <div class="filter-btn-wrap">
          <div class="btn all-center" @click="filterFn">
            <i class="icon-sxuan"></i>
            <p>筛选</p>
          </div>
        </div>
      </div>
      <common-table :tableHeader="tableHeader" :tableData="tableData" :hideDelete="true"></common-table>
    </div>
    <common-model :show="showAddPointModel" title="消防设备信息" @closeModel="addPointModelClose" class="addPoint-model">
      <el-form :model="addPointParams" :rules="addRules" ref="add_form">
        <el-form-item label="位置描述：" prop="location">
          <el-input v-model="addPointParams.location"></el-input>
        </el-form-item>
        <el-form-item label="网络号：" prop="netId">
          <el-input v-model="addPointParams.netId"></el-input>
        </el-form-item>
        <el-form-item label="主机号：" prop="hostId">
          <el-input v-model="addPointParams.hostId"></el-input>
        </el-form-item>
        <el-form-item label="回路号：" prop="loopId">
          <el-input v-model="addPointParams.loopId"></el-input>
        </el-form-item>
        <el-form-item label="地址号：" prop="addressId">
          <el-input v-model="addPointParams.addressId"></el-input>
        </el-form-item>
        <el-form-item label="品牌：" prop="brand">
          <el-input v-model="addPointParams.brand"></el-input>
        </el-form-item>
        <el-form-item label="型号：" prop="model">
          <el-input v-model="addPointParams.model"></el-input>
        </el-form-item>
        <el-form-item label="生产日期：" prop="producedTime">
          <el-date-picker
            type="date"
            placeholder="请选择日期"
            class="filter-input"
            value-format="yyyy-MM-dd"
            v-model="addPointParams.producedTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="服役年限：" prop="serviceLenght">
          <el-input v-model="addPointParams.serviceLenght"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-group">
        <el-button type="primary" @click="addPointModelConfirm">确定</el-button>
        <el-button type="info" @click="addPointModelClose">取消</el-button>
      </div>
    </common-model>
  </div>
</template>
<script>
  import plan from '../../component/plan.vue'
  import bMap from '../../component/BMap.vue'
  import Api from '../../api/index'
  import {Code, FilePre} from '../../config/config'
  import CommonModel from '../../component/commonModel.vue'
  import CommonTable from '../../component/table.vue'
  export default{
    components: {
      plan,
      bMap,
      CommonModel,
      CommonTable
    },
    data(){
      return {
        unitType: '',
        id: '',
        floorList: [],
        currentFloorIndex: 0,
        fireSystemList: [],
        fireEquipmentList: [],
        currentSystemIndex: 0,
        currentSystem: {installList: []},//当前系统
        currentFloor: {url: ''}, //当前选择的楼层
        currentDragEquipment: null, // 当前拖拽的设备
        saveFlag: false,// 标识当前编辑是否保存
        addPointParams: {
          addressId: '',
          brand: '',
          equipmentId: '',
          hostId: '',
          id: null,
          latitude: '',
          location: '',
          longitude: '',
          loopId: '',
          model: '',
          netId: '',
          nfc: null,
          positionX: '',
          positionY: '',
          producedTime: '',
          serviceLenght: '',
          systemId: '',
          equipmentType: null
        },
        addRules: {
          addressId: [{required: true, message: '请输入地址号', trigger: 'blur'},],
          brand: [{required: true, message: '请输入品牌', trigger: 'blur'},],
          hostId: [{required: true, message: '请输入主机号', trigger: 'blur'},],
          location: [{required: true, message: '请输入描述位置', trigger: 'blur'},],
          loopId: [{required: true, message: '请输入回路号', trigger: 'blur'},],
          model: [{required: true, message: '请输入型号', trigger: 'blur'},],
          netId: [{required: true, message: '请输入网络号', trigger: 'blur'},],
          producedTime: [{required: true, message: '请选择生产日期', trigger: 'blur'},],
          serviceLenght: [{required: true, message: '请输入服役年限', trigger: 'blur'},],
        },
        showAddPointModel: false,
        currentPlanPoint: { // 当前放置点位置信息
          x: '',
          y: ''
        },
        currentMapPoint: {
          lng: '',
          lat: ''
        },
        planShowList: [],
        editPointFlag: false, // 标识是否是编辑点
        currentEditPoint: null, // 当前正在编辑的点
        showTable: false, // 列表显示
        tableData: [],
        tableHeader: [
          {label: '消防设备名称', prop: 'equipmentName'},
          {label: '所在位置', prop: 'location'},
          {label: '设备所属系统', prop: 'systemName'},
          {label: '网络号', prop: 'netId'},
          {label: '主机号', prop: 'hostId'},
          {label: '回路号', prop: 'loopId'},
          {label: '地址号', prop: 'addressId'},
          {label: '投产日期', prop: 'producedTime'},
          {label: '服役年限', prop: 'serviceLenght'},
        ],
        filterData: {
          name: '',
          systemId: '',
          startTime: '',
          endTime: ''
        },
        operation: [{
          label: '编辑',
          color: '#20a7fe',
          handle: this.editHandler,
        },
          {
            label: '删除',
            color: '#ff3c3c',
            handle: this.deleteHandler,
          }]
      }
    },
    async created(){
      this.id = parseInt(this.$route.params.id)
      this.unitType = parseInt(this.$route.params.unitType)
    },
    async mounted(){
      await this.init()
      this.getFireSystem()
    },
    /* beforeRouteLeave(to, from, next) {
     if (!this.saveFlag) {
     next(false)
     this.$confirm('您还未保存，是否离开当前页面?', '提示', {
     confirmButtonText: '确定',
     cancelButtonText: '取消',
     type: 'warning'
     }).then(() => {
     next()
     }).catch(() => {
     next(false)
     })
     } else {
     next()
     }
     },*/
    methods: {
      addPointModelClose(){ // 关闭添加点模态框
        this.showAddPointModel = false
        this.editPointFlag = false
      },
      pointClick(item){
        Object.assign(this.addPointParams, item)
        this.editPointFlag = true
        this.currentEditPoint = item
        this.showAddPointModel = true
      },
      addPointModelConfirm(){// 确认添加点
        this.$refs.add_form.validate(flag => {
          if (flag) {
            if (this.editPointFlag) { // 编辑点
              Object.assign(this.currentEditPoint, this.addPointParams)
            } else {
              this.addPointParams._url = this.currentDragEquipment.icon
              this.addPointParams.systemId = this.currentSystem.id
              this.addPointParams.equipmentId = this.currentDragEquipment.id
              this.addPointParams.equipmentName = this.currentDragEquipment.name
              this.addPointParams.systemName = this.currentSystem.name
              this.addPointParams.equipmentType = this.currentDragEquipment.type
              if (this.unitType === 0) {
                this.addPointParams.positionX = this.currentPlanPoint.x
                this.addPointParams.positionY = this.currentPlanPoint.y
              } else {
                this.addPointParams.longitude = this.currentMapPoint.lng
                this.addPointParams.latitude = this.currentMapPoint.lat
              }
              this.currentSystem.installList.unshift(JSON.parse(JSON.stringify(this.addPointParams)))
              this.currentSystem.installList[0].operation = this.operation
              this.planShowList = this.currentSystem.installList
              if (this.unitType === 1) this.addMapPoint(0)


              let flagIndex = -1
              this.currentSystem.equipmentCountList.forEach((item, index) => {
                if (item.equipmentId === this.currentDragEquipment.id) {
                  flagIndex = index
                }
              })
              if (flagIndex >= 0) {
                this.currentSystem.equipmentCountList[flagIndex].counts += 1
              }else{
                this.currentSystem.equipmentCountList.push({
                  counts: 1,
                  equipmentId: this.currentDragEquipment.id,
                  equipmentName: this.currentDragEquipment.name
                })
              }
            }
            this.addPointModelClose()
          }
        })
      },
      equipmentDrag(item){
        this.currentDragEquipment = item
      },
      planDrop({x, y}){
        this.currentPlanPoint.x = x
        this.currentPlanPoint.y = y
        this.showAddPointModel = true
      },
      planDelete(index){ // 点拖入垃圾桶
        let deleteItem = this.currentSystem.installList.splice(index, 1)
        deleteItem = deleteItem[0]
        this.planShowList = this.currentSystem.installList
        this.currentSystem.equipmentCountList.forEach(item => {
          if (item.equipmentId === deleteItem.equipmentId) {
            item.counts -= 1
          }
        })
      },
      mapDrop(point){
        this.currentMapPoint.lat = point.lat
        this.currentMapPoint.lng = point.lng
        this.showAddPointModel = true
      },
      goBack(){
        this.$router.back()
      },
      async init(){
        if (this.unitType === 0) {
          await this.getFloorList()
        }
      },
      async getFloorList(){
        let data = await Api.fireUnit.getFloorList({unitId: this.id})
        this.floorList = data.data.list
        this.currentFloor = data.data.list[0]
      },
      async getFireSystem(){
        let data = await Api.base.getSystemList()
        this.fireSystemList = data.data
        this.systemClick(this.fireSystemList[0], 0)
      },
      async systemClick(item, index){
        this.currentSystemIndex = index
        await this.getEquipmentList(item.id)
        if (!item.installList) {
          let data = await Api.fireUnit.getFloorEquipmentStallList({
            floorId: this.currentFloor.id,
            unitId: this.id,
            systemId: item.id
          })
          item.installList = data.data.installList
          item.longitudeLatitudeDoList = data.data.longitudeLatitudeDoList
        }
        if (!item.equipmentCountList) {
          item.equipmentCountList = await this.getIntallEquipmentCounts(this.id, item.id, this.currentFloor.id,)
        }
        this.currentSystem = item
        this.currentSystem.installList.forEach(item => {
          item.operation = this.operation
          if (item.equipmentImg) {
            item._url = item.equipmentImg
          }
        })
        this.planShowList = this.currentSystem.installList

        if (this.unitType === 1) { // 公共区域，渲染地图
          let grid = []
          this.currentSystem.longitudeLatitudeDoList.forEach(point => {
            grid.push({lng: point.longitude, lat: point.latitude})
          })
          this.$refs.bMap.removeAllOverlay()
          let zoom = this.$refs.bMap.map.getZoom()
          zoom = zoom === 3 ? 18 : zoom
          this.$refs.bMap.centerByPoint(grid[0].lng, grid[0].lat, zoom)
          this.$refs.bMap.createGridByPoints(grid, 'blue').disableMassClear()
          this.currentSystem.installList.forEach((item, index) => {
            this.addMapPoint(index)
          })
        }
      },
      async getEquipmentList(id){
        let data = await Api.base.getEquipmentList({systemId: id})
        this.fireEquipmentList = data.data
      },
      async floorClick(item, index){
        if (!this.saveFlag) {
          await this.$confirm('您还未保存，是否切换楼层?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          this.currentFloor = item
          this.currentFloorIndex = index
          this.saveFlag = false
          this.getFireSystem()
        } else {
          this.currentFloor = item
          this.currentFloorIndex = index
          this.saveFlag = false
          this.getFireSystem()
        }
      },
      addFilePre(val){
        return FilePre + val
      },
      async save(){
        let params = {
          InstallEquipmentList: [],
          attribute: this.unitType,
          floorId: null,
          unitId: this.id
        }
        if (this.unitType === 0) {
          params.floorId = this.currentFloor.id
        }
        this.fireSystemList.forEach(item => {
          if (item.installList) {
            item.installList.forEach(list => {
              // 清空每个安装设备的_maker，解决循环引用
              let _maker = list._maker
              list._maker = null
              let copy = JSON.parse(JSON.stringify(list))
              list._maker = _maker
              params.InstallEquipmentList.push(copy)
            })
          }
        })
        let data = await Api.fireUnit.addInstallEquipment(JSON.parse(JSON.stringify(params)))
        if (data.code === Code.SUCCESS) {
          this.$message.success('保存成功')
          this.saveFlag = true
        } else {
          this.$message.success(data.mesg)
        }
      },
      addMapPoint(index){
        let item = this.currentSystem.installList[index]
        let timer = null
        let click = () => {
          clearTimeout(timer)
          timer = setTimeout(() => {
            // if (dbFlag) return
            Object.assign(this.addPointParams, item)
            this.editPointFlag = true
            this.currentEditPoint = item
            this.showAddPointModel = true
          }, 300)
        }
        let doubleClick = () => {
          clearTimeout(timer)
          let deleteItem = this.currentSystem.installList.splice(this.currentSystem.installList.indexOf(item), 1)
          deleteItem = deleteItem[0]
          this.currentSystem.equipmentCountList.forEach(item => {
            if (item.equipmentId === deleteItem.equipmentId) {
              item.counts -= 1
            }
          })
          this.$refs.bMap.map.removeOverlay(item._maker)
        }
        let dragEnd = (e) => {
          item.latitude = e.point.lat
          item.longitude = e.point.lng
        }
        item._maker = this.$refs.bMap.addIconPoint(
          item.longitude,
          item.latitude,
          {enableDragging: true, icon: FilePre + item._url},
          click,
          doubleClick,
          dragEnd
        )
      },
      async getIntallEquipmentCounts(unitId, systemId, floorId = null){
        let data = await Api.fireUnit.getIntallEquipmentCounts({
          unitId: unitId,
          systemId: systemId,
          floorId: floorId
        })
        return data.data.list
      },
      switchShowTable(){
        this.showTable = !this.showTable
        if (this.showTable) {
          this.filterData.systemId = this.currentSystem.id
          let result = []
          this.currentSystem.installList.forEach(item => {
            result.push(item)
          })
          this.tableData = result
        }
      },
      async filterFn(){
        let list = []
        let currentSystem = null
        let currentIndex = 0
        this.fireSystemList.forEach((item, index) => {
          if (item.id === this.filterData.systemId) {
            currentSystem = item
            currentIndex = index
          }
        })
        await this.systemClick(currentSystem, currentIndex)
        list = currentSystem.installList
        let result = []
        list.forEach(item => {
          let timeCheck = false
          let nameCheck = item.equipmentName.indexOf(this.filterData.name) >= 0
          if (this.filterData.startTime && this.filterData.endTime) {
            timeCheck = new Date(this.filterData.startTime) <= new Date(item.producedTime) && new Date(this.filterData.endTime) >= new Date(item.producedTime)
          } else if (this.filterData.startTime && !this.filterData.endTime) {
            timeCheck = new Date(this.filterData.startTime) <= new Date(item.producedTime)
          } else if (!this.filterData.startTime && this.filterData.endTime) {
            timeCheck = new Date(this.filterData.endTime) >= new Date(item.producedTime)
          } else {
            timeCheck = true
          }

          if (timeCheck && nameCheck) {
            result.push(item)
          }
        })
        this.tableData = result
      },
      filterSystemChange(val){ // 列表显示选择系统
        console.log(val)
      },
      editHandler(index, item){
        this.pointClick(item)
      },
      async deleteHandler(index, item){
        let deleteItem = this.currentSystem.installList.splice(this.currentSystem.installList.indexOf(item), 1)
        deleteItem = deleteItem[0]
        this.tableData.splice(index, 1)
        if (this.unitType === 1) {
          this.$refs.bMap.map.removeOverlay(deleteItem._maker)
        }
        this.currentSystem.equipmentCountList.forEach(item => {
          if (item.equipmentId === deleteItem.equipmentId) {
            item.counts -= 1
          }
        })
      },
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss'>
  .fire-unit-equipment {
    height: 100%;
    display: flex;
    flex-direction: column;
    .header-operation {
      display: flex;
      padding: 20px;
      div {
        padding: 6px 10px;
        margin-right: 16px;
        cursor: pointer;
        color: #ffffff;
      }
      .back {
        background: #fb7702;
      }
      .save {
        background: #07c362;
      }
      .list {
        background: #1d83d8;
      }
    }
    .content {
      flex: 1;
      border-top: 1px solid #d9d9d9;
      padding: 0 20px;
      display: flex;
      .floor {
        padding: 20px;
        border-right: 1px solid #d9d9d9;
        .title {
          font-weight: bold;
        }
        ul {
          margin-top: 16px;
          li {
            cursor: pointer;
            width: 182px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: bold;
            background: #5d5f67;
            height: 40px;
            border-bottom: 1px solid #6c6c72;
            &.active {
              background: #07c362;
            }
          }
        }
      }
      .equipment {
        flex: 1;
        padding: 30px 0 30px 30px;
        display: flex;
        flex-direction: column;
        .system {
          display: flex;
          padding-bottom: 10px;
          border-bottom: 1px solid #d9d9d9;
          li {
            margin-right: 40px;
            font-weight: bold;
            cursor: pointer;
            &.active {
              color: #07c362;
            }
          }
        }
        .equipment-item {
          display: flex;
          flex-wrap: wrap;
          margin-top: 26px;
          li {
            width: 142px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffeedf;
            color: #fb7702;
            margin-right: 20px;
            margin-bottom: 14px;
            cursor: pointer;
            &.active {
              border: 1px solid #fb7702;
            }
          }
        }
        .image-wrap {
          margin-top: 30px;
          display: flex;
          flex: 1;
          .count {
            width: 160px;
            color: #ffffff;
            li {
              background: #a3a5aa;
              font-weight: bold;
              height: 40px;
              display: flex;
              align-items: center;
              padding: 0 14px;
              font-size: 12px;
            }
          }
          .image-item {
            flex: 1;
            margin-left: 30px;
          }
        }
      }
    }
    .addPoint-model {
      .el-form {
        padding: 26px 114px 0 0;
        .el-form-item {
          display: flex;
          .el-form-item__label {
            width: 160px;
          }
          .el-form-item__content {
            flex: 1;
          }
        }
      }
      .btn-group {
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid #d9d9d9;
        padding-top: 20px;
      }
    }
    .table-content {
      padding: 20px;
      .filter-wrap {
        background: #ffeedf;
        border-radius: 6px;
        padding: 14px;
        margin-bottom: 20px;
        .filter-input {
          width: 190px;
        }
        .filter-form {
          color: #333333;
          .filter-form-item {
            display: flex;
            .item {
              margin-top: 14px;
              display: flex;
              align-items: center;
              margin-right: 30px;
              .line {
                height: 1px;
                background: #cacbd0;
                width: 16px;
                margin: 0 12px;
              }
            }
          }
        }
        .filter-btn-wrap {
          display: flex;
          justify-content: flex-end;
          flex-direction: column;
          .btn {
            width: 150px;
            height: 34px;
            background: #1d83d8;
            border-radius: 6px;
            color: #ffffff;
            cursor: pointer;
            margin-top: 10px;
            i {
              font-size: 18px
            }
            p {
              margin-left: 4px
            }
            &.add {
              background: #ff6c00;
            }
          }
        }
      }
    }
  }
</style>
