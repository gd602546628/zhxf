<template>
  <div class="companyManage">
    <div class="filter-wrap flex">
      <div class="filter-form flex" column flex1>
        <div class="filter-form-item">
          <div class="item">
            <span>单位名称：</span>
            <el-input placeholder="请输入单位名称" class="filter-input" v-model="formData.name"></el-input>
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
            <span>单位属性：</span>
            <el-select placeholder="请选择单位属性" v-model="formData.property" filterable>
              <el-option
                v-for="item in organizationList"
                :key="item.number"
                :label="item.name"
                :value="item.number"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="filter-form-item">
          <div class="item">
            <span>监督机构：</span>
            <el-select placeholder="请选择监督机构" class="filter-input" v-model="formData.supUserId">
              <el-option :label="item.name" v-for="item in supUserIdList" :value="item.id" :key="item.id"></el-option>
            </el-select>
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
          <p>添加单位</p>
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
  </div>
</template>
<script>
  import commonTable from '../../component/table.vue'
  import Api from '../../api/index'
  import {mapGetters} from 'vuex'
  import {Code} from '../../config/config'
  export default{
    components: {
      commonTable
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
          name: '',
          property: '',
          provinceCode: '',
          supUserId: ''
        },
        pageCount: 1,
        total: 1,
        tableData: [],
        tableHeader: [
          {
            label: '单位名称',
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
            label: '单位属性',
            prop: 'propertyName'
          },
          {
            label: '监督机构',
            prop: 'supName'
          },
        ],
        operation: [
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
        organizationList: [],
        cityInfoProp: {
          label: 'name',
          value: 'id',
          children: 'nextArea'
        },
        supUserIdList: []
      }
    },
    computed: {
      ...mapGetters(['q_cityInfo', 'sysUserBg'])
    },
    created(){
      this.getPageOrganizationList()
      this.getOrganizationList()
      this.getSupUserIdList()
    },
    methods: {
      editHandler(index, item){
        this.$router.push({name: 'companyUpdate', params: {id: item.id}})
      },
      async deleteHandler(index, item){
        let data = await Api.base.delOrganization({
          organizationId: item.id
        })
        if (data.code === Code.SUCCESS) {
          this.tableData.splice(index, 1)
          this.$message.success('删除成功')
        } else {
          this.$message.error(data.mesg)
        }
      },
      goAdd(){
        this.$router.push({name: 'companyUpdate'})
      },
      filter(){
        this.formData.pageNum = 1
        this.getPageOrganizationList()
      },
      async loadPage(currentPage){
        this.formData.pageNum = currentPage
        this.getPageOrganizationList()
      },
      async getPageOrganizationList(){
        let data = await Api.base.getPageOrganizationList(this.formData)
        console.log(data)
        this.total = data.data.allCount
        this.pageCount = data.data.totalPage
        data.data.list.forEach(item => {
          item.operation = this.operation
          item.areaName = item.province + item.city + item.county
        })
        this.tableData = data.data.list
      },
      async getOrganizationList(){
        let data = await Api.fireUnit.getEnumList({type: 4})
        this.organizationList = data.data.organizationList
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
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .companyManage {
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
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
