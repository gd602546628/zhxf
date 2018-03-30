import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index.vue'
import login from '@/page/login.vue'

/********首页start**********/
import main from '@/page/main/mainIndex.vue'
/********首页end**********/

/********消防单元start**********/
import fireUnit from '@/page/fireUnit/fireUnitIndex.vue'
import fireUnitAdd from '@/page/fireUnit/fireUnitAdd.vue'
import floorSetting from '@/page/fireUnit/floorSetting.vue'
import fireUnitEquipment from '../page/fireUnit/fireUnitEquipment.vue'
/********消防单元end**********/

/********监控中心start**********/
import monitoringCenter from '@/page/monitoringCenter/monitoringCenterIndex.vue'
import alarmInformation from '@/page/monitoringCenter/alarmInformation.vue'
import faultInformation from '@/page/monitoringCenter/faultInformation.vue'
import actualInformation from '@/page/monitoringCenter/actualInformation.vue'
import transmissionEquipment from '@/page/monitoringCenter/transmissionEquipment.vue'
import operateInformation from '@/page/monitoringCenter/operateInformation.vue'
import vedioControl from '@/page/monitoringCenter/vedioControl.vue'
import warnInfo from '@/page/monitoringCenter/warnInfo.vue'
import faultDetails from '@/page/monitoringCenter/faultDetails.vue'
import chartDetails from '@/page/monitoringCenter/chartDetails.vue'
/********监控中心end**********/

/*********巡检管理 begin ****************/
import inspectionManagement from '../page/inspectionManagement/index.vue'
import inspectionDensity from '../page/inspectionManagement/inspectionDensity.vue'
import inspectionMissing from '../page/inspectionManagement/inspectionMissing.vue'
import inspectionOverdue from '../page/inspectionManagement/inspectionOverdue.vue'
import inspectionPlan from '../page/inspectionManagement/inspectionPlan.vue'
import inspectionRecord from '../page/inspectionManagement/inspectionRecord.vue'
import inspectionStandard from '../page/inspectionManagement/inspectionStandard.vue'
import lookRecord from '../page/inspectionManagement/lookRecord.vue'
/*********巡检管理 end ****************/

/*********维保管理 begin ****************/
import maintenanceManagement from '../page/maintenanceManagement/index.vue'
import warrantyList from '../page/maintenanceManagement/warrantyList.vue'
import maintenanceStatistics from '../page/maintenanceManagement/maintenanceStatistics.vue'
import warrantyInfo from '../page/maintenanceManagement/warrantyInfo.vue'

/*********维保管理 end ****************/

/*********通知公告 begin ****************/
import noticeBulletin from '../page/noticeBulletin/index.vue'
/*********通知公告 end ****************/

/*********系统设置 begin ****************/
import systemSettings from '../page/systemSettings/index.vue'
import roleManage from '../page/systemSettings/roleManage.vue'
import accountSecurity from '../page/systemSettings/accountSecurity.vue'
import accountManage from '../page/systemSettings/accountManage.vue'
import addRole from '../page/systemSettings/addRole.vue'
import addAccount from '../page/systemSettings/addAccount.vue'
/*********系统设置 end ****************/

