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
          {name: 'inspectionBase', title: '巡检标准', authUrl: '/setting/role'},
          {name: 'fireGrid', title: '消防网格', authUrl: '/setting/user'},
          {name: 'companyManage', title: '单位管理', authUrl: '/setting/user'},
          {name: 'transmission', title: '传输设备', authUrl: '/setting/user'},
        ]
      }
    },
    methods: {},
  }
</script>
<style lang="scss" scoped type="text/scss">
</style>
