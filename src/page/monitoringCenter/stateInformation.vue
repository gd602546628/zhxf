<template>
  <area-select class="inspectionDensity" :showVedio="false">
    <div class="list-box">
      <common-table  :hideDelete="true" :tableHeader="tableHeader"
                    :tableData="tableData" :showOperation="false"></common-table>
      <!--页脚页码-->
      <div class="pagination-container" justify-content-center>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :current-page="form.pageNum"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </area-select>
</template>
<script>
  import areaSelect from '@/component/areaSelect.vue'
  import CommonTable from '@/component/table.vue'
  export default {
    data(){
      return{
        total: 100,
        form: {
          name: '',
          region: '',
          department: '',
          pageNum: 1
        },
        tableHeader: [
          {
            label: '名称',
            prop: 'name'
          },
          {
            label: '数值',
            prop: 'value'
          },
          {
            label: '单位',
            prop: 'unit'
          }, {
            label: '状态',
            prop: 'state'
          }
        ],
        tableData: [{
          name: '公司前台(1号机)',
          value: '0.5',
          unit: 'MPa',
          state: '正常'
        },{
          name: '公司前台(2号机)',
          value: '0.6',
          unit: 'MPa',
          state: '正常'
        }]
      }
    },
    components:{
      areaSelect,
      'CommonTable': CommonTable
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .inspectionDensity {
    height: 100%;
    .list-box{
      height: 98%;
      width: 98%;
      margin: 1% 1%;
      border-radius: 5px;
    }
  }
  .pagination-container {
    text-align: center;
    margin: 10px;
  }
</style>
