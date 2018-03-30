<template>
  <div class="iconStatistics">
      <common-model :title="title" :show="showModel" @closeModel="closeModel" class="icon-statistics-model-wrap">
        <div class="icon-statistics-model" ref="pie">
        </div>
        <div class="icon-statistics-model-txt">
          <span>设备总数</span>
          <span style="font-size: 32px;font-weight: bold;">{{equipment.total}}</span>
        </div>
      </common-model>
  </div>
</template>

<script>
  import commonModel from '@/component/commonModel.vue'
  import Echarts from 'echarts/lib/echarts'
  import Pie from 'echarts/lib/chart/pie'
  export default {
    components: {
      commonModel,
    },
    props: {
      title: String,
      showModel: {
        type: Boolean,
        default: false
      },
      equipment: Object
    },
    data() {
      return {
        pie:null,
      }
    },
    updated(){
      this.drawPic()
    },
    methods: {
      closeModel(){
        this.$emit('closeClick', false)
      },
      drawPic(){
        console.log(this.equipment)
        return Echarts.init(this.$refs.pie).setOption({
          series: {
            name:'设备情况',
            type: 'pie',
            radius: ['30%', '60%'],
            label: {
              normal: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: [
              {name: this.equipment.type==0?'正常':'巡检数量', value: this.equipment.type==0?this.equipment.normal:this.equipment.checked},
              {name: this.equipment.type==0?'异常':'遗漏数量', value: this.equipment.type==0?this.equipment.abnormal:this.equipment.miss},
            ]
          }
        })
      }
  }
  }
</script>
<style lang="scss" scoped type="text/scss">
  .icon-statistics-model-wrap {
    .icon-statistics-model {
      height:400px;
      padding: 30px 20px 0 20px;
      margin-bottom: -40px;
    }
    .icon-statistics-model-txt{
      position: relative;
      top:-180px;
      left:262px;
      display: inline-block;
      width: 80px;
      text-align: center;
      span{
        line-height: 30px;
      }
    }
  }
</style>