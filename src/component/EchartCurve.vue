/**
* Created by ljl on 2018/3/21
*/
<template>
  <!-- echart直线图 -->
  <div class="echartCurve" ref="Lin" id="echartCurve" :style="echartStyle"></div>
</template>

<script>
  // 导入echarts
  import Echarts from 'echarts/lib/echarts'
  import Lin from 'echarts/lib/chart/line'
  import Tooltip from 'echarts/lib/component/tooltip'
  import dataZoom from 'echarts/lib/component/dataZoom'

  export default {
    props: {
      // 样式
      echartStyle: {
        type: Object,
        default() {
          return {
            width: '300px',
            height: '300px'
          }
        }
      },
      // 标题文本
      titleText: {
        type: String,
        default: ''
      },
      color: { // 区域颜色
        type: Array,
        default() {
          return ['#32d581']
        }
      },
      listData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        charts: null,
        xData: [2, 3, 4, 5, 6, 7, 8, 9, 10],
        yData: []
      }
    },
    created() {
      this.dealData()
    },
    mounted() {
      this.drawLine()
    },
    methods: {
      dealData() {
        let that = this
        this.listData.forEach(item => {
          if (item.status === 1) {
            that.color = ['#fda557']
          }
          this.yData.push(item.value)
        })
      },
      // 绘制曲线图
      drawLine() {
        this.charts = Echarts.init(this.$refs.Lin).setOption({
          tooltip: { // 提示框
            show: true,
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: this.color
              }
            },
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false, // 坐标轴两边留白
            name: '日',
            nameLocation: 'end', // 坐标轴名称位置
            nameGap: 15, // 坐标轴名称和轴线之间的距离
            // splitNumber: 1, // 坐标轴的分割段数
            triggerEvent: false, // 坐标轴的标签是否响应和触发鼠标事件
            nameTextStyle: {  // 坐标轴名称的文字样式
              color: this.color,
              borderColor: this.color,
            },
            axisLine: { // 坐标轴轴线相关设置
              lineStyle: {
                color: this.color
              }
            },
            axisTick: { // 坐标轴刻度设置
              show: true,
              alignWithLabel: true
            },
            axisLabel: { // 坐标轴刻度标签的设置
              show: true,
              interval: 0 // 坐标轴刻度标签的显示间隔
            },
            splitLine: { // 纵向分割线
              show: false,
              lineStyle: {
                color: this.color
              }
            },
            gridIndex: 0,
            min: 0,
            data: this.xData
            /*  gridIndex: 0, // 开始值
              min: 1,
              max: 31*/
          }],
          yAxis: [{ // y轴
            name: 'MPa',
            type: 'value',
            boundaryGap: [0, '100%'],
            nameLocation: 'end',
            splitLine: { // 分割线设置
              lineStyle: {
                color: this.color
              }
            },
            axisLabel: {
              formatter: '{value}'
            },
            nameTextStyle: {
              color: this.color
            },
            axisLine: { // 刻度样式
              lineStyle: {
                color: this.color
              }
            },
            gridIndex: 0,
            min: 0
          }],
          grid: {
            show: true,
            left: '3%',
            top: '11%',
            bottom: '30%',
            containLabel: true,
            borderColor: this.color
          },
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          color: this.color,
          dataZoom: [{ // 缩放组件
            type: 'inside',
            start: 0,
            end: 50
          }],
          legend: { // 图例组件
            type: 'scroll',
            data: ['压强']
          },
          series: [{
            name: '压强',
            type: 'line',
            smooth: true,  // 折线平滑度
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            areaStyle: {
              normal: {}
            },
            data: this.yData
          }]
        })
      }
    },
    components: {}
  }
</script>

<style scoped lang='scss' rel='stylesheet/scss' type='text/scss'>
  .echartCurve {
    width: 100%;
    padding: 4px;
    box-sizing: border-box;
  }
</style>
