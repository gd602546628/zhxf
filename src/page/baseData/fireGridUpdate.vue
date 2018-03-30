<template>
  <div class="update-fireGrid" v-if="!showLineMap">
    <common-box title="添加消防网格：">
      <div class="row" justify-content-center>
        <el-form class="form-container"
                 ref="form"
                 :model="form"
                 label-width="120px"
                 :rules="rules"
        >
          <el-form-item label="消防网格名称" placeholder="请输入消防网格名称" prop="name">
            <el-input v-model="form.name" :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="所属区域：">
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
          <el-form-item label="范围划定：" placeholder="请输入监管部门" prop="scope">
            <el-button @click="goToDelineationMap">范围划定</el-button>
          </el-form-item>
          <el-form-item label="监管部门：" placeholder="请输入监管部门" prop="supUserId">
            <el-select v-model="form.supUserId">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息：" placeholder="请输入备注信息">
            <el-input type="textarea" v-model="form.remark" :maxlength="200"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </common-box>
    <div class="btn-group all-center">
      <div class="confirm all-center" @click.stop="submit">确定</div>
      <div class="cancel all-center" @click.stop="goBack">取消</div>
    </div>
  </div>
  <line-map v-else
            :defaultPoint="currentPoint"
            @cancel="hideLineMap"
            @confirm="lineMapConfirm"
            :editPoints="editPoints"
  ></line-map>
</template>

<script>
  import CommonBox from '../../component/commonBox.vue'
  import {Code as Code} from '../../config/config'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import {mapGetters} from 'vuex'
  import lineMap from '../../component/delineationMap.vue'
  import Api from '../../api/index'
  export default {
    components: {
      ElCol,
      ElRow,
      CommonBox,
      lineMap
    },
    data() {
      return {
        cityInfoProp: {
          label: 'name',
          value: 'id',
          children: 'nextArea'
        },
        id: '',
        currentPoint: null,
        area: [],
        form: {
          city: '',
          cityCode: '',
          county: '',
          countyCode: '',
          id: null,
          name: '',
          province: '',
          provinceCode: '',
          remark: '',
          scope: '',
          supUserId: ''
        },
        rules: {
          name: [{required: true, message: '请输入消防网格名称', trigger: 'blur'},],
          scope: [{required: true, message: '请进行区域划分', trigger: 'blur'},],
          supUserId: [{required: true, message: '请选择监管部门', trigger: 'blur'},]
        },
        showLineMap: false,
        userList: [],
        editPoints: [],// 编辑模式下，以前的网格点
      }
    },

    computed: {
      ...mapGetters(['q_cityInfo'])
    },
    created(){
      this.form.id = this.$route.params.id || null
      if (this.form.id) {
        this.init()
      }
    },
    methods: {
      selectCity(a){
        let province = this.getCityObjById(a[0])
        let city = this.getCityObjById(a[1])
        let county = this.getCityObjById(a[2])
        this.form.province = province.name
        this.form.provinceCode = province.id
        this.form.city = city.name
        this.form.cityCode = city.id
        this.form.county = county.name
        this.form.countyCode = county.id
        this.form.scope = ''
        this.form.supUserId = null
        this.editPoints = [] // 切换区域时自动将以前网格清空
        this.getUserList(province.id, city.id, county.id)
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
      lineMapConfirm(value){
        let result = ''
        this.editPoints = []
        value.forEach(point => {
          this.editPoints.push(point)
          result += `(${point.lng},${point.lat}),`
        })
        this.form.scope = result.substr(0, result.length - 1)
        this.showLineMap = false
      },
      hideLineMap(){
        this.showLineMap = false
      },
      goToDelineationMap() {
        if (this.area.length <= 0) {
          this.$alert('请先选择所属区域')
        } else {
          let city = this.getCityObjById(this.area[2])
          if (this.editPoints.length > 0) {
            this.currentPoint = {lon: this.editPoints[0].lng, lat: this.editPoints[0].lat}
          } else {
            this.currentPoint = {lon: city.lng, lat: city.lat}
          }
          this.showLineMap = true
        }
      },
      submit(){
        this.$refs.form.validate(async flag => {
          if (flag) {
            let data = await Api.base.addOrUpdateGrid(this.form)
            if (data.code === Code.SUCCESS) {
              let message = this.$route.params.id ? '修改成功' : '添加成功'
              this.$message.success(message)
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
      async getUserList(pro, cit, cou){
        /*TODO:跟换接口*/
        let data = await Api.setting.getAccount({
          pageSize: 1000,
          pageNum: 1,
          provinceCode: pro,
          cityCode: cit,
          countyCode: cou,
          type: 2
        })
        this.userList = data.data.list
      },
      async init(){
        let detail = await Api.base.getGridDetail({gridId: this.$route.params.id})
        this.form = detail.data
        let result = ''
        this.form.longitudeLatitudeList.forEach(point => {
          result += `(${point.longitude},${point.latitude}),`
          this.editPoints.push({lng: point.longitude, lat: point.latitude})
        })
        this.form.scope = result.substr(0, result.length - 1)
        this.getUserList(this.form.provinceCode, this.form.cityCode, this.form.countyCode)
        this.area = [this.form.provinceCode, this.form.cityCode, this.form.countyCode]
      }
    },
  }
</script>
<style lang="scss" scoped type="text/scss">
  .update-fireGrid {
    padding: 20px;
    .form-container {
      min-width: 60%;
      margin: 20px;
    }
    .right {
      text-align: right;
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
