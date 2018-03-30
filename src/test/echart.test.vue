<template>
  <div>
    <p>echarts</p>
    <a target="_blank" href="http://echarts.baidu.com/index.html">http://echarts.baidu.com/index.html</a>
    <div class="pie" ref="pie"></div>
  </div>
</template>

<script>
  import Echarts from 'echarts/lib/echarts'
  import Pie from 'echarts/lib/chart/pie'

  export default {
    data() {
      return {}
    },
    methods: {
      setPie() {
        Echarts.init(this.$refs.pie).setOption({
          series: {
            type: 'pie',
            data: [
              {name: 'A', value: 1212},
              {name: 'B', value: 2323},
              {name: 'C', value: 1919}
            ]
          }
        });
      }
    },
    mounted() {
      this.setPie()
    },
    components: {}
  }
</script>
<style lang="scss" scoped type="text/scss">
  .pie {
    width: 300px;
    height: 300px;
  }
</style>

