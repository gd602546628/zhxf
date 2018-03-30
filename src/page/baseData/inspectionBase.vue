<template>
  <div class="fire-equipment">
    <el-menu
      :default-active="defaultActive"
      class="left"
      text-color="#fff"
      active-text-color="#fff"
    >
      <el-menu-item :index="item.name" v-for="item in systemList" :key="item.id"
                    @click="selectSystem(item)"
      >{{item.name}}
      </el-menu-item>
    </el-menu>
    <el-scrollbar class="right">
      <div class="right-content">
        <div class="equipment flex">
          <div class="equipment-item all-center"
               v-for="(item,index) in equipmentList"
               @click.stop="selectEquipment(item)"
               :class="{active:currentEquipment&&(item.id===currentEquipment.id)}"
          >
            <img :src="addFilePre(item.icon)" width="24" height="24" style="margin-right: 10px">
            <div>{{item.name}}</div>
          </div>
        </div>
        <common-box title="消防设备" :showBack="false" class="equipment-box" v-if="currentEquipment">


          <div class="quota">
            <div class="quota-title">设备巡查指标</div>
            <div class="quota-item" v-for="(item,index) in currentEquipment.indexList">
              <span class="name">指标{{index + 1}}：</span>
              <el-form class="input-box" :model="item" ref="quota_form" :rules="quotaRules">
                <el-form-item prop="position">
                  <el-input placeholder="检查部位" class="s-input" v-model="item.position" :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item prop="checkWay">
                  <el-input placeholder="检查方法" class="input" v-model="item.checkWay" :maxlength="100"></el-input>
                </el-form-item>
                <el-form-item prop="checkIndex">
                  <el-input placeholder="设备正常标准" class="input" v-model="item.checkIndex" :maxlength="100"></el-input>
                </el-form-item>
              </el-form>
              <div class="check-box-wrap">
                <el-checkbox :true-label="1" :false-label="0" v-model="item.isImage">照片</el-checkbox>
                <el-checkbox :true-label="1" :false-label="0" v-model="item.isVideo">视频</el-checkbox>
              </div>
              <div class="delete all-center" @click.stop="deleteIndex(index)">
                <i class="icon-delete"></i>
                <p>删除</p>
              </div>
            </div>
            <div class="add-quota all-center" @click.stop="addIndex">
              <i class="icon-add01"></i>
              <p>添加检查指标</p>
            </div>
          </div>

          <div class="frequency">
            <div class="frequency1">
              <div class="frequency-title">设备巡查频率</div>
              <div class="frequency-item">
                <span>每</span>
                <el-input placeholder="请输入数字" type="number" v-model="currentEquipment.frequen" :maxlength="3"></el-input>
                <el-select v-model="currentEquipment.frequenType" placeholder="请选择"
                           class="select"

                >
                  <el-option
                    label="年"
                    :value="0"
                  >
                  </el-option>
                  <el-option
                    label="月"
                    :value="1"
                  >
                  </el-option>
                  <el-option
                    label="日"
                    :value="2"
                  >
                  </el-option>
                </el-select>
                <span style="margin-left: 20px">巡检</span>
                <!--   <el-input placeholder="请输入数字" type="number"></el-input>-->
                <span>1次</span>
              </div>
            </div>
            <div class="frequency-item-bz flex">
              <div class="frequency-title">备注信息</div>
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="currentEquipment.comment"
                :maxlength="200"
              >
              </el-input>
            </div>
            <div class="frequency-item"></div>
          </div>
        </common-box>
        <div class="btn-group all-center">
          <div class="confirm all-center" @click.stop="save">保存</div>
          <!-- <div class="cancel all-center">取消</div>-->
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
  import commonBox from '../../component/commonBox.vue'
  import commonModel from '../../component/commonModel.vue'
  import Api from '../../api/index'
  import {Code, FilePre} from '../../config/config'
  import {mapGetters} from 'vuex'
  export default {
    components: {
      commonBox,
      commonModel
    },
    data() {
      return {
        value: 0,
        defaultActive: '',
        showModel: false,
        rules: {
          name: [
            {required: true, message: '请输入设备名称', trigger: 'blur'},
          ],
          icon: [
            {required: true, message: '请上传图标', trigger: 'blur'},
          ],
        },
        addParams: {
          name: '',
          icon: '',
          id: null,
          systemId: ''
        },
        systemList: [], // 系统列表
        equipmentList: [], //设备列表
        currentEquipment: null, //当前操作的设备
        currentSystem: null, // 当前操作的系统
        quotaRules: {
          position: [{required: true, message: '请输入检查部位', trigger: 'blur'},],
          checkWay: [{required: true, message: '请输入检查方法', trigger: 'blur'},],
          checkIndex: [{required: true, message: '请输入设备正常标准', trigger: 'blur'},]
        },
      }
    },
    computed: {
      ...mapGetters(['upload_file'])
    },
    created(){
      this.init()
    },
    methods: {
      addFilePre(val){
        return FilePre + val
      },
      async init(){
        this.systemList = await this.getSystemList()
        this.defaultActive = this.systemList[0].name
        this.selectSystem(this.systemList[0])
      },
      async selectSystem(item){ // 选择系统
        this.currentSystem = item
        this.currentEquipment = null
        await this.getEquipmentList(item.id)
        if (this.equipmentList.length > 0) {
          this.selectEquipment(this.equipmentList[0])
        }
      },
      selectEquipment(item){ // 头部选中设备
        this.currentEquipment = item
        this.getEquipmentDetail(item.id)
      },
      async getSystemList(){
        let data = await Api.base.getSystemList()
        return data.data
      },
      async getEquipmentList(id){
        let data = await Api.base.getEquipmentList({systemId: id})
        this.equipmentList = data.data
      },
      async getEquipmentDetail(id){
        let data = await Api.base.getEquipmentInfo({id: id})
        this.currentEquipment = data.data
      },
      addIndex(){ // 添加指标
        this.currentEquipment.indexList.push({
          checkIndex: '',
          checkWay: '',
          isImage: 0,
          isVideo: 0,
          position: ''
        })
      },
      addProperty(){ // 添加属性
        this.currentEquipment.properties.push({
          name: '',
          value: ''
        })
      },
      deleteProperty(index){
        this.currentEquipment.properties.splice(index, 1)
      },
      deleteIndex(index){
        this.currentEquipment.indexList.splice(index, 1)
      },
      async save(){
        let saveFlag = true
        if (this.$refs.quota_form) {
          this.$refs.quota_form.forEach(form => {
            form.validate(flag => {
              if (!flag) {
                saveFlag = false
              }
            })
          })
        }
        if (saveFlag) {
          this.currentEquipment.indexList.forEach(item => {
            if (item.isImage === 0 && item.isVideo === 0) {
              item.isView = 0
            }
            else if (item.isImage === 1 && item.isVideo === 0) {
              item.isView = 1
            } else if (item.isImage === 0 && item.isVideo === 1) {
              item.isView = 2
            } else if (item.isImage === 1 && item.isVideo === 1) {
              item.isView = 3
            }
          })
          let data = await Api.base.editEquipment(this.currentEquipment)
          if (data.code === Code.SUCCESS) {
            this.$message.success('保存成功')
          } else {
            this.$message.error(data.mesg)
          }
        }
      }
    },
  }
