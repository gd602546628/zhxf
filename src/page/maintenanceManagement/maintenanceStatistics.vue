<template>
  <div>
    <div class="row" column>
      <div class="col col-header">
        <el-select v-model="year" @change="refreshData">
          <el-option
            v-for="item in yearList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <p>维修总次数<span class="red">{{count}}</span>家</p>
      </div>
    </div>
    <div class="bar-container" ref="Repairbar"></div>
  </div>
</template>

<script>

  import Echarts from 'echarts/lib/echarts'
  import Bar from 'echarts/lib/chart/bar'
  import Tooltip from 'echarts/lib/component/tooltip'
  import repair from '@/api/repair'
  import {Code} from '@/config/config'

  export default {
    data() {
      return {
        yearList: [{label: '2017年', value: 2017}, {label: '2018年', value: 2018}],
        year: '2017',
        dataList: [],
        countList: []
      }
    },
    computed: {
      xAxisData() {
        let month = []
        for (let i = 0; i < 12; i++) {
          if(i<10){
            month.push(`${this.year}-${'0'+(i + 1)}`)
          } else {
            month.push(`${this.year}-${i + 1}`)
          }
        }
        return month
      },
      option() {
        return {
          tooltip: { // 提示框
            show: true,
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#07c362'
              }
            },
          },
          xAxis: {
            /*  axisTick: { // 坐标轴刻度设置
                show: true,
                alignWithLabel: true
              },*/
            type: 'category',
            data: this.xAxisData,
            axisLine: { // 刻度样式
              lineStyle: {
                color: '#07c362'
              }
            },
            splitLine: { // 分割线设置
              lineStyle: {
                color: '#07c362'
              }
            },
            axisTick:{
              interval: 0
            }
          },
          yAxis: {
            boundaryGap: ['10%', '10%'],
            type: 'value',
            nameTextStyle: {
              color: '#07c362',
              fontStyle: '#07c362'
            },
            axisLine: { // 刻度样式
              lineStyle: {
                color: '#07c362'
              }
            },
            splitLine: { // 分割线设置
              show: true,
              lineStyle: {
                color: '#07c362'
              },
              interval: 0
            },
            min:0
          },
          grid: {},
          color: '#07c362',
          series: [{
            name: '次数',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: this.dataList,
            type: 'bar'
          }]
        }
      },
      count() {
        let n = 0;
        this.countList.forEach(item => {
          n += item
        })
        return n
      }
    },
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        let params = {
          year: this.year
        }
        let data = await repair.repairStatistics(params).catch(e => {
        })
        this.dataList = []
        this.countList = []
        if (data.code === Code.SUCCESS) {
          let that = this
          let a = false
          data.data.forEach(item => {
            this.countList.push(item.count)
          })
          that.xAxisData.forEach(e=>{
            data.data.forEach(item => {
                if(item.months ===e){
                  that.dataList.push(item.count)
                  a = true;
                  return
                }
              })
            if(!a){
              that.dataList.push(0)
            }else{
              a = false;
            }
            })
          this.setBar()
          // this.dataList = data.data
        } else {
          this.$message.error(data.mesg)
        }
      },
      setBar() {
        Echarts.init(this.$refs.Repairbar).setOption(this.option);
      },
      refreshData(val) {
        this.year = val
        this.setBar()
        this.getData()
      }
    },
    mounted() {

    },
    components: {}
  }
</script>
<style lang="scss" scoped type="text/scss">
  .row {
    .red {
      color: red;
    }
    padding: 20px;
    .col-header {
      max-height: 60px;
    }
  }

  .bar-container {
    width: 100%;
    height: 800px;
    box-sizing: border-box;
  }
</style>

