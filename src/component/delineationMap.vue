<template>
  <div class="row">
    <div class="col col-btn" v-if="isEdit">
      <el-button @click="submit">确定</el-button>
      <el-button @click="cancel">取消</el-button>
      <el-button @click="reset">重置</el-button>
      <!-- <el-cascader
         placeholder="试试搜索：玉溪"
         expand-trigger="hover"
         :options="q_cityInfo"
         :props="cityInfoProp"
         @change="selectCity"
         filterable
         style="margin-left: 10px;margin-right: 10px"
       >
       </el-cascader>-->
      <el-switch
        v-model="addPointFlag"
        active-text="新增网格点">
      </el-switch>
    </div>
    <map-component :points="currentPoints" @mapClick="mapClick" ref="bMap" class="col col-map"></map-component>
  </div>
</template>

<script>
  import MapComponent from './BMap.vue'
  import {mapGetters} from 'vuex'
  export default {
    props: {
      editPoints: {  //可以编辑的网格
        type: Array,
        default: () => []
      },
      notEditPoint: { //不可以编辑的网格
        type: Array,
        default: () => []
      },
      isEdit: { //是否显示编辑头
        type: Boolean,
        default: true
      },
      isGrid: {
        type: Boolean,
        default: false
      },
      defaultPoint: { // 默认聚焦点
        type: Object,
        default: null
      }
    },
    data() {
      return {
        currentPoints: [],
        addPointFlag: false,
        polygon: null,
        cityInfoProp: {
          label: 'name',
          value: 'id',
          children: 'nextArea'
        },

      }
    },
    computed: {
      ...mapGetters(['q_cityInfo'])
    },
    methods: {
      submit() {
        this.$emit('confirm', this.polygon.getPath())
      },
      reset() {
        this.currentPoints = []
        this.$refs.bMap.removeAllOverlay()
      },
      cancel() {
        this.$emit('cancel')
      },
      mapClick(e) {
        if (this.addPointFlag) {
          this.currentPoints.push(e.point)
        }
        this.setPointsPolygon()
      },
      setPointsPolygon() {
        this.$refs.bMap.removeAllOverlay()
        if (this.currentPoints.length === 1) {
          this.$refs.bMap.addPoint(this.currentPoints[0].lng, this.currentPoints[0].lat)
        }
        this.polygon = this.$refs.bMap.createGridByPoints(this.currentPoints)
        this.polygon.enableEditing()
      },
      selectCity(a){
        let city = this.getCityObjById(a[2])
        this.$refs.bMap.centerByPoint(city.lng, city.lat)
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
      }
    },
    mounted() {
      // this.$refs.bMap.createGridByPoints(this.points, 'red').disableMassClear()
      if (this.notEditPoint.length > 0) {
        this.$refs.bMap.createGridByPoints(this.notEditPoint, 'red').disableMassClear()
      }
      if (this.editPoints.length > 0) {
        this.currentPoints = JSON.parse(JSON.stringify(this.editPoints))
        this.polygon = this.$refs.bMap.createGridByPoints(this.currentPoints)
        this.polygon.enableEditing()
      }

      if (this.defaultPoint) {
        this.$refs.bMap.centerByPoint(this.defaultPoint.lon, this.defaultPoint.lat)
      }
    },
    components: {
      MapComponent
    }
  }
</script>
<style lang="scss" scoped type="text/scss">
  .row {
    padding: 15px;
    flex-direction: column;
    .col-btn {
      display: flex;
      align-items: center;
      max-height: 60px;
    }
    .col-map {
    }
  }
</style>

