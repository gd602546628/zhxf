<template>
  <div>
    <el-form class="fire-grid-wrap" :inline="true" ref="form" :model="form" label-width="150px">
      <el-row>
        <el-col :span="20">
          <div>
            <el-form-item label="消防网格名称">
              <el-input placeholder="请输入消防网格名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="所属区域">
              <el-cascader
                placeholder="试试搜索：玉溪"
                expand-trigger="hover"
                :options="q_cityInfo"
                v-model="area"
                :props="cityInfoProp"
                @change="selectCity"
                filterable
              >
              </el-cascader>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="监管部门">
              <el-input v-model="form.supName" placeholder="请输入监管部门"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="row" align-items-end column>
            <el-form-item>
              <el-button class="btn add" @click="goToFireGridAdd">添加消防网格</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="btn" @click="filter">筛选</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <common-table :hideDelete="true" :tableHeader="tableHeader" :tableData="tableData"></common-table>
    <div class="row pagination-container" justify-content-center>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="this.form.pageSize"
          :page-count="pageCount"
          @current-change="currentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
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
          name: '',
          cityCode: '',
          countyCode: '',
          provinceCode: '',
          supName: '',
          pageSize: 10,
          pageNum: 1
        },
        tableData: [],
        tableHeader: [
          {
            label: '消防网格名称',
            prop: 'name'
          },
          {
            label: '所属区域',
            prop: 'area'
          },
          {
            label: '监管部门',
            prop: 'supName'
          },
        ],
        operation: [
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
        ],
        cityInfoProp: {
          label: 'name',
          value: 'id',
          children: 'nextArea'
        },
        area: []
      }
    },
    computed: {
      ...mapGetters(['q_cityInfo'])
    },
    created(){
      this.getGridList()
    },
    methods: {
      goToFireGridAdd() {
        this.$router.push({name: 'fireGridUpdate'})
      },
      editHandler(index, item) {
        this.$router.push({name: 'fireGridUpdate', params: {id: item.id}})
      },
      async deleteHandler(index, item) {
        let data = await Api.base.delGrid({
          gridId: item.id
        })
        if (data.code === Code.SUCCESS) {
          this.tableData.splice(index, 1)
          this.$message.success('删除成功')
        } else {
          this.$message.error(data.mesg)
        }
      },
      async currentChange(val) {
        this.form.pageNum = val
        this.getGridList()
      },
      async filter(){
        this.form.pageNum = 1
        this.getGridList()
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
      selectCity(val){
        this.form.provinceCode = val[0]
        this.form.cityCode = val[1]
        this.form.countyCode = val[2]
      },
      async getGridList(){
        let data = await Api.base.getGridList(this.form)
        this.pageCount = data.data.totalPage
        this.total = data.data.allCount
        data.data.list.forEach(item => {
          item.operation = this.operation
        })
        this.tableData = data.data.list
      }
    },
  }
</script>
<style lang="scss" scoped type="text/scss">
  .fire-grid-wrap {
    margin: 20px;
    background: #ffeedf;
    border-radius: 6px;
    padding: 20px 10px 0 10px;
    .el-form-item {
      .el-form-item__label {
        font-size: 16px;
        color: #333333;
      }
      .el-form-item__content {
      }
    }
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
</style>
