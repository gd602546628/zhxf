<template>
  <div class="account-manage">
    <div class="filter-wrap flex">
      <div class="filter-form flex" column flex1>
        <div class="filter-form-item">
          <div class="item">
            <span>账号：</span>
            <el-input placeholder="请输入账号" class="filter-input" v-model="formData.mobile"></el-input>
          </div>
          <div class="item">
            <span>姓名：</span>
            <el-input placeholder="请输入姓名" class="filter-input" v-model="formData.name"></el-input>
          </div>
          <div class="item">
            <span>角色：</span>
            <el-input placeholder="请输入角色" class="filter-input" v-model="formData.roleName"></el-input>
          </div>
        </div>
        <div class="filter-form-item">
          <div class="item">
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
          <div class="item">
            <span>账号状态：</span>
            <el-select placeholder="请选择账号状态" class="filter-input" v-model="formData.status">
              <el-option label="启用" :value="0">启用</el-option>
              <el-option label="停用" :value="1"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="filter-btn-wrap">
        <div class="btn all-center add" @click.stop="goAdd">
          <i class="icon-add02"></i>
          <p>添加账号</p>
        </div>
        <div class="btn all-center" @click="filterAccount">
          <i class="icon-sxuan"></i>
          <p>筛选</p>
        </div>
      </div>
    </div>
    <common-table :tableHeader="tableHeader" :tableData="tableData"  @deleteAll="deleteAll"></common-table>
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
        formData: {
          mobile: '',
          name: '',
          pageNum: 1,
          pageSize: 10,
          roleName: '',
          status: '',
          startTime: '',
          endTime: ''
        },
        tableData: [],
        tableHeader: [
          {
            label: '账号',
            prop: 'name'
          },
          {
            label: '单位/单位名称',
            prop: 'unit'
          },
          {
            label: '角色',
            prop: 'roleName'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          },
          {
            label: '账号状态',
            prop: 'statusLabel'
          },
          {
            label: '登录次数',
            prop: 'loginNum'
          },
          {
            label: '最后登录时间',
            prop: 'lastLoginTime'
          }
        ],
        operation: [
        /*  {
            label: '修改',
            color: '#1d83d8',
            handle: this.edit,
          },*/
          {
            label: '停用',
            color: '#fc8d43',
            handle: this.stop,
          },
          {
            label: '重置密码',
            color: '#07c362',
            handle: this.resetPassWord,
          },
          {
            label: '删除',
            color: '#ff3c3c',
            handle: this.delete,
          }
        ],
        operation1: [
        /*  {
            label: '修改',
            color: '#1d83d8',
            handle: this.edit,
          },*/
          {
            label: '启用',
            color: '#fc8d43',
            handle: this.start,
          },
          {
            label: '重置密码',
            color: '#07c362',
            handle: this.resetPassWord,
          },
          {
            label: '删除',
            color: '#ff3c3c',
            handle: this.delete,
          }
        ],
        pageCount: 1,
        total: 1
      }
    },
    async created(){
      this.tableData = await this.getAccount()
    },
    methods: {
      goAdd(){
        this.$router.push({name: 'addAccount'})
      },
      edit(index, item){ // 修改
      },
      async stop(index, item){ // 停用
        let data = await Api.setting.updateStatus({id: item.id, status: 1})
        if (data.code === Code.SUCCESS) {
          item.operation = this.operation1
          item.statusLabel = '停用'
          this.$message.success('停用成功')
        }
      },
      async resetPassWord(index, item){ //重置密码
        let data = await Api.setting.updatePassword({id: item.id, newPassword: '111111'})
        if (data.code === Code.SUCCESS) {
          this.$message.success('密码重置成功')
        }
      },
      async delete(index, item){ // 删除
        let data = await Api.setting.deleteUser({
          ids: [item.id]
        })
        if (data.code === Code.SUCCESS) {
          this.tableData.splice(index, 1)
          this.$message.success('删除成功')
        } else {
          this.$message.error(data.mesg)
        }
      },
      async start(index, item){//启用
        let data = await Api.setting.updateStatus({id: item.id, status: 0})
        if (data.code === Code.SUCCESS) {
          item.operation = this.operation
          item.statusLabel = '启用'
          this.$message.success('启用成功')
        }
      },
      async getAccount(){
        let data = await Api.setting.getAccount(this.formData)
        data = data.data
        this.total = data.allCount
        this.pageCount = data.totalPage
        let list = data.list
        list.forEach(item => {
          if (item.status === 0) {
            item.operation = this.operation
            item.statusLabel = '启用'
          } else {
            item.operation = this.operation1
            item.statusLabel = '停用'
          }
        })
        return list
      },
      async filterAccount(){
        this.formData.pageNum = 1
        this.tableData = await this.getAccount()
      },
      async loadPage(currentPage){
        this.formData.pageNum = currentPage
        this.tableData = await this.getAccount()
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
        let data = await Api.setting.deleteUser({
          ids: result
        })
        if (data.code === Code.SUCCESS) {
          this.$message.success('删除成功')
          this.tableData = left
        } else {
          this.$message.error('删除失败')
        }
      },
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .account-manage {
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