/***************  基础数据 begin***************************/
import baseDataIndex from '../page/baseData/index.vue'
import fireGrid from '../page/baseData/fireGrid.vue'
import fireGridUpdate from '../page/baseData/fireGridUpdate.vue'
import inspectionBase from '../page/baseData/inspectionBase.vue'
import companyManage from '../page/baseData/companyManage.vue'
import companyUpdate from '../page/baseData/companyUpdate.vue'
import transmission from '../page/baseData/transmission.vue'
import transmissionUpdate from '../page/baseData/transmissionUpdate.vue'
/***************  基础数据 end***************************/
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/main',
      component: Index,
      name: 'index',
      children: [
        {
          path: 'main',
          component: main,
          name: 'main'
        },
        {
          name: 'fireUnit',
          path: 'fireUnit',
          component: fireUnit,
          meta: {
            firstActiveName: 'fireUnit',
          }
        },
        {
          name: 'fireUnitAdd',
          path: 'fireUnitAdd/:unitType/:id?',
          component: fireUnitAdd,
          meta: {
            firstActiveName: 'fireUnit',
          }
        },
        {
          name: 'floorSetting',
          path: 'floorSetting/:id',
          component: floorSetting,
          meta: {
            firstActiveName: 'fireUnit',
          }
        },
        {
          name: 'fireUnitEquipment',
          path: 'fireUnitEquipment/:unitType/:id',
          component: fireUnitEquipment,
          meta: {
            firstActiveName: 'fireUnit',
          }
        },
        {  // 检测中心
          path: 'monitoringCenter',
          component: monitoringCenter,
          redirect: '/monitoringCenter/alarmInformation',
          name: 'monitoringCenter',
          children: [
            {
              path: 'alarmInformation',
              component: alarmInformation,
              name: 'alarmInformation',
              meta: {
                firstActiveName: 'monitoringCenter',
                secondActiveName: 'alarmInformation'
              },
            },
            {
              path: 'warnInfo/:unitType/:id',
              component: warnInfo,
              name: 'warnInfo',
              meta: {
                firstActiveName: 'monitoringCenter',
                secondActiveName: 'warnInfo'
              }
            },
            {
              path: 'faultInformation',
              component: faultInformation,
              name: 'faultInformation',
              meta: {
                firstActiveName: 'monitoringCenter',
                secondActiveName: 'faultInformation'
              }
            },
            {
              path: 'faultDetails/:id',
              component: faultDetails,
              name: 'faultDetails',
              meta: {
                firstActiveName: 'monitoringCenter',
                secondActiveName: 'faultDetails'
              }
            },
            {
              path: 'actualInformation',
              component: actualInformation,
              name: 'actualInformation',
              meta: {
                firstActiveName: 'monitoringCenter',
                secondActiveName: 'actualInformation'
              }
            },
            {
              path: 'chartDetails/:id?',
              component: chartDetails,
              name: 'chartDetails',
              meta: {
                firstActiveName: 'monitoringCenter',
                secondActiveName: 'chartDetails'
              }
            },
            {
              path: 'transmissionEquipment',
              component: transmissionEquipment,
              name: 'transmissionEquipment',
              meta: {
                firstActiveName: 'monitoringCenter',
                secondActiveName: 'transmissionEquipment'
              }
            },
            {
              path: 'operateInformation',
              component: operateInformation,
              name: 'operateInformation',
              meta: {
                firstActiveName: 'monitoringCenter',
                secondActiveName: 'operateInformation'
              }
            },
            {
              path: 'vedioControl',
              component: vedioControl,
              name: 'vedioControl',
              meta: {
                firstActiveName: 'monitoringCenter',
                secondActiveName: 'vedioControl'
              }
            }
          ]
        },

        // 巡检管理
        {
          name: 'inspectionManagement',
          path: 'inspectionManagement',
          component: inspectionManagement,
          redirect: '/inspectionManagement/inspectionDensity',
          children: [
            {
              name: 'inspectionDensity',
              path: 'inspectionDensity',
              component: inspectionDensity,
              meta: {
                firstActiveName: 'inspectionManagement',
                secondActiveName: 'inspectionDensity'
              }
            },
            {
              name: 'inspectionMissing',
              path: 'inspectionMissing',
              component: inspectionMissing,
              meta: {
                firstActiveName: 'inspectionManagement',
                secondActiveName: 'inspectionMissing'
              }
            },
            {
              name: 'inspectionOverdue',
              path: 'inspectionOverdue',
              component: inspectionOverdue,
              meta: {
                firstActiveName: 'inspectionManagement',
                secondActiveName: 'inspectionOverdue'
              }
            },
            {
              name: 'inspectionPlan',
              path: 'inspectionPlan',
              component: inspectionPlan,
              meta: {
                firstActiveName: 'inspectionManagement',
                secondActiveName: 'inspectionPlan'
              }
            },
            {
              name: 'inspectionRecord',
              path: 'inspectionRecord',
              component: inspectionRecord,
              meta: {
                firstActiveName: 'inspectionManagement',
                secondActiveName: 'inspectionRecord'
              }
            },
            {
              name: 'lookRecord',
              path: 'lookRecord/:id',
              component: lookRecord,
              meta: {
                firstActiveName: 'inspectionManagement',
                secondActiveName: 'inspectionRecord'
              }
            },
            {
              name: 'inspectionStandard',
              path: 'inspectionStandard',
              component: inspectionStandard,
              meta: {
                firstActiveName: 'inspectionManagement',
                secondActiveName: 'inspectionStandard'
              }
            },
          ]
        },
        // 维保管理
        {
          name: 'maintenanceManagement',
          path: 'maintenanceManagement',
          redirect: '/maintenanceManagement/warrantyList',
          component: maintenanceManagement,
          children: [
            {
              name: 'warrantyList',
              path: 'warrantyList',
              component: warrantyList,
              meta: {
                firstActiveName: 'maintenanceManagement',
                secondActiveName: 'warrantyList'
              }
            },
            {
              name: 'warrantyInfo',
              path: 'warrantyInfo/:id',
              component: warrantyInfo,
              meta: {
                firstActiveName: 'maintenanceManagement',
                secondActiveName: 'warrantyInfo'
              }
            },
            {
              name: 'maintenanceStatistics',
              path: 'maintenanceStatistics',
              component: maintenanceStatistics,
              meta: {
                firstActiveName: 'maintenanceManagement',
                secondActiveName: 'maintenanceStatistics'
              }
            },
          ]
        },
        // 通知公告
        {name: 'noticeBulletin', path: 'noticeBulletin', component: noticeBulletin},
        // 基础数据
        {
          name: 'baseData',
          path: 'baseData',
          component: baseDataIndex,
          redirect: 'baseData/inspectionBase',
          children: [
            {
              name: 'fireGrid',
              path: 'fireGrid',
              component: fireGrid,
              meta: {
                firstActiveName: 'baseData',
                secondActiveName: 'fireGrid'
              }
            },
            {
              name: 'fireGridUpdate',
              path: 'fireGridUpdate/:id?',
              component: fireGridUpdate,
              meta: {
                firstActiveName: 'baseData',
                secondActiveName: 'fireGrid'
              }
            },
            {
              name: 'inspectionBase',
              path: 'inspectionBase',
              component: inspectionBase,
              meta: {
                firstActiveName: 'baseData',
                secondActiveName: 'inspectionBase'
              }
            },
            {
              name: 'companyManage',
              path: 'companyManage',
              component: companyManage,
              meta: {
                firstActiveName: 'baseData',
                secondActiveName: 'companyManage'
              }
            },
            {
              name: 'companyUpdate',
              path: 'companyUpdate/:id?',
              component: companyUpdate,
              meta: {
                firstActiveName: 'baseData',
                secondActiveName: 'companyManage'
              }
            },
            {
              name: 'transmission',
              path: 'transmission',
              component: transmission,
              meta: {
                firstActiveName: 'baseData',
                secondActiveName: 'transmission'
              }
            },
            {
              name: 'transmissionUpdate',
              path: 'transmissionUpdate/:id?',
              component: transmissionUpdate,
              meta: {
                firstActiveName: 'baseData',
                secondActiveName: 'transmission'
              }
            },
          ]
        },
        // 系统设置
        {
          name: 'systemSettings',
          path: 'systemSettings',
          component: systemSettings,
          redirect: '/systemSettings/roleManage',
          children: [
            {
              name: 'roleManage',
              path: 'roleManage',
              component: roleManage,
              meta: {
                firstActiveName: 'systemSettings',
                secondActiveName: 'roleManage'
              }
            },
            {
              name: 'accountSecurity',
              path: 'accountSecurity',
              component: accountSecurity,
              meta: {
                firstActiveName: 'systemSettings',
                secondActiveName: 'accountSecurity'
              }
            },
            {
              name: 'accountManage',
              path: 'accountManage',
              component: accountManage,
              meta: {
                firstActiveName: 'systemSettings',
                secondActiveName: 'accountManage'
              },
            },
            {
              name: 'addRole',
              path: 'addRole/:id?',
              component: addRole,
              meta: {
                firstActiveName: 'systemSettings',
                secondActiveName: 'roleManage'
              },
            },
            {
              name: 'addAccount',
              path: 'addAccount',
              component: addAccount,
              meta: {
                firstActiveName: 'systemSettings',
                secondActiveName: 'accountManage'
              },
            }
          ]
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
