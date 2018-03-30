<template>
  <div class="transmission-update">
    <common-box title="单位管理">
      <div class="form">
        <el-form :model="formData" ref="form" :rules="rules">
          <el-form-item label="传输装置名称：" prop="name">
            <el-input v-model="formData.name" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="所属区域：" prop="area">
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
          <el-form-item label="所属网格：" prop="gridId">
            <el-select placeholder="请选择所属网格"
                       class="filter-input"
                       v-model="formData.gridId"
                       no-data-text="该区域无网格"
            >
              <el-option :label="item.gridName" v-for="item in gridList" :value="item.gridId"
                         :key="item.gridId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监督机构：" prop="supUserId">
            <el-select placeholder="请选择监督机构"
                       class="filter-input"
                       v-model="formData.supUserId"
                       no-data-text="该区域无监管部门"
            >
              <el-option :label="item.name" v-for="item in supUserIdList" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="传输装置ID：" prop="transmitNum">
            <el-input v-model="formData.transmitNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </common-box>
    <div class="btn-group all-center">
      <div class="confirm all-center" @click.stop="submit">保存</div>
      <div class="cancel all-center" @click.stop="goBack">取消</div>
    </div>
  </div>
</template>
<script>
  import commonBox from '../../component/commonBox.vue'
  import {mapGetters} from 'vuex'
  import Api from '../../api/index'
  import {Code} from '../../config/config'
  export default{
    components: {
      commonBox
    },
    computed: {
      ...mapGetters(['q_cityInfo', 'sysUserBg'])
    },
    data(){
      return {
        formData: {
          city: '',
          cityCode: '',
          county: '',
          countyCode: '',
          gridId: '',
          id: null,
          name: '',
          province: '',
          provinceCode: '',
          supUserId: '',
          transmitNum: '',
          area: []
        },
        cityInfoProp: {
          label: 'name',
          value: 'id',
          children: 'nextArea'
        },
        rules: {
          name: [
            {required: true, message: '请输入单位名称', trigger: 'blur'},
          ],
          property: [
            {required: true, message: '请选择单位属性', trigger: 'blur'},
          ],
          area: [
            {required: true, message: '请选择区域', trigger: 'blur', type: 'array'},
          ],
          supUserId: [
            {required: true, message: '请选择监管部门', trigger: 'blur'},
          ],
          gridId: [
            {required: true, message: '请选择监管部门', trigger: 'blur'},
          ],
          transmitNum: [
            {required: true, message: '请选择监管部门', trigger: 'blur'},
          ],
        },
        supUserIdList: [],
        gridList: []
      }
    },
    created(){
      if (this.$route.params.id) {
        this.init()
      }
    },
    methods: {
      selectCity(value){
        let province = this.getCityObjById(value[0])
        let city = this.getCityObjById(value[1])
        let county = this.getCityObjById(value[2])
        this.formData.provinceCode = province.id
        this.formData.province = province.name
        this.formData.cityCode = city.id
        this.formData.city = city.name
        this.formData.countyCode = county.id
        this.formData.county = county.name
        this.getSupUserIdList(province.id, city.id, county.id)
        this.getGridListToUnit(province.id, city.id, county.id)
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
      async getSupUserIdList(province, city, county){
        let data = await Api.setting.getAccount({
          type: 2,
          pageNum: 1,
          pageSize: 1000,
          provinceCode: province,
          cityCode: city,
          county: county
        })
        this.supUserIdList = data.data.list
      },
      async getGridListToUnit(province, city, county){
        let data = await Api.fireUnit.getGridListToUnit({
          cityCode: city,
          countyCode: county,
          provinceCode: province
        })
        this.gridList = data.data.list
      },
      async submit(){
        this.$refs.form.validate(async flag => {
          if (flag) {
            console.log(this.formData)
            let data = await Api.base.addOrUpdateTransmitDevice(this.formData)
            if (data.code === Code.SUCCESS) {
              this.$message.success(this.$route.params.id ? '修改成功' : '添加成功')
              this.$router.back()
            } else {
              this.$message.error(data.mesg)
            }
          }
        })
      },
      goBack(){
        this.$router.back()
      },
      async init(){
        let data = await Api.base.getDetailTransmitDevice({transmitId: this.$route.params.id})
        this.formData = data.data
        this.formData.area = [this.formData.provinceCode, this.formData.cityCode, this.formData.countyCode]
        this.getSupUserIdList(this.formData.provinceCode, this.formData.cityCode, this.formData.countyCode)
        this.getGridListToUnit(this.formData.provinceCode, this.formData.cityCode, this.formData.countyCode)
      }
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss'>
  .transmission-update {
    padding: 16px;
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
            width: 120px;
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
