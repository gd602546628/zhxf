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
          {name: 'warrantyList', title: '保修工单',authUrl:'/repair/report'},
          {name: 'maintenanceStatistics', title: '维修统计',authUrl:'/repair/deal'},
        ]
      }
    },
    methods: {},
  }
</script>
<style lang="scss" scoped type="text/scss">
</style>
