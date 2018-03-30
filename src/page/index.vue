<template>
  <div class="index flex" ref="index" column>
    <div class="header">
      <img src="../assets/image/icon/logo.png" class="title"/>
      <el-menu
        :default-active="defaultActive"
        mode="horizontal"
        class="nav"
        flex1
        text-color="#fff"
        active-text-color="#fff"
        @select="handleSelect"
      >
        <el-menu-item :index="item.name" v-for="item in routeMap" :key="item.name" v-if="authFix(item)">
          <i :class="item.icon"></i>
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </el-menu>
      <div class="right-user flex">
        <div class="user all-center">
          <div class="icon-toux all-center">
            <i class="path1"></i>
            <i class="path2"></i>
          </div>
          <p>{{sysUserBg && sysUserBg.name}}</p>
        </div>
        <div class="logout all-center" @click.stop="logout">退出</div>
      </div>
    </div>
    <div class="main" flex1>
      <el-scrollbar class="scroll-bar">
        <router-view/>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import {isTest} from '../config/config'
  export default {
    data() {
      return {
        defaultActive: '',
        routeMap: [
          {title: '首页', name: 'main', icon: 'icon-sy', authUrl: '/homePage'},
          {title: '消防单元', name: 'fireUnit', icon: 'icon-xfdy', authUrl: '/unit'},
          {title: '监测中心', name: 'monitoringCenter', icon: 'icon-jczx', authUrl: '/monitor'},
          {title: '巡检管理', name: 'inspectionManagement', icon: 'icon-xjgl', authUrl: '/check'},
          {title: '维保管理', name: 'maintenanceManagement', icon: 'icon-wbgl', authUrl: '/repair'},
          {title: '通知公告', name: 'noticeBulletin', icon: 'icon-tzgg', authUrl: ''},
          {title: '基础数据', name: 'baseData', icon: 'icon-shezhi', authUrl: '/base'},
          {title: '系统设置', name: 'systemSettings', icon: 'icon-shezhi', authUrl: '/setting'},
        ]
      }
    },
    computed: {
      ...mapGetters(['sysUserBg', 'sysAuthUrls'])
    },
    created() {
      this.defaultActive = this.$route.meta.firstActiveName || this.$route.name
    },
    methods: {
      ...mapActions(['logoutAction']),
      handleSelect(a) {
        this.$router.push({
          name: a
        })
      },
      authFix(item){ // 权限配置
        if (!isTest) return true
        let flag = false
        if (this.sysAuthUrls) {
          for (let i = 0; i < this.sysAuthUrls.length; i++) {
            if (this.sysAuthUrls[i].url === item.authUrl) {
              flag = true
              break
            }
          }
        }
        return flag
      },
      async logout(){
        await this.logoutAction()
        this.$router.push({name: 'login'})
      }
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss'>
  .index {
    height: 100%;
    .header {
      height: 60px;
      background: #323542;
      color: #ffffff;
      display: flex;
      .title {
        &:after {
          content: '';
          height: 36px;
          width: 1px;
          background: #4e505b;
          margin-left: 20px;
        }
      }
      .nav {
        background: #323542;
        height: 61px;
        display: flex;
        flex: 1;
        overflow: hidden;
        .el-menu-item {
          float: none;
          flex: 1;
          font-size: 16px;
          padding: 0;
          text-align: center;
        }
        .el-menu-item:hover {
          background: #07c362 !important;
          border-bottom: none;
        }
        .is-active {
          background: #07c362 !important;
          border-bottom: none;
        }
      }
      .right-user {
        padding: 0 20px;
        background: #323542;
        .logout {
          cursor: pointer;
        }
        .user {
          padding-right: 20px;
          .icon-toux {
            font-size: 32px;
            margin-right: 10px;
          }
          &:after {
            content: '';
            height: 26px;
            width: 1px;
            background: #4e505b;
            margin-left: 20px;
          }
        }
      }
    }
    .main {
      margin-bottom: -17px;
      overflow: hidden;
      height: 100%;
      .scroll-bar {
        height: 100%;
        .el-scrollbar__view {
          height: 100%;
        }
      }
    }
  }

  @media screen and (max-width: 1300px) {
    .index {
      .header {
        .title {
          display: none;
        }
      }
    }
  }
</style>
