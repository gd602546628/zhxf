<template>
  <area-select :showVedio="false" :showFloor="false" @unitClick="unitClick">
    <div class="inspection-record">
      <div class="filter-wrap flex">
        <div class="filter-form flex" column flex1>
          <div class="filter-form-item">
            <div class="item">
              <span>设备名称：</span>
              <el-input placeholder="请输入设备名称" class="filter-input" v-model="formData.equipmentName"></el-input>
            </div>
            <div class="item">
              <span>巡检人员：</span>
              <el-input placeholder="请输入巡检人员" class="filter-input" v-model="formData.userName"></el-input>
            </div>
          </div>
          <div class="filter-form-item">
            <div class="item">
              <span>巡检时间：</span>
              <el-date-picker
                type="datetime"
                placeholder="选择开始时间"
                class="filter-input"
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="formData.createStartTime"
              ></el-date-picker>
              <span class="line"></span>
              <el-date-picker
                type="datetime"
                placeholder="选择结束时间"
                class="filter-input"
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="formData.createEndTime"
              ></el-date-picker>
            </div>
          </div>
        </div>
        <div class="filter-btn-wrap">
          <div class="btn all-center add" @click.stop="goStatistics">
            <i class="icon-jczx"></i>
            <p>图标统计</p>
          </div>
          <div class="btn all-center" @click.stop="filterList">
            <i class="icon-sxuan"></i>
            <p>筛选</p>
          </div>
        </div>
      </div>
      <common-table
        :tableHeader="tableHeader"
        :tableData="tableData"
        :hideDelete="true"
        :showOperation="false"
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
    <icon-statistics title="巡检遗漏图标统计"
                     :showModel="showModel"
                     :equipment="equipmentNum"
                     @closeClick="closeClick">
    </icon-statistics>
  </area-select>
</template>
<script>
  import areaSelect from '../../component/areaSelect.vue'
  import commonTable from '../../component/table.vue'
  import iconStatistics from '../../component/iconStatistics.vue'
  import Api from '../../api/index'
  import {Code} from '@/config/config'

  export default{
    components: {
      areaSelect,
      commonTable,
      iconStatistics
    },
    data(){
      return {
        showModel: false,
        equipmentNum: {},
        formData: {
          createEndTime: null,
          createStartTime: null,
          equipmentName: null,
          fireUnitId: null,
          pageNum: 1,
          pageSize: 10,
          userName: null
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
            label: '最近巡检时间',
            prop: 'createTime'
          },
          {
            label: '巡检人员',
            prop: 'userName'
          },
          {
            label: '遗漏次数',
            prop: 'num'
          },
        ],
        pageCount: 1
      }
    },
    methods: {
      async goStatistics(){ // 图标统计
        if (this.formData.fireUnitId) {
//          let data = await Api.check.getMissStatistics({"fireUnitId":9});
          let data = await Api.check.getMissStatistics({"fireUnitId": this.formData.fireUnitId});
          this.equipmentNum = data.data
          this.equipmentNum.type = 1
          this.showModel = true
        }
      },
      goLook(index, item){
        this.$router.push({name: 'lookRecord'})
      },
      async filterList(){ //筛选
        this.formData.pageNum = 1
        this.getList()
//        this.tableData = await this.getList()
      },
      async getList(){
        let data = await Api.check.getInspectionMiss(this.formData);
        if (data.code === Code.SUCCESS) {
          data = data.data
          this.pageCount = data.totalPage
          this.tableData = data.list
//          let list = data.list
//          return list
        }
      },
      async loadPage(currentPage){
        this.formData.pageNum = currentPage
        await this.getList()
      },
      async unitClick (item){
        this.formData.fireUnitId = item.unitId
        await this.getList()
      },
      closeClick(val){
        this.showModel = val
      }
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .inspection-record {
    padding: 16px;
    .filter-wrap {
      background: #ffeedf;
      border-radius: 6px;
      padding: 14px;
      margin-bottom: 20px;
      .filter-input {
        width: 190px;
      }
      .filter-form {
        color: #333333;
        .filter-form-item {
          display: flex;
          .item {
            margin-top: 14px;
            display: flex;
            align-items: center;
            margin-right: 30px;
            .line {
              height: 1px;
              background: #cacbd0;
              width: 16px;
              margin: 0 12px;
            }
          }
        }
      }
      .filter-btn-wrap {
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        .btn {
          width: 150px;
          height: 34px;
          background: #1d83d8;
          border-radius: 6px;
          color: #ffffff;
          cursor: pointer;
          margin-top: 10px;
          i {
            font-size: 18px
          }
          p {
            margin-left: 4px
          }
          &.add {
            background: #ff6c00;
          }
        }
      }
    }
    .pagination {
      text-align: center;
      margin-top: 20px;
    }
  }

  .inspection-record {
    padding: 16px;
    .filter-wrap {
      background: #ffeedf;
      border-radius: 6px;
      padding: 14px;
      margin-bottom: 20px;
      .filter-input {
        width: 190px;
      }
      .filter-form {
        color: #333333;
        .filter-form-item {
          display: flex;
          .item {
            margin-top: 14px;
            display: flex;
            align-items: center;
            margin-right: 30px;
            .line {
              height: 1px;
              background: #cacbd0;
              width: 16px;
              margin: 0 12px;
            }
          }
        }
      }
      .filter-btn-wrap {
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        .btn {
          width: 150px;
          height: 34px;
          background: #1d83d8;
          border-radius: 6px;
          color: #ffffff;
          cursor: pointer;
          margin-top: 10px;
          i {
            font-size: 18px
          }
          p {
            margin-left: 4px
          }
          &.add {
            background: #ff6c00;
          }
        }
      }
    }
  }
</style>
