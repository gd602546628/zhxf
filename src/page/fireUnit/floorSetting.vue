<template>
  <div class="floor-setting">
    <div class="return" @click="goBack">返回</div>
    <div class="form-wrap">
      <div class="title">
        <ul>
          <li>楼层</li>
          <li>楼层代号</li>
          <li>楼层平面图</li>
          <li>操作</li>
        </ul>
      </div>
      <div class="floor-wrap">
        <div class="floor-item" v-for="(item,index) in floorList">
          <div class="item">
            <el-input placeholder="请输入楼层" v-model="item.floorLevel" type="number" :maxlength="4"></el-input>
          </div>
          <div class="item">
            <el-input placeholder="请输入楼层代号" v-model="item.nameLevel" :maxlength="20"></el-input>
          </div>
          <div class="item">
            <el-upload :show-file-list="false"
                       :on-success="uploadSuccess"
                       :action="upload_file"
                       class="el-upload-wrap"
            >
              <div class="upload" @click="upLoadClick(index)" v-if="!item.url">
                <i class="icon-add01"></i>
                <p>上传楼层平面图</p>
              </div>
              <img v-else :src="addFirePre(item.url)" class="floor-image">
            </el-upload>
          </div>
          <div class="item">
            <p class="add" @click.stop="addFloor(index)">向下添加一层</p>
            <p class="delete" @click.stop="deleteFloor(index,item)">删除</p>
          </div>
        </div>
      </div>
    </div>

    <div class="btn-group all-center">
      <el-button type="info" size="medium" @click="goBack">上一步</el-button>
      <el-button type="primary" size="medium" @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>

<script>
  import Api from '../../api/index'
  import {mapGetters} from 'vuex'
  import {Code, FilePre} from '../../config/config'
  export default {
    data(){
      return {
        id: null,
        floorList: [],
        currentUploadIndex: 0
      }
    },
    computed: {
      ...mapGetters(['upload_file'])
    },
    created(){
      this.id = parseInt(this.$route.params.id)
      this.getFloorList()
    },
    methods: {
      goBack() {
        this.$router.replace({name: 'fireUnitAdd', params: {unitType: 0, id: this.id}})
      },
      async nextStep(){
        let data = await Api.fireUnit.addFloors({
          list: this.floorList,
          unitId: this.id
        })
        if (data.code === Code.SUCCESS) {
          this.$router.push({name: 'fireUnitEquipment', params: {id: this.id, unitType: 0}})
        } else {
          this.$message.error(data.mesg)
        }
      },
      async getFloorList(){
        let data = await Api.fireUnit.getFloorList({unitId: this.id})
        this.floorList = data.data.list
        if (this.floorList.length === 0) {
          this.floorList.push({
            floorLevel: '',
            nameLevel: '',
            unitId: this.id,
            url: ''
          })
        }
      },
      addFloor(index){
        this.floorList.splice(index + 1, 0, {
          floorLevel: '',
          nameLevel: '',
          unitId: this.id,
          url: ''
        });
      },
      async deleteFloor(index, item){
        this.floorList.splice(index, 1)
        if (!item.id) return
        let data = await Api.fireUnit.delFloor({floorId: item.id})
        if (data.code === Code.SUCCESS) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(data.mesg)
        }
      },
      uploadSuccess(data){
        this.floorList[this.currentUploadIndex].url = data.data
      },
      upLoadClick(index){
        this.currentUploadIndex = index
      },
      addFirePre(value){
        return FilePre + value
      }
    }
  }
</script>

<style lang='scss' type="text/scss" rel='stylesheet/scss'>
  .floor-setting {
    padding: 20px;
    .return {
      background: #fe842b;
      color: #ffffff;
      height: 28px;
      width: 56px;
      line-height: 28px;
      text-align: center;
      cursor: pointer;
    }
    .form-wrap {
      border: 1px dashed #d9d9d9;
      border-top: none;
      margin-top: 16px;
      .title {
        background: #dceefc;
        color: #343535;
        height: 46px;
        line-height: 46px;
        text-align: center;
        ul {
          margin: 0 auto;
          display: flex;
          width: 80%;
          li {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 30px;
          }
        }
      }
      .floor-wrap {
        .floor-item {
          padding: 10px 10%;
          display: flex;
          align-items: flex-start;
          &:nth-child(even) {
            background: #f5f5f9;
          }
          .item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 36px;
            margin-left: 30px;
            .el-upload-wrap {
              width: 100%;
              height: 100%;
              .el-upload {
                width: 100%;
              }
              .upload {
                display: flex;
                color: #07c362;
                border: 1px dashed #07c362;
                align-items: center;
                justify-content: center;
                height: 36px;
                width: 100%;
                cursor: pointer;
                background: #ffffff;
                padding: 0 10px;
              }
              .floor-image {
                height: 76px;
                width: 100%;
              }
            }
            .add {
              width: 60%;
              height: 36px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid #1d83d8;
              color: #1d83d8;
              cursor: pointer;
              background: #ffffff;
            }
            .delete {
              width: 30%;
              height: 36px;
              margin-left: 10%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid #ff3c3c;
              color: #ff3c3c;
              cursor: pointer;
              background: #ffffff;
            }
          }
        }
      }
    }
    .btn-group {
      margin-top: 30px;
    }
  }
</style>
