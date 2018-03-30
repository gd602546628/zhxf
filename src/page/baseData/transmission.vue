<template>
  <div class="transmission">
    <div class="filter-wrap flex">
      <div class="filter-form flex" column flex1>
        <div class="filter-form-item">
          <div class="item">
            <span>传输装置名称：</span>
            <el-input placeholder="请输入传输装置名称" class="filter-input" v-model="formData.name"></el-input>
          </div>
          <div class="item">
            <span>所属区域：</span>
            <el-cascader
              placeholder="试试搜索：玉溪"
              expand-trigger="hover"
              :options="q_cityInfo"
              :props="cityInfoProp"
              @change="selectCity"
              filterable
            >
            </el-cascader>
          </div>
          <div class="item">
            <span>所属网格：</span>
            <el-input placeholder="请输入所属网格" class="filter-input" v-model="formData.gridName"></el-input>
          </div>
        </div>
        <div class="filter-form-item">
          <div class="item">
            <span>监督机构：</span>
            <el-input v-model="formData.supUserName" placeholder="请输入监督机构"></el-input>
            <!--  <el-select placeholder="请选择监督机构" class="filter-input" v-model="formData.supUserId">
                <el-option :label="item.name" v-for="item in supUserIdList" :value="item.id" :key="item.id"></el-option>
              </el-select>-->
          </div>
          <div class="item">
            <span>创建时间：</span>
            <el-date-picker
              type="date"
              placeholder="选择开始时间"
              class="filter-input"
              value-format="yyyy-MM-dd"
              v-model="formData.addStartTime"
            ></el-date-picker>
            <span class="line"></span>
            <el-date-picker
              type="date"
              placeholder="选择结束时间"
              class="filter-input"
              value-format="yyyy-MM-dd"
              v-model="formData.addEndTime"
            ></el-date-picker>
          </div>
        </div>
      </div>
      <div class="filter-btn-wrap">
        <div class="btn all-center add" @click.stop="goAdd">
          <i class="icon-add02"></i>
          <p>添加传输装置</p>
        </div>
        <div class="btn all-center" @click="filter">
          <i class="icon-sxuan"></i>
          <p>筛选</p>
        </div>
      </div>
    </div>

    <common-table :tableHeader="tableHeader" :tableData="tableData" :hideDelete="true"></common-table>

    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="this.formData.pageSize"
        :page-count="pageCount"
        @current-change="loadPage"
      >
      </el-pagination>
    </div>
    <common-model :show="showModel" title="查看传输装置信息" @closeModel="closeModel" class="look-model">
      <div class="wrap">
        <div class="wrap-item">
          <span>传输装置名称：</span>
          <p>{{currentTransmission.name}}</p>
        </div>
        <div class="wrap-item">
          <span>添加时间：</span>
          <p>{{currentTransmission.createTime}}</p>
        </div>
        <div class="wrap-item">
          <span>所属区域：</span>
          <p>{{currentTransmission.areaNamw}}</p>
        </div>
        <div class="wrap-item">
          <span>所属网格：</span>
          <p>{{currentTransmission.gridName}}</p>
        </div>
        <div class="wrap-item">
          <span>监督机构：</span>
          <p>{{currentTransmission.supName}}</p>
        </div>
        <div class="wrap-item">
          <span>传输装置状态：</span>
          <p>{{currentTransmission.status}}</p>
        </div>
        <div class="wrap-item">
          <span>消防单元：</span>
          <p>{{currentTransmission.unitName}}</p>
        </div>
      </div>
    </common-model>
  </div>
</template>
<script>
  import commonTable from '../../component/table.vue'
  import {mapGetters} from 'vuex'
  import Api from '../../api/index'
  import {Code} from '../../config/config'
  import commonModel from '../../component/commonModel.vue'
  export default{
    components: {
      commonTable,
      commonModel
    },
    computed: {
      ...mapGetters(['q_cityInfo', 'sysUserBg'])
    },
    data(){
      return {
        formData: {
          pageNum: 1,
          pageSize: 10,
          addEndTime: '',
          addStartTime: '',
          cityCode: '',
          countyCode: '',
          gridName: '',
          name: '',
          provinceCode: '',
          supUserName: ''
        },
        pageCount: 1,
        total: 1,
        tableData: [],
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
            prop: 'areaName'
          },
          {
            label: '所属网格',
            prop: 'gridName'
          },
          {
            label: '监督机构',
            prop: 'supName'
          },
        ],
        operation: [
          {
            label: '查看',
            color: '#07c362',
            handle: this.look,
          },
          {
            label: '修改',
            color: '#20a7fe',
            handle: this.editHandler,
          },
          {
            label: '删除',
            color: '#ff3c3c',
            handle: this.deleteHandler,
          }
        ],
        cityInfoProp: {
          label: 'name',
          value: 'id',
          children: 'nextArea'
        },
        supUserIdList: [],
        showModel: false,
        currentTransmission: {}
      }
    },
    created(){
      this.getSupUserIdList()
      this.getPageTransmitDeviceList()
    },
    methods: {
      closeModel(){
        this.showModel = false
      },
      editHandler(index, item){
        this.$router.push({name: 'transmissionUpdate', params: {id: item.id}})
      },
      async deleteHandler(index, item){
        let data = await Api.base.delTransmitDevice({
          transmitDeviceId: item.id
        })
        if (data.code === Code.SUCCESS) {
          this.tableData.splice(index, 1)
          this.$message.success('删除成功')
        } else {
          this.$message.error(data.mesg)
        }
      },
      look(index, item){
        this.showModel = true
        this.currentTransmission = item
      },
      goAdd(){
        this.$router.push({name: 'transmissionUpdate'})
      },
      filter(){
        this.formData.pageNum = 1
        this.getPageTransmitDeviceList()
      },
      async loadPage(currentPage){
        this.formData.pageNum = currentPage
        this.getPageTransmitDeviceList()
      },
      selectCity(value){
        let province = this.getCityObjById(value[0])
        let city = this.getCityObjById(value[1])
        let county = this.getCityObjById(value[2])
        this.formData.provinceCode = province.id
        this.formData.cityCode = city.id
        this.formData.countyCode = county.id
      },
      getCityObjById(id){ // 更具id获取城市对象
        let result = null
        let step = function (item) {
          if (item.id === id) {
            result = item
            return
          }
          if (item.nextArea && item.nextArea.length > 0) {
            item.nextArea.forEach(innerItem => {
              step(innerItem)
            })
          }
        }
        this.q_cityInfo.forEach(item => {
          step(item)
        })
        return JSON.parse(JSON.stringify(result))
      },
      async getSupUserIdList(){
        let data = await Api.setting.getAccount({
          type: 2,
          pageNum: 1,
          pageSize: 1000,
        })
        this.supUserIdList = data.data.list
      },
      async getPageTransmitDeviceList(){
        let data = await Api.base.getPageTransmitDeviceList(this.formData)
        this.total = data.data.allCount
        this.pageCount = data.data.totalPage
        data.data.list.forEach(item => {
          item.operation = this.operation
          item.areaName = item.province + item.city + item.county
        })
        this.tableData = data.data.list
      }
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .transmission {
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
            .el-input {
              flex: 1;
            }
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
      margin-top: 20px;
      text-align: center;
    }
    .look-model {
      .wrap {
        padding: 20px 40px;
        .wrap-item {
          display: flex;
          margin-bottom: 14px;
          p {
            margin-left: 10px;
          }
        }
      }
    }
  }
</style>
