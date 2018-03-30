<template>
  <div class="role-manage">
    <div class="filter-wrap flex">
      <div class="filter-form flex" column flex1>
        <div class="filter-form-item">
          <span>角色名称：</span>
          <el-input placeholder="请输入角色名称" class="filter-input" v-model="formData.roleName"></el-input>
        </div>
        <div class="filter-form-item">
          <span>创建时间：</span>
          <el-date-picker
            type="datetime"
            placeholder="选择开始时间"
            class="filter-input"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="formData.startTime"
          ></el-date-picker>
          <span class="line"></span>
          <el-date-picker
            type="datetime"
            placeholder="选择结束时间"
            class="filter-input"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="formData.endTime"
          ></el-date-picker>
        </div>
      </div>
      <div class="filter-btn-wrap">
        <div class="btn all-center add" @click.stop="goAdd">
          <i class="icon-add02"></i>
          <p>添加角色</p>
        </div>
        <div class="btn all-center" @click="filterRoll()">
          <i class="icon-sxuan"></i>
          <p>筛选</p>
        </div>
      </div>
    </div>
    <common-table :tableHeader="tableHeader" :tableData="tableData" @deleteAll="deleteAll"></common-table>
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
  import {Code} from '../../config/config'
  export default{
    components: {
      commonTable
    },
    data(){
      return {
        tableData: [],
        tableHeader: [
          {
            label: '角色名称',
            prop: 'roleName'
          },
          {
            label: '创建账号',
            prop: 'createUser'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          }
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
        formData: {
          roleName: '',
          startTime: '',
          endTime: '',
          pageNum: 1,
          pageSize: 10
        },
        pageCount: 1,
        total: 1
      }
    },
    async created(){
      this.tableData = await this.getRole()
    },
    methods: {
      editHandler(index, item){
        this.$router.push({
          name: 'addRole',
          params: {
            id: item.id
          }
        })
      },
      async deleteHandler(index, item){
        let data = await Api.setting.deleteRole({
          ids: [item.id]
        })
        if (data.code === Code.SUCCESS) {
          this.tableData.splice(index, 1)
          this.$message.success('删除成功')
        } else {
          this.$message.error(data.mesg)
        }
      },
      goAdd(){
        this.$router.push(
          {name: 'addRole'}
        )
      },
      async getRole(){
        let data = await Api.setting.getAllRole(this.formData)
        data = data.data
        this.total = data.allCount
        this.pageCount = data.totalPage
        let list = data.list
        list.forEach(item => {
          item.operation = this.operation
        })
        return list
      },
      async deleteAll(arr){
        let result = []
        let left = []
        this.tableData.forEach(item => {
          if (arr.indexOf(item) >= 0) {
            result.push(item.id)
          } else {
            left.push(item)
          }
        })
        let data = await Api.setting.deleteRole({
          ids: result
        })
        if (data.code === Code.SUCCESS) {
          this.$message.success('删除成功')
          this.tableData = left
        } else {
          this.$message.error('删除失败')
        }
      },
      async loadPage(currentPage){ // 点击分页器
        this.formData.pageNum = currentPage
        this.tableData = await this.getRole()
      },
      async filterRoll(){ // 筛选用户
        this.formData.pageNum = 1
        this.tableData = await this.getRole()
      }
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .role-manage {
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
          margin-top: 14px;
          display: flex;
          align-items: center;
          .line {
            height: 1px;
            background: #cacbd0;
            width: 16px;
            margin: 0 12px;
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
