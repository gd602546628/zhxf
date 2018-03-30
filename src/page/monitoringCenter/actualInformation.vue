<template>
  <area-select class="inspectionDensity" :showVedio="false" :showFloor="true">
    <div class="system-type-tabs">
      <div class="systemType-box">
       <!-- <div class="systemType-list-box">
          <div class="system-fire-btn" v-for="(sys,index) in systemList " @click="getList()">
            {{sys.name}}
          </div>
        </div>-->
        <el-tabs v-model="activeName" @tab-click="handleClick" class="system-fire-btn">
          <el-tab-pane
            v-for="(item, index) in systemList"
            :key="item.name"
            :label="item.name"
            :name="item.name" >
          </el-tab-pane>
        </el-tabs>
        <div class="change-view" @click="changeView()">
          <div><i class="icon-qh"></i> 切换视图</div>
        </div>
      </div>
      <!--图表展示-->
      <div class="ec-list-box" v-if="!showlist">
        <div v-if="listData.length<=0" style="color:#909399;font-size: 14px;margin-top: 20px">暂无数据</div>
        <div class="ec-list-text" v-for="item in listData" @click.stop="goDetail(item.installId)">
          <c-echart :listData="item.list"></c-echart>
          <div class="equitment-name">{{item.equipName}}</div>
        </div>
        <!-- <div class="ec-list-text" @click.stop="goDetail()">
           <c-echart :color="areaColor" ></c-echart>
           <div class="equitment-name">前台(2号机)</div>
         </div>-->
      </div>
      <!--列表展示-->
      <div class="list-box" v-if="showlist">
        <common-table :showOperationWidth="120" :hideDelete="true"  :showOperation="false":tableHeader="tableHeader"
                      :tableData="tableData"></common-table>

        <div class="pagination-container" justify-content-center>
          <div class="pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="form.pageNum"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </area-select>
</template>
<script>
  import areaSelect from '@/component/areaSelect.vue'
  import EchartCurve from '@/component/EchartCurve.vue'
  import Monitor from '@/api/monitor'
  import {Code} from '@/config/config'
  import CommonTable from '@/component/table.vue'

  export default {
    data() {
      return {
        activeName: '火灾自动报警系统',
        areaColor: ['#fda557'],
        listData: [],
        xData: [],
        yData: [],
        showlist: false,
        systemList: [],
        total: 100,
        form: {
          name: '',
          region: '',
          department: '',
          pageNum: 1,
          state: ''
        },
        tableHeader: [
          {
            label: '名称',
            prop: 'equipName'
          },
          {
            label: '数值',
            prop: 'value'
          },
          {
            label: '单位',
            prop: 'unit'
          },
          {
            label: '状态',
            prop: 'status'
          }
        ],
        tableData: []
      }
    },
    components: {
      areaSelect,
      CommonTable,
      'c-echart': EchartCurve
    },
    created() {
      this.getRealInformation()
      this.getSystemList()
    },
    computed: {},
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
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
      handleCurrentChange(val) { // 获取当前页数
        this.form.pageNum = val
        this.getSatueList()
      },
      async getRealInformation() {
        let params = {
          floorId: null,
          pageNum: 1,
          pageSize: 10,
          systemId: 1,
          unitId: 9
        }
        let data = await Monitor.realInformation(params).catch(e => {
        })
        if (data.code === Code.SUCCESS) {
          data.data.list.forEach(item => {
            this.listData.push(item)
            /*   item.list.forEach(e =>{
                 this.xData.push(e.hour)
                 this.yData.push(e.value)
               })*/

          })
          console.log(this.listData);
          console.log(this.xData, this.yData);
        }
      },
      async getSatueList(){ // 状态详情列表
        let params = {
          floorId: null,
          pageNum: this.form.pageNum,
          pageSize: 10,
          unitId: 9
        }
        let data = await Monitor.getStatueDetails(params).catch(e=>{
        })
        if(data.code === Code.SUCCESS){
          data.data.list.forEach(item=>{
            let state = ['正常','异常']
            item.status = state[item.status]
          })
          this.tableData = data.data.list
        } else {
          this.$message.error(data.mesg)
        }
        console.log(data);
      },
      changeView(){
        this.showlist = !this. showlist
        this.getSatueList()

      },
      goDetail(installId) {
        this.$router.push({
          name: 'chartDetails',
          params: {
            id: installId
          }
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .inspectionDensity {
    height: 100%;
    .system-type-tabs {
      width: 96%;
      margin: 2% 2%;
      height: 96%;
      .systemType-box {
        font-size: 14px;
        padding: 20px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .system-fire-btn{
          margin-right: 1%;
          width: 99%;
        }
        .change-view {
          div {
            padding: 5px 3px;
            width: 130px;
            background: #1d83d8;
            border-radius: 4px;
            color: #ffffff;
            text-align: center;
            cursor: pointer;
          }
        }
      }
      .ec-list-box {
        height: 90%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
        margin: 5% 0;
        .ec-list-text {
          width: 25%;
          height: 25%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .equitment-name {
            margin-top: -70px;
            text-align: center;
          }
        }
      }
      .list-box{
        .pagination-container {
          text-align: center;
          margin: 10px;
        }
      }
    }
  }
</style>
