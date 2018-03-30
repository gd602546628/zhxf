<template>
  <div class="fire-unit-index">
    <el-form class="fire-unit-index-form" :inline="true" ref="form" :model="form" label-width="150px">
      <el-row>
        <el-col :span="20">
          <div>
            <el-form-item label="消防单元名称：">
              <el-input placeholder="请输入消防单元名称" v-model="form.unitName"></el-input>
            </el-form-item>
            <el-form-item label="维保单位名称：">
              <el-input placeholder="请输入维保单位名称" v-model="form.maintenanceName"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="row" align-items-end column>
            <el-form-item>
              <el-button class="btn add" @click="goToFireUnitAdd">添加消防单元</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="btn" @click="filter">筛选</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <common-table :hideDelete="true"
                  :tableHeader="tableHeader"
                  :tableData="tableData"
    ></common-table>
    <div class="row pagination-container" justify-content-center>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="form.pageSize"
          :page-count="pageCount"
          @current-change="currentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

  import {Code as Code} from '../../config/config'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import CommonTable from '../../component/table.vue'
  import Api from '../../api/index'
  export default {
    components: {
      ElCol,
      ElRow,
      CommonTable
    },
    data() {
      return {
        total: 0,
        pageCount: 0,
        form: {
          unitName: '',
          maintenanceName: '',
          pageNum: 1,
          pageSize: 10
        },
        tableData: [],
        tableHeader: [
          {
            label: '消防单元名称',
            prop: 'unitName'
          },
          {
            label: '详细地址',
            prop: 'areaName'
          },
          {
            label: '监管部门',
            prop: 'supName'
          },
          {
            label: '物业单位',
            prop: 'pollingName'
          },
          {
            label: '维保单位',
            prop: 'maintenanceName'
          }
        ],
        operation: [
          {
            label: '消防设备',
            color: '#07c362',
            handle: this.equipmentHandler,
          },
          {
            label: '编辑',
            color: '#20a7fe',
            handle: this.editHandler,
          },
          {
            label: '删除',
            color: '#ff3c3c',
            handle: this.deleteHandler,
          }
        ]
      }
    },
    created(){
      this.getUnitList()
    },
    methods: {
      goToFireUnitAdd() {
        this.$router.push({name: 'fireUnitAdd', params: {unitType: 0}})
      },
      editHandler(index, item) {
        this.$router.push(
          {
            name: 'fireUnitAdd',
            params: {
              unitType: item.attribute,
              id: item.id
            }
          })
      },
      equipmentHandler(){
      },
      async currentChange(val) {
        this.form.pageNum = val
        this.getUnitList()
      },
      async deleteHandler(val, row) {
      },
      async getUnitList(){
        let data = await Api.fireUnit.getUnitList(this.form)
        this.total = data.data.allCount
        this.pageCount = data.data.totalPage
        data.data.list.forEach(item => {
          item.operation = this.operation
        })
        this.tableData = data.data.list
      },
      filter(){
        this.form.pageNum = 1
        this.getUnitList()
      }
    },
  }
</script>
<style lang="scss" scoped type="text/scss">
  .fire-unit-index {
    padding: 0 20px;
    .fire-unit-index-form {
      margin: 20px 0;
      background: #ffeedf;
      border-radius: 6px;
      padding: 20px 10px 0 10px;
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
    }

    .pagination-container {
      margin: 10px;
    }
  }

</style>
