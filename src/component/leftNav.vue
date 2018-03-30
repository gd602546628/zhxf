<template>
  <div class="left-nav-wrap flex">
    <el-menu
      :default-active="defaultActive"
      class="left-nav"
      @select="handleSelect"
      text-color="#fff"
      active-text-color="#fff"
    >
      <!--TODO：子级权限控制-->
      <el-menu-item :index="item.name" v-for="item in routeMap" :key="item.name">{{item.title}}
      </el-menu-item>
    </el-menu>
    <div class="left-nav-content" flex1>
      <el-scrollbar class="content-scroll">
        <router-view/>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {isTest} from '../config/config'
  export default {
    props: {
      routeMap: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        defaultActive: ''
      }
    },
    computed: {
      ...mapGetters(['sysAuthUrls'])
    },
    created() {
      this.defaultActive = this.$route.meta.secondActiveName || this.$route.name
    },
    methods: {
      handleSelect(a) {
        this.$router.push({
          name: a
        })
      },
      authFix(item){ // 权限配置
        if (!isTest) return true
        let flag = false
        for (let i = 0; i < this.sysAuthUrls.length; i++) {
          if (this.sysAuthUrls[i].url === item.authUrl) {
            flag = true
            break
          }
        }
        return flag
      },
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .left-nav-wrap {
    height: 100%;
    .left-nav {
      height: 100%;
      width: 200px;
      background: #323542;
      border-top: 1px solid #434552;
      border-right: none;
      .el-menu-item:hover {
        background: #295449;
        border-bottom: none;
      }
      .is-active {
        background: #295449;
        border-bottom: none;
        &:after {
          content: '》';
          font-weight: bold;
          position: absolute;
          right: 20px;
        }
      }
    }
    .left-nav-content {
      overflow: hidden;
      margin-bottom: -17px;
      height: 100%;
      .content-scroll {
        height: 100%;
      }
    }
  }
</style>
