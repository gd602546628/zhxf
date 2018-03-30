<template>
  <area-select :showVedio="false" :showFloor="false" @unitClick="unitClick">
    <div class="inspection-overdue">
      <div class="filter-wrap">
        <span>设备名称：</span>
        <el-input placeholder="请输入设备名称" v-model="formData.equipmentName"></el-input>
        <div class="button all-center" @click.stop="search">
          <i class="icon-search"></i>
          <p>搜索</p>
        </div>
      </div>
      <common-table :tableHeader="tableHeader"
                    :tableData="tableData"
                    :showOperation="false"
                    :hideDelete="true"
      ></common-table>
      <div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="this.formData.pageSize"
            :page-count="pageCount"
            @current-change="loadPage"
        >
        </el-pagination>
      </div>
    </div>
  </area-select>
</template>
<script>
  import areaSelect from '../../component/areaSelect.vue'
  import commonTable from '../../component/table.vue'
  import Api from '../../api/index'
  import {Code} from '../../config/config'
  export default{
    components: {
      areaSelect,
      commonTable
    },
    data(){
      return {
        formData: {
          equipmentName: null,
          fireUnitId: 1,
          pageNum: 1,
          pageSize: 10
        },
        tableData: [],
        tableHeader: [
          {
            label: '设备名称',
            prop: 'equipmentName'
          },
          {
            label: '巡检频率',
            prop: 'checkFrequency'
          },
          {
            label: '设备位置',
            prop: 'equipmentPosition'
          },
          {
            label: '超期天数',
            prop: 'overdue'
          }
        ],
        pageCount: 1
      }
    },
//    async created(){
//      this.tableData = await this.getList()
//    },
    methods: {
      async getList(){
        let data = await Api.check.getInspectionOverdue(this.formData);
        data = data.data
        this.pageCount = data.totalPage
        let list = data.list
        return list
      },
      async loadPage(currentPage){
        this.formData.pageNum = currentPage
        this.tableData = await this.getList()
      },
      async search(){ //筛选
        this.formData.pageNum = 1
        this.tableData = await this.getList()
      },
      async unitClick (item){
        this.formData.fireUnitId = item.unitId
        this.tableData = await this.getList()
      }
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .inspection-overdue {
    padding: 16px;
    .filter-wrap {
      height: 58px;
      background: #ffeedf;
      display: flex;
      align-items: center;
      padding-left: 20px;
      margin-bottom: 16px;
      .el-input {
        width: 180px;
        height: 32px;
      }
      .button {
        width: 68px;
        height: 32px;
        background: #ff7e00;
        color: #ffffff;
        margin-left: 10px;
        border-radius: 2px;
        cursor: pointer;
        border: none;
        i::before {
          color: #ffffff;
        }
      }
    }
    .pagination {
      text-align: center;
      margin-top: 20px;
    }
  }
</style>
