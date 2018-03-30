<template>
  <div>
    <el-form class="form-container" :inline="true" ref="form" :model="form" label-width="100px">
      <!--筛选区域-->
      <div class="filter-box">
        <div class="device-name-box">
          <span>所属单元 :</span>
          <el-input class="device-name-input" v-model="belongUnit" placeholder="请输入消防单元名称"></el-input>
          <span>设备名称 :</span>
          <el-input class="device-name-input" v-model="equName" placeholder="请输入设备名称"></el-input>
        </div>
        <div class="happen-time">
          <div class="operate-time-box">
            <span class="create-time">操作账号 ：</span>
            <el-input class="device-name-input" v-model="opeAccount" placeholder="请输入操作账号"></el-input>
            <span class="operate-time">操作时间 ：</span>
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
          </div>
          <div class="filter-btn-wrap" @click="getAlarmList()">
            <div class="btn all-center">
              <i class="icon-sxuan"></i>
              <p>筛选</p>
            </div>
          </div>
        </div>
      </div>
      <!--列表区域-->
      <div class="list-box">
        <common-table :hideDelete="true" :tableHeader="tableHeader"
                      :tableData="tableData" :showOperation="false"></common-table>
      </div>
      <!--页脚页码-->
      <div class="pagination-container" justify-content-center>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="this.form.pageSize"
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

  export default {
    data() {
      return {
        belongUnit: '',
        equName: '',
        opeAccount: '',
        input: '',
        total: 1,
        pageCount: 1,
        startTime: '',
        endTime: '',
        form: {
          name: '',
          region: '',
          department: '',
          pageNum: 1,
          pageSize: 10
        },
        value4: '',
        tableHeader: [
          {
            label: '发生时间',
            width: 150,
            prop: 'createTime'
          },
          {
            label: '所属单元',
            width: 150,
            prop: 'unitName'
          },
          {
            label: '详细地址',
            width: 200,
            prop: 'areLocation'
          }, {
            label: '楼层',
            prop: 'floorLevel'
          }, {
            label: '设备',
            prop: 'equipmentName'
          }, {
            label: '处理内容',
            prop: 'dealContent'
          }, {
            label: '处理结果',
            color: '#07c362',
            prop: 'dealResult'
          }, {
            label: '操作账号',
            color: '#07c362',
            prop: 'userName'
          }
        ],
        tableData: []
      }
    },
    created(){
      this.getAlarmList()
    },
    methods: {
      handleCurrentChange(val){ // 获取当前页数
        this.form.pageNum = val
        this.getAlarmList()
      },
      async getAlarmList() { // 获取操作信息列表
        let params = {
          startTime: this.startTime.substring(0, 10), // 操作开始时间
          endTime: this.endTime.substring(0, 10), // 操作结束时间
          equipmentName: this.equName, // 设备名称
          pageNum: this.form.pageNum,
          pageSize: this.form.pageSize,
          type: 2, // 0--告警入口，1-故障入口, 2- 操作信息入口
          unitName: this.belongUnit, // 单元名称,
          userName: this.opeAccount // 操作账号
        }
        let data = await Monitor.alarmList(params).catch(e => {
        })
        if (data.code === Code.SUCCESS) {
          data.data.list.forEach(item => {
            item.operation = this.operation // 操作
            if (item.areLocation) { // 所属区域
              item.areLocation.push(item.province + item.city + item.county) // 省+市+区县
            } else {
              item.areLocation = [item.province + item.city + item.county]
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
    components: {
      ElRow,
      ElCol,
      'CommonTable': CommonTable
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .filter-box {
    background-color: #FFEEDF;
    height: 98%;
    width: 98%;
    margin: 1%;
    padding: 0 10px;
    border-radius: 5px;
    font-size: 12px;
    box-sizing: border-box;
    .device-name-box {
      display: -webkit-flex;
      -webkit-justify-content: flex-start;
      -webkit-align-items: center;
      justify-content: flex-start;
      align-items: center;
      padding: 20px 0 10px 0;
      span {
        margin: 0 10px;
      }
      .device-name-input {
        width: 220px;
      }
    }
    .happen-time {
      display: -webkit-flex;
      -webkit-justify-content: space-between;
      -webkit-align-items: center;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      padding: 0 0 17px 0;
      .operate-time-box {
        display: -webkit-flex;
        -webkit-justify-content: flex-start;
        -webkit-align-items: center;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        .create-time {
          font-size: 12px;
          margin-left: 10px;
        }
        .device-name-input {
          width: 220px;
        }
        .operate-time {
          margin-left: 10px;
        }
        .line {
          margin: 5px;
        }
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
      .filter-btn {
        padding-top: 18px;
        .btn {
          color: white;
          background-color: #2383d8;
          width: 150px;
          border-color: #2383d8;
          i {
            margin-right: 5px;
            font-size: 12px;
          }
          &.add {
            border-color: #ef6930;
            background-color: #ef6930;
          }
        }
      }
    }
  }

  .list-box {
    height: 99%;
    width: 98%;
    margin: 1%;
    border-radius: 5px;
  }

  .pagination-container {
    text-align: center;
    margin: 10px;
  }
</style>
