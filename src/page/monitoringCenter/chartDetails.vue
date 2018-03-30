<template>
  <area-select class="inspectionDensity" :showVedio="false">
    <div class="chart-detail-box">
      <div class="return" @click="goBack">返回</div>
      <div>{{detailsData.equipName}}</div>
      <c-echart :echartStyle="detailStyle" :listData="detailsData.list" v-if="detailsData"></c-echart>
    </div>
  </area-select>
</template>
<script>
  import EchartCurve from '@/component/EchartCurve.vue'
  import areaSelect from '@/component/areaSelect.vue'
  import Monitor from '@/api/monitor'
  import {Code} from '@/config/config'

  export default {
    data() {
      return {
        detailStyle: {
          width: '100%',
          height: '100%'
        },
        detailsData: null
      }
    },
    created() {
      this.getRealDetails()
    },
    methods: {
      async getRealDetails() {
        let params = {
          installId: JSON.parse(this.$route.params.id)
        }
        let data = await Monitor.getRealDetails(params).catch(e => {
        })
        if (data.code === Code.SUCCESS) {
          this.detailsData = data.data
        } else {
          this.$message.error(data.mesg)
        }
      },
      goBack() {
        this.$router.back()
      }
    },
    components: {
      areaSelect,
      'c-echart': EchartCurve
    }
  }

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .inspectionDensity {
    height: 100%;
    .return {
      background: #fe842b;
      color: #ffffff;
      height: 28px;
      width: 56px;
      line-height: 28px;
      text-align: center;
      cursor: pointer;
      margin-bottom: 30px;
    }
    .chart-detail-box {
      height: 96%;
      width: 90%;
      margin: 2% 5%;
    }
  }
</style>
