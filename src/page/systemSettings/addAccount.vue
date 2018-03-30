<template>
  <div class="add-account">
    <common-box title="添加账号">
      <div class="form">
        <el-form :model="formData" :rules="rules" ref="form">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="formData.name" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="mobile">
            <el-input v-model="formData.mobile" :maxlength="15"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="formData.password" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="账号类型：" prop="type" v-if="sysUserBg.type===3">
            <el-select placeholder="请选择账号类型" v-model="formData.type">
              <el-option
                v-for="item in accountType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域：" prop="area" v-if="formData.type===2">
            <el-cascader
              placeholder="试试搜索：玉溪"
              expand-trigger="hover"
              :options="q_cityInfo"
              v-model="formData.area"
              :props="cityInfoProp"
              @change="selectCity"
              filterable
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="formData.comment"></el-input>
          </el-form-item>
          <el-form-item label="选择角色：" prop="roleItem">
            <el-radio-group v-model="formData.roleItem">
              <el-radio :label="item" name="role" v-for="(item,index) in roleList" :key="item.id">{{item.roleName}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </common-box>
    <div class="btn-group all-center">
      <div class="confirm all-center" @click.stop="submit">确定</div>
      <div class="cancel all-center" @click.stop="goBack">取消</div>
    </div>
  </div>
</template>
<script>
  import commonBox from '../../component/commonBox.vue'
  import {mapGetters} from 'vuex'
  import Api from '../../api/index'
  import {Code} from '../../config/config'
  import Util from '../../service/util'
  export default{
    components: {
      commonBox
    },
    data(){
      return {
        formData: {
          cityCode: '',
          cityName: '',
          comment: '',
          countyCode: '',
          countyName: '',
          mobile: '',
          name: '',
          password: '',
          provinceCode: '',
          provinceName: '',
          roleId: '',
          roleName: '',
          type: '',
          area: [],
          roleItem: []
        },
        accountType: [
          {
            value: 0,
            label: '物业账号'
          },
          {
            value: 1,
            label: '维保账号'
          },
          {
            value: 2,
            label: '支队账号'
          },
        ],
        rules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {min: 1, max: 20, message: '名称为1-20位汉字、字母、数字、特殊字符', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入电话', trigger: 'blur'},
            {message: Util.rules.mobile[1], trigger: 'blur', pattern: Util.rules.mobile[0]}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 1, max: 16, message: '密码为1-16位汉字、字母、数字、特殊字符', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择账号类型', trigger: 'blur'},
          ],
          area: [
            {required: true, message: '请选择区域', trigger: 'blur', type: 'array'},
          ],
          roleItem: [{required: true, message: '请至少选择一个角色', trigger: 'change'}]
        },
        cityInfoProp: {
          label: 'name',
          value: 'id',
          children: 'nextArea'
        },
        roleList: []
      }
    },
    computed: {
      ...mapGetters(['q_cityInfo', 'sysUserBg'])
    },
    created(){
      this.getRoleList()
      if (this.sysUserBg.type !== 3) {
        this.formData.type = this.sysUserBg.type
      }
    },
    methods: {
      goBack(){
        this.$router.back()
      },
      async submit(){
        this.$refs.form.validate(valil => {
          if (valil) {
            this.formData.roleName = this.formData.roleItem.roleName
            this.formData.roleId = this.formData.roleItem.id
            this.addAccount()
          }
        })
      },
      selectCity(value){
        let province = this.getCityObjById(value[0])
        let city = this.getCityObjById(value[1])
        let county = this.getCityObjById(value[2])
        this.formData.provinceCode = province.id
        this.formData.provinceName = province.name
        this.formData.cityCode = city.id
        this.formData.cityName = city.name
        this.formData.countyCode = county.id
        this.formData.countyName = county.name
      },
      async getRoleList(){
        let data = await Api.setting.getAllRole()
        this.roleList = data.data.list
      },
      async addAccount(){
        let data = await Api.setting.addUser(this.formData)
        if (data.code === Code.SUCCESS) {
          this.$message.success('添加成功')
          this.$router.back()
        } else {
          this.$message.error(data.mesg)
        }
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
      }
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss'>
  .add-account {
    padding: 18px;
    .form {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 26px;
      padding-bottom: 40px;
      .el-form {
        .el-form-item {
          display: flex;
          margin-top: 26px;
          label {
            width: 100px;
          }
          input {
            width: 400px;
          }
          textarea {
            height: 126px;
          }
          .el-form-item__content {
            flex: 1;
          }
        }
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
