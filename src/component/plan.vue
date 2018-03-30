<template>
  <div class="plan" ref="plan" @dragover="wrapMouseMove($event)" @drop="drop">
    <img :src="src" draggable="false" :width="width-90" :height="height">
    <div class="point" v-for="(item,index) in points"
         :style="{top:item.positionY*baseFlag.y+'px',left:item.positionX*baseFlag.x+'px'}"
         ref="point"
         @mousedown="mouseDown($event,item,index)"
         @dblclick="pointClick(item)"
    >
      <img :src="addFilePre(item._url)" width="50" height="50" draggable="false">
    </div>
  <!--  <div class="delete" v-if="showDelete">
      <i class="icon-delete"></i>
      <p>删除</p>
    </div>-->
    <div class="delete" v-if="showDelete">
      <i class="icon-delete"></i>
    </div>
  </div>
</template>
<script>
  import {FilePre} from '../config/config'
  export default{
    props: {
      src: {
        type: String,
        required: true
      },
      points: {
        type: Array,
        require: true
      },
      canDrag: {
        type: Boolean,
        default: true
      },
      showDelete: {
        type: Boolean,
        default: true
      },
      iconAddFilePre: {
        type: Boolean,
        default: true
      }
    },
    data(){
      return {
        disX: 0,
        disY: 0,
        baseWidth: 1000,
        baseHeight: 500,
        currentItem: null,
        currentIndex: 0,
        basePoint: {x: 0, y: 0},
        width: 0,
        height: 0,
      }
    },
    computed: {
      baseFlag(){ // 根据图片实际宽度换算出一个基准
        return {
          x: this.width / this.baseWidth,
          y: this.height / this.baseHeight
        }
      }
    },
    created(){
    },
    mounted(){
      this.width = this.$refs.plan.offsetWidth
      this.height = this.$refs.plan.offsetHeight
    },
    methods: {
      addFilePre(val){
        if (this.iconAddFilePre) {
          return FilePre + val
        } else {
          return val
        }
      },
      mouseDown(e, item, index){
        e.preventDefault()
        if (!this.canDrag) return
        this.disX = e.clientX - this.$refs.point[index].offsetLeft
        this.disY = e.clientY - this.$refs.point[index].offsetTop
        this.currentItem = item
        this.currentIndex = index
        document.onmousemove = this.mouseMove
        document.onmouseup = this.mouseUp
      },
      mouseMove(e){
        this.currentItem.positionX = (e.clientX - this.disX) / this.baseFlag.x
        this.currentItem.positionY = (e.clientY - this.disY) / this.baseFlag.y
      },
      mouseUp(){
        document.onmousemove = null
        document.onmouseup = null
        if (this.isInDelete()) {
          this.$emit('delete', this.currentIndex)
        }
      },
      pointClick(item){
        this.$emit('pointClick', item)
      },
      addPoint(point){
        this.points.push(point)
      },
      wrapMouseMove(e){ // 记录相对坐标
        e.preventDefault()
      },
      getParentByName(child, name){
        let flag = true
        let childNode = child
        let result = null
        while (flag) {
          if (childNode.className.indexOf(name) >= 0) {
            flag = false
            result = childNode
          } else {
            childNode = childNode.parentNode
          }
        }
        return result
      },
      getOffsetTop(node){
        let top = node.offsetTop;
        let parent = node.offsetParent
        while (parent !== null) {
          top += parent.offsetTop
          parent = parent.offsetParent
        }
        return top
      },
      getOffsetLeft(node){
        let left = node.offsetLeft
        let parent = node.offsetParent
        while (parent !== null) {
          left += parent.offsetLeft
          parent = parent.offsetParent
        }
        return left
      },
      drop(e){
        let scrollWrap = this.getParentByName(this.$refs.plan, 'el-scrollbar__wrap')
        this.basePoint.x = (e.clientX - this.getOffsetLeft(this.$refs.plan)) / this.baseFlag.x
        this.basePoint.y = (e.clientY - this.getOffsetTop(this.$refs.plan)) / this.baseFlag.y
        this.$emit('drop', this.basePoint)
      },
      isInDelete(){
        let iconWidth = 50
        let iconHeight = 50
        let currentPoint = this.$refs.point[this.currentIndex]
        let pointX = parseInt(currentPoint.style.left)
        let pointY = parseInt(currentPoint.style.top)
        let deleteLeft = this.$refs.plan.offsetWidth - 90
        let deleteRight = this.$refs.plan.offsetWidth
        let deleteTop = 0
        let deleteBottom = 90
        let flag = false
        if (((pointX + iconWidth) > deleteLeft) && pointX < deleteRight) {
          if (((pointY + iconHeight) > deleteTop) && pointY < deleteBottom) {
            flag = true
          }
        }
        return flag
      }
    }
  }
</script>
<style lang='scss' type="text/scss" rel='stylesheet/scss' scoped>
  .plan {
    position: relative;
    box-sizing: border-box;
    .bg {
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    .point {
      position: absolute;
      z-index: 10;
    }
    .delete {
      position: absolute;
      width: 90px;
      height: 90px;
      right: 0px;
      top: 0px;
      background: #fd6160;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9;
      i:before {
        color: #ffffff;
        font-size: 60px;
      }
    }
  /*  .delete {
      position: absolute;
      width: 90px;
      height: 36px;
      right: 0;
      top: 0;
      background: #ff3c3c;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9;
      i:before {
        color: #ffffff;
        font-size: 24px;
      }
    }*/
  }
</style>
