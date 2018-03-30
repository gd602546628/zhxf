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
          {name: 'roleManage', title: '角色管理', authUrl: '/setting/role'},
          {name: 'accountManage', title: '账号管理', authUrl: '/setting/user'},
          {name: 'accountSecurity', title: '账号安全', authUrl: '/setting/role'},
        ]
      }
    },
    methods: {},
  }
</script>
<style lang="scss" scoped type="text/scss">
</style>
