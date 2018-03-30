<template>
  <div class="warranty-list">
    <el-form class="form-container" :inline="true" ref="form" :model="form" label-width="100px">
      <div style="width:100%">
        <el-form-item label="消防单元">
          <el-input placeholder="请输入消防单元" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input placeholder="搜索消防单元" v-model="form.equName"></el-input>
        </el-form-item>
        <el-form-item label="维修人员">
          <el-input placeholder="搜索维修人员" v-model="form.people"></el-input>
        </el-form-item>
      </div>
      <div class="bottom-box">
        <div class="creatTime">
          <el-form-item label="任务状态">
            <el-select v-model="form.state" placeholder="任务状态">
              <el-option label="新报修" value="0"></el-option>
              <el-option label="维修中" value="1"></el-option>
              <el-option label="已完成" value="2"></el-option>
              <el-option label="被驳回" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <!--<span>创建时间：</span>-->
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
        </div>
        <div class="filter-btn-wrap" @click="getRepairList()">
          <div class="btn all-center">
            <i class="icon-sxuan"></i>
            <p>筛选</p>
          </div>
        </div>
      </div>
    </el-form>

    <common-table :showOperationWidth="120" :hideDelete="true" :tableHeader="tableHeader"
                  :tableData="tableData"></common-table>
    <div class="pagination-container" justify-content-center>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="form.pageSize"
          :page-count="pageCount"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

  /* import FireGridApi from '../../api/fireGrid.api'*/
  import {Code as Code} from '../../config/config'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import CommonTable from '../../component/table.vue'
  import repair from '@/api/repair'

  export default {
    data() {
      return {
        total: 1,
        pageCount: 1,
        startTime: '',
        endTime: '',
        form: {
          name: '',
          equName: '',
          region: '',
          state: '',
          people: '',
          department: '',
          pageNum: 1,
          pageSize: 10
        },
        tableData: [],
        tableHeader: [
          {
            label: '消防单元',
            width: 150,
            prop: 'fireUnitName'
          },
          {
            label: '楼层',
            prop: 'floor'
          },
          {
            label: '设备名称',
            width: 150,
            prop: 'equipmentName'
          }, {
            label: '报修人员',
            prop: 'userName'
          }, {
            label: '任务状态',
            prop: 'status'
          }, {
            label: '描述',
            width: 300,
            prop: 'description'
          }, {
            label: '报修时间',
            width: 150,
            prop: 'createTime'
          }
        ],
        operation: [
          {
            label: '查看',
            color: '#20a7fe',
            handle: this.goToInfoHandler,
          }
        ]
      }
    },
    created(){
      this.getRepairList()
    },
    methods: {
      async handleCurrentChange(val) {
        this.form.pageNum = val
        this.getRepairList()
      },
      async deleteHandler(val, row) {
      },
      goToInfoHandler(val, row) {
        this.$router.push({name: 'warrantyInfo', params: {id: row.id}})
      },
      async getRepairList(){
        let params = {
          status: this.form.state, // 任务状态 0 新报修 1维修中 2已完成 3被驳回
          userName: this.form.people,  // 维修人员
          pageNum: this.form.pageNum,
          pageSize: this.form.pageSize,
          fireUnitName: this.form.name,
          equipmentName: this.form.equName,
          createStartTime: this.startTime,
          createEndTime: this.endTime
        }
        let data = await repair.repairList(params).catch(e => {
        })
        if (data.code === Code.SUCCESS) {
          this.total = data.data.allCount
          this.pageCount = data.data.totalPage
          data.data.list.forEach(item => {
            item.operation = this.operation // 操作
            if (item.floor) { // 楼层
              item.floor = item.floor + 'F'
            }
            let repairState = ['新报修', '维修中', '已完成', '被驳回']
            item.status = repairState[item.status]
          })
          this.tableData = data.data.list
        } else {
          this.$message.error(data.mesg)
        }
        console.log(data)
      }
    },
    mounted() {
    },
    components: {
      ElCol,
      ElRow,
      CommonTable
    }
  }
</script>
<style lang="scss" scoped type="text/scss">
  .warranty-list{
    padding: 20px;
    .form-container {
      margin-bottom: 20px;
      background: #ffeedf;
      border-radius: 6px;
      padding: 20px 10px 0 10px;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;
      .btn {
        color: white;
        background-color: #2383d8;
        width: 150px;
        border-color: #2383d8;
        &.add {
          border-color: #ef6930;
          background-color: #ef6930;
        }
      }
      .bottom-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .creatTime {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          align-self: flex-start;
        }
        .filter-btn-wrap {
          align-self: flex-end;
          margin-bottom: 18px;
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

    .pagination-container {
      text-align: center;
      margin: 10px;
    }
  }
</style>
