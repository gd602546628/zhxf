<template>
  <div class="areaSelect-wrap">
    <el-scrollbar class="left">
      <div class="area-select">
        <div class="select-item">
          <p class="title">选择区域</p>
          <el-cascader
            placeholder="试试搜索：玉溪"
            expand-trigger="hover"
            :options="q_cityInfo"
            v-model="area"
            :props="cityInfoProp"
            @change="selectCity"
            filterable
          >
          </el-cascader>
        </div>
        <div class="select-item">
          <p class="title">选择单元</p>
          <el-input style="margin-bottom: 10px"
                    placeholder="搜索单元名称"
                    v-model="searchStr"
          ></el-input>
          <div class="item"
               v-for="item in currentUnitList"
               @click="unitClick(item)"
               :class="{active:item.unitId===currentUnitId}"
          >
            {{item.unitName}}
          </div>
        </div>
        <div class="select-item" v-if="!showVedio&&showFloor">
          <p class="title">选择楼层</p>
          <div class="item"
               v-for="item in floorList"
               :class="{active:item.id===currentFloorId}"
               @click="floorClick(item)"
          >
            {{item.nameLevel}}
          </div>
        </div>
        <div class="select-item" v-if="showVedio">
          <p class="title">选择视频源</p>
          <div class="item active">图书馆大门口</div>
          <div class="item">图书借阅处(左侧)</div>
          <div class="item">图书借阅处(右侧)</div>
        </div>
      </div>
      <div class="video-contro" v-if="showVedio">
        <p style="height: 1px;width:100%;background-color: #ffffff"></p>
        <div class="frame-type">
          <p class="cricl"></p>
          实时画面
          <p class="cricl"></p>
          录像回播
        </div>
        <div class="direction-box">
          <div class="arrow">
            <i class="icon-xiala top"></i>
          </div>
          <div class="arrow">
            <i class="icon-xiala top1"></i>
          </div>
          <div class="arrow">
            <i class="icon-xiala top2"></i>
          </div>
          <div class="arrow">
            <i class="icon-add01"></i>
          </div>
          焦距
          <div class="arrow">
            -
          </div>
        </div>
        <div class="direction-box">
          <div class="arrow">
            <i class="icon-xiala middle"></i>
          </div>
          <div class="arrow1">
          </div>
          <div class="arrow">
            <i class="icon-xiala middle1"></i>
          </div>
          <div class="arrow">
            <i class="icon-add01"></i>
          </div>
          焦点
          <div class="arrow">
            -
          </div>
        </div>
        <div class="direction-box">
          <div class="arrow">
            <i class="icon-xiala bottom"></i>
          </div>
          <div class="arrow">
            <i class="icon-xiala bottom1"></i>
          </div>
          <div class="arrow">
            <i class="icon-xiala bottom2"></i>
          </div>
          <div class="arrow">
            <i class="icon-add01"></i>
          </div>
          光圈
          <div class="arrow">
            -
          </div>
        </div>
        <div class="frame-type">
          <div>慢放</div>
          <div class="arrow">
            <i class="icon-xiala middle"></i>
          </div>
          <div>正常</div>
          <div class="arrow">
            <i class="icon-xiala middle1"></i>
          </div>
          <div>快放</div>
        </div>
      </div>
    </el-scrollbar>
    <el-scrollbar class="right">
      <slot></slot>
    </el-scrollbar>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import Api from '../api/index'
  export default{
    computed: {
      ...mapGetters(['q_cityInfo'])
    },
    props: {
      showVedio: { // 显示视频来源
        type: Boolean,
        default: true
      },
      showFloor: {  //显示楼层
        type: Boolean,
        default: true
      }
    },
    data(){
      return {
        cityInfoProp: {
          label: 'name',
          value: 'id',
          children: 'nextArea'
        },
        area: [],
        unitList: [],
        currentUnitList: [],
        currentUnitId: null,
        floorList: [],
        currentFloorId: null,
        searchStr: '',
        throttleTimer: 0, // 搜索节流定时器
      }
    },
    watch: {
      searchStr(val){
        clearTimeout(this.throttleTimer)
        this.throttleTimer = setTimeout(() => {
          this.searchUnit(val)
        }, 300)
      }
    },
    async created(){
      let data = await Api.fireUnit.defaultUnit()
    //  this.area = [data.data.provinceCode, data.data.cityCode, data.data.countyCode]
      this.unitList = [data.data]
      this.currentUnitList = [data.data]
      this.unitClick(this.currentUnitList[0])
    },
    methods: {
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
      selectCity(value){
        let province = this.getCityObjById(value[0])
        let city = this.getCityObjById(value[1])
        let county = this.getCityObjById(value[2])
        this.getUnitList(province.id, city.id, county.id)
      },
      async getUnitList(province, city, county){
        let data = await Api.fireUnit.getUnitListByArea({
          cityCode: city,
          countyCode: county,
          provinceCode: province
        })
        this.unitList = data.data.list
        this.currentUnitList = data.data.list
        this.unitClick(data.data.list[0])
      },
      unitClick(item){
        if (item) {
          this.currentUnitId = item.unitId
          this.$emit('unitClick', item)
          this.getFloorList(item.unitId)
        }
      },
      async getFloorList(id){
        let data = await Api.fireUnit.getFloorList({
          unitId: id
        })
        this.floorList = data.data.list
        this.floorClick(data.data.list[0])
      },
      floorClick(item){
        if (item) {
          this.currentFloorId = item.id
          this.$emit('floorClick', item)
        }
      },
      searchUnit(val){
        let result = []
        this.unitList.forEach(item => {
          if (item.unitName.indexOf(val) >= 0) {
            result.push(item)
          }
        })
        this.currentUnitList = result
      }
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .areaSelect-wrap {
    height: 100%;
    overflow: hidden;
    display: flex;
    .left {
      width: 210px;
      background: #454751;
      margin-bottom: -17px;
      height: 100%;
      .area-select {
        padding: 20px 14px;
        .select-item {
          margin-bottom: 20px;
          .title {
            color: #ffffff;
            font-weight: bold;
            margin-bottom: 12px;
          }
          .item {
            height: 30px;
            border-bottom: 1px solid #686972;
            line-height: 30px;
            padding-left: 12px;
            color: #ffffff;
            background: #5c5d66;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &.active {
              background: #07c362;
            }
          }
        }
      }
      .video-contro {
        width: 100%;
        position: absolute;
        bottom: 30px;
        color: #ffffff;
        .frame-type {
          padding: 5px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          .cricl {
            width: 18px;
            height: 18px;
            border: 1px #ffffff solid;
            border-radius: 50%;
          }
          .arrow {
            background-color: #ffffff;
            height: 24px;
            width: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 5px;
            color: #333;
            .middle {
              transform: rotate(90deg);
              text-align: center;
            }
            .middle1 {
              transform: rotate(-90deg);
              text-align: center;
            }
          }
        }
        .direction-box {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          .arrow {
            background-color: #ffffff;
            height: 24px;
            width: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 5px;
            color: #333;
            .top {
              transform: rotate(135deg);
              text-align: center;
            }
            .top1 {
              transform: rotate(180deg);
              text-align: center;
            }
            .top2 {
              transform: rotate(-135deg);
              text-align: center;
            }
            .icon-add01:before {
              color: #333;
            }
            .middle {
              transform: rotate(90deg);
              text-align: center;
            }
            .middle1 {
              transform: rotate(-90deg);
              text-align: center;
            }
            .bottom {
              transform: rotate(45deg);
              text-align: center;
            }
            .bottom1 {
              transform: rotate(0deg);
              text-align: center;
            }
            .bottom2 {
              transform: rotate(-45deg);
              text-align: center;
            }
          }
          .arrow1 {
            height: 24px;
            width: 24px;
            display: flex;
            justify-content: flex-end;
            align-self: flex-end;
            margin: 5px;
            color: #333;
          }
        }
      }
    }
    .right {
      flex: 1;
      margin-bottom: -17px;
      height: 100%;
    }
  }
</style>
