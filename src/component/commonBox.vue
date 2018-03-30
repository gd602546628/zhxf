<template>
  <div class="commonBox">
    <div class="return" @click="goBack" v-if="showBack">返回</div>
    <div class="form-wrap">
      <div class="title">{{title}}</div>
      <slot></slot>
    </div>
  </div>
</template>


<script>
  export default {
    props: {
      title: String,
      showBack: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      goBack() {
        this.$router.back()
      }
    }
  }
</script>

<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .commonBox {
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
        color: #1d83d8;
        padding-left: 20px;
        height: 46px;
        line-height: 46px;
      }
    }
  }
</style>
