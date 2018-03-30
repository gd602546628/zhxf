<template>
  <div>
    <div class="filter-box">
      <div class="device-name-box">
        <div class="equipment-name">
          <span>传输装置名称：</span>
          <el-input class="device-name-input" v-model="name" placeholder="请输入传输装置名称"></el-input>
        </div>
        <div class="grid-box">
          <span>所属网格：</span>
          <el-input class="device-name-input" v-model="gridName" placeholder="请输入网格名称"></el-input>
        </div>
        <div class="grid-box">
          <span>监督机构：</span>
          <el-input class="device-name-input" v-model="supervisory" placeholder="请输入监督机构"></el-input>
        </div>
        <div class="filter-btn-wrap" @click="faultList()">
          <div class="btn all-center">
            <i class="icon-sxuan"></i>
            <p>筛选</p>
          </div>
        </div>
      </div>
    </div>
    <div class="list-box">
      <common-table :hideDelete="true" :tableHeader="tableHeader" :showOperationWidth="120"
                    :tableData="tableData" :showState="true"></common-table>
      <!--页脚页码-->
      <div class="pagination-container" justify-content-center>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-count="pageCount"
            :page-size="form.pageSize"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import CommonTable from '@/component/table.vue'
  import monitor from "@/api/monitor";
  import {Code} from '@/config/config'
  export default {
    data() {
      return {
        total: 1,
        pageCount: 1,
        name: '',
        gridName: '',
        supervisory: '',
        form: {
          name: '',
          region: '',
          department: '',
          pageNum: 1,
          pageSize: 10
        },
        tableHeader: [
          {
            label: '传输装置名称',
            prop: 'name'
          },
          {
            label: '添加时间',
            prop: 'createTime'
          },
          {
            label: '所属区域',
            prop: 'areLocation'
          }, {
            label: '所属网格',
            prop: 'gridName'
          }, {
            label: '监督机构',
            prop: 'supName'
          }
        ],
        tableData: [],
        operation: [
          {
            label: '',
            color: '#fff',
            name: '连接状态',
            background: '',
            borderRadius: '5px'
          }
        ],
      }
    },
    created() {
      this.getList()
    },
    methods: {
      faultList(){
        this.getList()
      },
      handleCurrentChange(val) { // 获取当前页数
        this.form.pageNum = val
        this.getList()
      },
      async getList() {
        let params = {
          gridName: this.gridName, // 网格名称
          name: this.name, // 传输装置名称
          supName: this.supervisory, // 	监督机构
          pageNum: this.form.pageNum,
          pageSize: this.form.pageSize
        }
        this.tableData = []
        let data = await monitor.getTransmissionList(params).catch(e => {
        })
        if (data.code === Code.SUCCESS) {
          this.total = data.data.allCount
          this.pageCount = data.data.totalPage
          data.data.list.forEach(item => {
            let state = ['在线', '离线']
            item.status = state[item.status]
            if (item.status === '在线') {
              this.operation[0].background = '#07c362'
            } else {
              this.operation[0].background = '#ff3c3c'
            }
            this.operation[0].label = item.status
            item.operation = JSON.parse(JSON.stringify(this.operation)) // 操作
            if (item.areLocation) {
              item.areLocation.push(item.province + item.city + item.county) // 省+市+区县
            } else {
              item.areLocation = [item.province + item.city + item.county]
            }
            this.tableData.push(item)
          })
        } else {
          this.$message.error(data.mesg)
        }

        console.log(data);
      }
    },
    components: {
      'CommonTable': CommonTable
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .filter-box {
    background-color: #FFEEDF;
    width: 98%;
    margin: 1%;
    padding: 0 10px;
    border-radius: 5px;
    font-size: 12px;
    box-sizing: border-box;
    .device-name-box {
      width: 100%;
      display: -webkit-flex;
      -webkit-justify-content: flex-start;
      -webkit-align-items: center;
      justify-content: flex-start;
      align-items: center;
      padding: 10px 0 10px 0;
      .equipment-name {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .device-name-input {
          width: 220px;
        }
        span {
          margin: 0 10px;
        }
      }
      .grid-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .device-name-input {
          width: 220px;
        }
        span {
          margin: 0 10px;
        }
      }
      .filter-btn-wrap {
        margin-left: 10px;
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
    margin: 1% 1%;
    border-radius: 5px;
  }

  .pagination-container {
    text-align: center;
    margin: 10px;
  }
</style>
