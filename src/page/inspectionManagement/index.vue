<template>
  <left-nav :routeMap="routeMap"></left-nav>
</template>

<script>
  import leftNav from '../../component/leftNav.vue'
  export default {
    components: {
      leftNav
    },
    data() {
      return {
        routeMap: [
          {name: 'inspectionDensity', title: '巡检密度',authUrl:'/check/density'},
       /*   {name: 'inspectionPlan', title: '巡检计划'},*/
          {name: 'inspectionStandard', title: '巡检标准',authUrl:'/check/standard'},
          {name: 'inspectionRecord', title: '巡检记录',authUrl:'/check/record'},
          {name: 'inspectionOverdue', title: '超期未检',authUrl:'/check/overdue'},
          {name: 'inspectionMissing', title: '巡检遗漏',authUrl:'/check/miss'},
        ]
      }
    },
    methods: {},
  }
</script>
<style lang="scss" scoped type="text/scss">
</style>
