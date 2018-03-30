<template>
  <area-select class="inspectionDensity"
               :showVedio="false"
               :showFloor="showFloor"
               @unitClick="unitClick"
               @floorClick="floorClick">
    <div class="all-center plan-wrap" ref="planWrap">
      <plan :canDrag="false"
            :points="pageData.installList"
            :src="addFilePre(pageData.url)"
            :showDelete="false"
            v-if="type===1"
            class="plan"
            :iconAddFilePre="false"
      ></plan>
      <b-map v-if="type===0" ref="bMap" style="height: 100%;width:100%;margin-right: 90px;"></b-map>
    </div>
  </area-select>
</template>
<script>
  import areaSelect from '../../component/areaSelect.vue'
  import plan from '../../component/plan.vue'
  import Api from '../../api/index'
  import {Code} from '@/config/config'
  import bMap from '../../component/BMap.vue'
  import jian01 from '../../assets/image/icon/jian01.png'
  import jian02 from '../../assets/image/icon/jian02.png'
  import {FilePre} from '../../config/config'
  export default{
    components: {
      areaSelect,
      plan,
      bMap
    },
    mounted(){
    },
    data(){
      return {
        points: [],
        formData: {
          unitId: null,
          floorId: null
        },
        type: 2, // 0公共区域 1建筑
        showFloor: false,
        pageData: {}
      }
    },
    methods: {
      addFilePre(val){
        return FilePre + val
      },
      async unitClick (item){
        this.showFloor = item.attribute === 0
        this.formData.unitId = item.unitId
        if (!this.showFloor) {
          this.type = 0
          await this.getList()
        }
      },
      async floorClick (item){
        this.type = 1
        this.formData.floorId = item.id
        await this.getList()
      },
      async getList(){
        let data = await Api.check.getInspectionDensity(this.formData);
        if (data.code === Code.SUCCESS) {
          data = data.data
          this.pageData = data
        }
        this.pageData.installList.forEach(item => {
            if(item.checkStatus===0){
              item._url=jian01
              if(this.type===0){
                this.$refs.bMap.addIconPoint(item.longitude, item.latitude,{icon:jian01})
              }
            }else{
              item._url=jian02
              if(this.type===0){
                this.$refs.bMap.addIconPoint(item.longitude, item.latitude,{icon:jian02})
              }
            }
        })
        if (this.type === 0) {
          this.$refs.bMap.centerByPoint(this.pageData.longitudeLatitudeDoList[0].longitude, this.pageData.longitudeLatitudeDoList[0].latitude)
        }
      },
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .inspectionDensity {
    height: 100%;
    .plan-wrap {
      height: 100%;
      padding-left: 90px;
      padding-top: 40px;
      padding-bottom: 40px;
      .plan {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
