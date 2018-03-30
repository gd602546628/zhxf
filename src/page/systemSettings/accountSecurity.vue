<template>
  <div class="account-security">
    <common-box title="账号安全">
      <div class="form all-center">
        <div class="name form-item">
          <span>姓名：</span>
          <p flex1>{{sysUserBg.name}}</p>
        </div>
        <div class="phone form-item">
          <span>联系电话：</span>
          <p flex1>{{sysUserBg.mobile}}</p>
        </div>
        <div class="code form-item">
          <span>验证码：</span>
          <div class="flex" flex1>
            <el-input v-model="code"></el-input>
            <div class="button all-center" v-if="!isSendingCode" @click.stop="sendCode">获取验证码</div>
            <div class="button all-center timer" v-if="isSendingCode">{{codeSecond}}s</div>
          </div>
        </div>
        <div class="name form-item">
          <span>密码：</span>
          <el-input flex1 v-model="password"></el-input>
        </div>
        <div class="name form-item">
          <span>确认密码：</span>
          <el-input flex1 v-model="password1"></el-input>
        </div>
      </div>
    </common-box>
    <div class="btn-group all-center">
      <div class="confirm all-center" @click.stop="confirm">确定</div>
      <div class="cancel all-center" @click.stop="cancel">取消</div>
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
      ...mapGetters(['sysUserBg'])
    },
    data(){
      return {
        password: '',
        password1: '',
        code: '',
        timer: null,
        isSendingCode: false,
        codeSecond: 60
      }
    },
    methods: {
      async sendCode(){
        if (this.isSendingCode) return
        let data = await Api.setting.getCode({mobile: this.sysUserBg.mobile})
        console.log(data)
        this.isSendingCode = true
        this.codeSecond = 60
        this.timer = setInterval(() => {
          this.codeSecond--
          if (this.codeSecond <= 0) {
            clearInterval(this.timer)
            this.isSendingCode = false
          }
        }, 1000)
      },
      cancel(){
        this.$router.back()
      },
      async confirm(){
        if (!this.code) {
          this.$message.error('请输入验证码')
          return
        }
        if (this.password !== this.password1) {
          this.$message.error('两次输入的密码不一致')
          return
        }
        let data = await Api.setting.updatePasswordByCode({
          mobile: this.sysUserBg.mobile,
          code: this.code,
          newPassword: this.password
        })
        if (data.code === Code.SUCCESS) {
          this.$message.success('修改密码成功')
          this.$router.back()
        } else {
          this.$message.error(data.mesg)
        }
      }
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss'>
  .account-security {
    padding: 18px;
    .form {
      flex-direction: column;
      padding-bottom: 40px;
      .form-item {
        display: flex;
        width: 400px;
        margin-top: 20px;
        span {
          width: 120px;
          margin-right: 10px;
          text-align: right;
          color: #333333;
          font-weight: bold;
        }
        &.code {
          .button {
            margin-left: 10px;
            width: 140px;
            height: 100%;
            color: #ffffff;
            background: #07c362;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            &.timer {
              background: #989797;
            }
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
