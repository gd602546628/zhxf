<template>
  <div class="q-table-wrap">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      stripe
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="80"
        v-if="!hideDelete"
      >
      </el-table-column>
      <el-table-column label="序号" width="80">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        :width="item.width||''"
        :prop="item.prop"
        :label="item.label"
        v-for="(item,index) in tableHeader"
        :key="index"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column :label="showLabel()" v-if="showOperation" :width="showOperationWidth">
        <template slot-scope="scope">
          <div class="operation">
            <div
              class="operation-item"
              v-for="item in scope.row.operation"
              :style="operationStyle(item)"
              @click="item.handle&&item.handle(scope.$index, scope.row)">{{item.label}}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="delete-btn" v-if="!hideDelete" @click.stop="deleteAll">
      批量删除
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      tableHeader: {
        type: Array,
        required: true
      },
      tableData: {
        type: Array,
        required: true
      },
      showOperation: { // 是否显示操作列
        type: Boolean,
        default: true
      },
      showState:{ // 操作/连接状态
        type: Boolean,
        default: false
      },
      hideDelete: { // 是否隐藏删除项
        type: Boolean,
        default: false
      },
      showOperationWidth: {
        type: Number,
        default: 360
      }
    },
    data() {
      return {
        multipleSelection: [],
      }
    },
    created() {
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteAll() {
        this.$emit('deleteAll', this.multipleSelection)
      },
      operationStyle(item) {
        return {
          color: item.color,
          background: item.background,
          borderRadius: item.borderRadius,
          border: `1px solid ${item.color}`
        }
      },
      showLabel(){ // 操作/连接状态 切换显示
        if(this.showState === true){
          return '连接状态'
        } else {
          return '操作'
        }
      }
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss'>
  .q-table-wrap {
    .el-table__row {
      td {
        text-align: center;
      }
    }
    .has-gutter {
      tr {
        th {
          background: #07c362;
          color: #ffffff;
          &:nth-child(1) {
            .cell {
              text-align: center;
            }
          }
          .cell {
            text-align: center;
          }
        }
      }
    }
    .delete-btn {
      color: #ffffff;
      background: #ff3c3c;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 114px;
      height: 32px;
      margin-top: 14px;
      cursor: pointer;
    }
    .operation {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .operation-item {
        padding: 0 20px;
        display: flex;
        justify-content: center;
        height: 24px;
        border-radius: 2px;
        margin-right: 10px;
      }
    }
  }
</style>