</script>
<style lang="scss" type="text/scss">
  .fire-equipment {
    color: #333333;
    height: 100%;
    display: flex;
    .left {
      height: 100%;
      width: 210px;
      background: #454751;
      border-top: 1px solid #434552;
      border-right: none;
      .el-menu-item:hover {
        background: #5c5d66;
        border-bottom: none;
      }
      .is-active {
        background: #5c5d66;
        border-bottom: none;
        color: #07c362;
      }
    }
    .right {
      flex: 1;
      margin-bottom: -17px;
      height: 100%;
      .right-content {
        padding: 24px 72px;
        .equipment {
          flex-wrap: wrap;
          .equipment-item {
            width: 140px;
            height: 36px;
            background: #ffeedf;
            position: relative;
            cursor: pointer;
            margin-right: 20px;
            margin-bottom: 14px;
            color: #fb7702;
            &.active {
              border: 1px solid #fb7702;
            }
            &:hover {
              .icon-wrap {
                display: flex;
              }
            }
            .icon-wrap {
              position: absolute;
              height: 100%;
              right: 0;
              display: none;
              .icon-item-1 {
                display: flex;
                align-items: center;
                justify-content: center;
                background: #07c362;
                width: 36px;
              }
              .icon-item-2 {
                display: flex;
                align-items: center;
                justify-content: center;
                background: #ff3c3c;
                width: 36px;
              }
            }
          }
          .add-equipment {
            i {
              &:before {
                color: #fb7702;
              }
              margin-right: 6px;
            }
          }
        }
        .equipment-box {
          .attribute {
            padding: 20px 30px;
            border-bottom: 1px dashed #d9d9d9;
            .attribute-title {
              font-weight: bold;
              margin-bottom: 16px;
            }
            .attribute-item {
              display: flex;
              align-items: center;
              margin-top: 10px;
              .name {
                width: 124px;
                text-align: right;
              }
              .input {
                width: 322px;
                margin-left: 12px;
              }
              .select {
                width: 192px;
                margin-left: 20px;
              }
              .delete {
                color: #ff3c3c;
                margin-left: 16px;
                cursor: pointer;
                p {
                  margin-left: 2px;
                }
              }
            }
            .add-attribute {
              margin-left: 136px;
              width: 322px;
              height: 38px;
              border: 1px dashed #07c362;
              color: #07c362;
              cursor: pointer;
              margin-top: 18px;
              p {
                margin-left: 6px;
              }
            }
          }
          .quota {
            padding: 20px 30px;
            border-bottom: 1px dashed #d9d9d9;
            .quota-title {
              font-weight: bold;
              margin-bottom: 16px;
            }
            .quota-item {
              display: flex;
              align-items: center;
              margin-top: 10px;
              .input-box {
                flex: 1;
                display: flex;
                overflow: hidden;
                .el-form-item {
                  flex: 1;
                  margin-right: 10px;
                }
              }
              .name {
                width: 124px;
                text-align: right;
                margin-bottom: 18px;
              }
              /*  .s-input {
                  width: 192px;
                  margin-left: 12px;
                }
                .input {
                  width: 320px;
                  margin-left: 14px;
                }*/
              .check-box-wrap {
                margin-left: 14px;
                margin-bottom: 18px;
              }
              .delete {
                color: #ff3c3c;
                margin-left: 16px;
                cursor: pointer;
                margin-bottom: 18px;
                p {
                  margin-left: 2px;
                }
              }
            }
            .add-quota {
              margin-left: 136px;
              width: 322px;
              height: 38px;
              border: 1px dashed #07c362;
              color: #07c362;
              cursor: pointer;
              margin-top: 18px;
              p {
                margin-left: 6px;
              }
            }
          }
          .frequency {
            padding: 20px 30px;
            .frequency-title {
              font-weight: bold;
              margin-right: 28px;
            }
            .frequency1 {
              display: flex;
              align-items: center;
              .frequency-item {
                display: flex;
                align-items: center;
                .el-input {
                  width: 118px;
                  margin: 0 12px;
                }
                .el-select {
                  width: 110px;
                  margin-right: 12px;
                }
              }
            }
            .frequency-item-bz {
              margin-top: 30px;
              .frequency-title {
                width: 103px;
                text-align: right;
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
    }
    .add-equipment-model-wrap {
      .add-equipment-model {
        padding: 26px 120px;
        border-bottom: 1px solid #d9d9d9;
        .el-form-item {
          display: flex;
        }
        .avatar-uploader {
          .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            &:hover {
              border-color: #409EFF;
            }
          }
          .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 62px;
            height: 62px;
            line-height: 62px;
            text-align: center;
          }
          .avatar {
            width: 62px;
            height: 62px;
            display: block;
          }
        }
        .tips {
          color: #a8a8a8;
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
  }
</style>
