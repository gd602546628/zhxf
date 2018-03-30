<template>
        <left-nav :routeMap="routeMap"></left-nav>
</template>
<script>
  import leftNav from '@/component/leftNav.vue'
  export default {
    components: {
      leftNav
    },
    data() {
      return {
        routeMap: [
          {name: 'alarmInformation', title: '告警信息',authUrl:''},
          {name: 'faultInformation', title: '故障信息',authUrl:''},
          {name: 'actualInformation', title: '实时信息',authUrl:'/monitor/realInformation'},
          {name: 'transmissionEquipment', title: '传输装置',authUrl:'/monitor/transmissionEquipment'},
          {name: 'operateInformation', title: '操作信息',authUrl:''},
          {name: 'vedioControl', title: '视频监控',authUrl:''},

        ]
      }
    },
    methods: {
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
/*  .monitoringCenter {
    height: 100%;

    .col {
      height: 100%;
      overflow: auto;
    }
  }*/

</style>
