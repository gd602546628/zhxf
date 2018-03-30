<template>
  <div class="add-role">
    <common-box title="添加角色">
      <el-form class="add-role-form" :rules="rules" ref="form" :model="formData">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="formData.name"
                    placeholder="名称为1-20位汉子、字母、数字、特殊字符"
                    style="width: 400px;"
                    :maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限配置：" prop="type">
          <el-tree :data="urls"
                   show-checkbox
                   default-expand-all
                   :expand-on-click-node="false"
                   @check-change="checkChange"
                   ref="tree"
                   :default-checked-keys="defaultChecked"
          >
          </el-tree>
        </el-form-item>
      </el-form>
    </common-box>
    <div class="btn-group all-center">
      <div class="confirm all-center" @click.stop="submit">确定</div>
      <div class="cancel all-center" @click.stop="goBack">取消</div>
    </div>
  </div>
</template>
<script>
  import commonBox from '../../component/commonBox.vue'
  import Api from '../../api/index'
  import {Code} from '../../config/config'
  import {mapGetters} from 'vuex'
  export default{
    components: {
      commonBox
    },
    data(){
      return {
        formData: {
          name: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 1, max: 20, message: '名称为1-20位汉子、字母、数字、特殊字符', trigger: 'blur'}
          ],
          type: [
            {type: 'array', required: true, message: '请至少选择一个权限配置', trigger: 'change'}
          ],
        },
        urls: [],
        defaultChecked: []
      }
    },
    computed: {
      ...mapGetters(['sysAuthUrls'])
    },
    created(){
      this.urlFormat()
    },
    methods: {
      goBack(){
        this.$router.back()
      },
      urlFormat(){
        let result = []
        let hasParent = []
        let arr = JSON.parse(JSON.stringify(this.sysAuthUrls))
        arr.forEach(item => {
          item.label = item.name
          if (item.parentId !== 0) {
            hasParent.push(item)
            for (let i = 0; i < arr.length; i++) {
              if (item.parentId === arr[i].id) {
                if (arr[i].children) {
                  let flag = false
                  arr[i].children.forEach(child => {
                    if (child.id === item.id) {
                      flag = true
                    }
                  })
                  if (!flag) {
                    arr[i].children.push(item)
                  }
                } else {
                  arr[i].children = [item]
                }
              }
            }
          }
        })
        result = arr.filter((item) => {
          let flag = true
          hasParent.forEach(a => {
            if (a.id === item.id) {
              flag = false
            }
          })
          return flag
        })
        this.urls = result
      },
      checkChange(){
        let nodes = this.$refs.tree.getCheckedNodes()
        let result = []
        nodes.forEach(item => {
          result.push(item.id)
          if (item.parentId !== 0) {
            result.push(item.parentId)
          }
        })
        this.formData.type = Array.from(new Set(result))
      },
      submit(){
        this.$refs.form.validate(valid => {
          if (valid) {
            Api.setting.addOrUpdateRole({
              roleName: this.formData.name,
              urls: this.formData.type,
              id: this.$route.params.id || null
            }).then(data => {
              if (data.code === Code.SUCCESS) {
                this.$message.success(this.$route.params.id ? '修改成功' : '添加成功')
                this.$router.back()
              } else {
                this.$message.error(data.mesg)
              }
            })
          }
        })
      },
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .add-role {
    padding: 18px;
    .add-role-form {
      padding: 36px 60px;
      .el-form-item {
        display: flex;
      }
    }
    .btn-group {
      margin-top: 42px;
      div {
        width: 100px;
        height: 38px;
        border-radius: 4px;
        color: #ffffff;
        cursor: pointer;
      }
      .confirm {
        background: #07c362;
      }
      .cancel {
        background: #989797;
        margin-left: 30px;
      }
    }
  }
</style>
