<template>
  <div>
    <el-form class="form-container" :inline="true" ref="form" :model="form" label-width="100px">
      <div class="systemType-box">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="system-fire-btn" style="font-weight: bold">
          <el-tab-pane
            v-for="(item, index) in systemList"
            :key="item.name"
            :label="item.name"
            :name="item.name">
          </el-tab-pane>
        </el-tabs>
      </div>
      <!--筛选区域-->
      <div class="filter-box">
        <div class="happen-time">
          <el-form-item style="margin-bottom: 0">
            <span class="create-time">创建时间：</span>
            <el-date-picker
              type="datetime"
              placeholder="选择开始时间"
              class="filter-input"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="startTime"
            ></el-date-picker>
            <span class="line"></span>
            <el-date-picker
              type="datetime"
              placeholder="选择结束时间"
              class="filter-input"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="endTime"
            ></el-date-picker>
          </el-form-item>
          <div class="filter-btn-wrap" @click="faultList()">
            <div class="btn all-center">
              <i class="icon-sxuan"></i>
              <p>筛选</p>
            </div>
          </div>
        </div>
      </div>
      <!--列表区域-->
      <div class="list-box">
        <common-table :showOperationWidth="120" :hideDelete="true" :tableHeader="tableHeader"
                      :tableData="tableData"></common-table>
      </div>
      <!--页脚页码-->
      <div class="pagination-container" justify-content-center>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="form.pageNum"
            :page-count="pageCount"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import CommonTable from '@/component/table.vue'
  import Monitor from '@/api/monitor'
  import {Code} from '@/config/config'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        input: '',
        total: 1,
        pageCount: 1,
        startTime: '',
        endTime: '',
        activeName: '火灾自动报警系统',
        systemList: [],
        formData: {
          area: []
        },
        form: {
          name: '',
          region: '',
          department: '',
          pageNum: 1
        },
        cityInfoProp: {
          label: 'name',
          value: 'id',
          children: 'nextArea'
        },
        value4: '',
        tableHeader: [
          {
            label: '发生时间',
            width: 150,
            prop: 'createTime'
          },
          {
            label: '设备位置',
            width: 200,
            prop: 'deviceLocation'
          },
          {
            label: '所属区域',
            width: 200,
            prop: 'areLocation'
          }, {
            label: '楼层',
            prop: 'floorLevel'
          }, {
            label: '设备名称',
            prop: 'equipmentName'
          }, {
            label: '故障内容',
            prop: 'typeName'
          }, {
            label: '处理状态',
            color: '#07c362',
            prop: 'dealStatus'
          }
        ],
        tableData: [],
        operation: [
          {
            label: '查看',
            color: '#07c362',
            handle: this.goFaultInfo,
          }
        ]
      }
    },
    created() {
      this.faultList()
      this.getSystemList()
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      goFaultInfo(val, row) {
        this.$router.push({name: 'faultDetails', params: {id: row.id}})
      },
      handleCurrentChange(val) { // 获取当前页数
        this.form.pageNum = val
        this.faultList()
      },
      getList(id){
        this.faultList(id)
      },
      async getSystemList() { // 消防系统列表
        let data = await Monitor.getSystemList().catch(e => {
        })
        if (data.code === Code.SUCCESS) {
          this.systemList = data.data
          // this.total = data.data.totalPage
        } else {
          this.$message.error(data.mesg)
        }
      },
      async faultList(id) { // 获取故障信息列表
        let params = {
          dealStatus: this.form.state, // 告警状态
          systemId: id || 1, // 系统id
          startTime: this.startTime.substring(0, 10),
          endTime: this.endTime.substring(0, 10),
          pageNum: this.form.pageNum,
          pageSize: 10,
          type: 1, // 0--告警入口，1-故障入口, 2- 操作信息入口
        }
        let data = await Monitor.alarmList(params).catch(e => {
        })
        if (data.code === Code.SUCCESS) {
          this.total = data.data.allCount
          this.pageCount = data.data.totalPage
          data.data.list.forEach(item => {
            let state = ['未处理', '挂起待办', '已处理']   // 告警状态
            item.dealStatus = state[item.dealStatus]
            item.operation = this.operation // 操作
            if (item.areLocation) { // 所属区域
              item.areLocation.push(item.province + item.city + item.county) // 省+市+区县
            } else {
              item.areLocation = [item.province + item.city + item.county]
            }
            if (item.deviceLocation) { // 设备位置
              item.deviceLocation.push(item.unitName + item.floorLevel + item.installLocation) // 单元名称 + 楼层 + 位置详情
            } else {
              item.deviceLocation = [item.unitName + item.floorLevel + item.installLocation]
            }
            if (item.floorLevel) { // 楼层
              item.floorLevel = item.floorLevel + 'F'
            }
          })
          this.tableData = data.data.list
        } else {
          this.$message.error(data.mesg)
        }
      }
    },
    computed: {
      ...mapGetters(['q_cityInfo', 'sysUserBg'])
    },
    components: {
      ElRow,
      ElCol,
      'CommonTable': CommonTable
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .systemType-box {
    margin: 1%;
    .system-fire-btn {

    }
  }

  .filter-box {
    background-color: #FFEEDF;
    height: 98%;
    width: 98%;
    margin: 1%;
    padding: 0 10px;
    border-radius: 5px;
    font-size: 12px;
    box-sizing: border-box;
    .happen-time {
      display: -webkit-flex;
      -webkit-justify-content: flex-start;
      -webkit-align-items: center;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;
      padding: 10px 0;
      .create-time {
        font-size: 12px;
        margin-left: 10px;
      }
      .filter-btn-wrap {
        .btn {
          width: 150px;
          height: 34px;
          background: #1d83d8;
          border-radius: 3px;
          color: #ffffff;
          cursor: pointer;
          i {
            font-size: 18px;
          }
          p {
            margin-left: 4px;
          }
        }
      }
    }
  }

  .list-box {
    height: 98%;
    width: 98%;
    margin: 1%;
    border-radius: 5px;
  }

  .pagination-container {
    text-align: center;
    margin: 10px;
  }
</style>
