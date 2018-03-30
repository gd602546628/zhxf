<template>
  <div class="BMap-wrap-box">
    <div ref="mapContent" @dragover="wrapMouseMove($event)" @drop="drop" class="BMap-wrap-content"></div>
    <!--<div class="delete" v-if="showDelete">
      <i class="icon-delete"></i>
    </div>-->
  </div>
</template>
<script>
  export default{
    props: {
      showDelete: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        map: null,
        points: []
      }
    },
    mounted(){
      this.init()
    },
    methods: {
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
      wrapMouseMove(e){
        e.preventDefault()
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
        let x = e.clientX - this.getOffsetLeft(this.$refs.mapContent)
        let y = e.clientY - this.getOffsetTop(this.$refs.mapContent)
        this.$emit('drop', this.map.pixelToPoint({x: x, y: y}))
      },
      init(){
        this.map = new BMap.Map(this.$refs.mapContent)
        this.map.enableScrollWheelZoom(true)
        this.map.addEventListener('click', (e) => {
          this.$emit('mapClick', e)
        })
      },
      // 移除所有覆盖物
      removeAllOverlay(){
        this.map.clearOverlays()
        this.points = []
      },
      // 根据坐标移除标记点
      removePointByPoint(lon, lat){
        let allOverlay = this.map.getOverlays();
        allOverlay.forEach(item => {
          if (item.point) {
            if (lon === item.point.lng && lat === item.point.lat) {
              this.map.removeOverlay(item)
            }
          }
        })
        this.points = this.points.filter((point) => {
          return point.lat !== lat && point.lng !== lon
        })
      },
      // 移除所有标记点
      removeAllPoint(){
        this.points.forEach(point => {
          this.removePointByPoint(point.lng, point.lat)
        })
        this.points = []
      },
      //根据坐标添加标注点
      addPoint(lon, lat){ // 根据坐标添加点
        let point = new BMap.Point(lon, lat)
        let marker = new BMap.Marker(point)
        this.map.addOverlay(marker)
        this.points.push(point)
        return marker
      },
      //根据地址添加点
      addPointByAddress(address){
        this.addressToPoint(address).then(point => {
          this.map.addOverlay(new BMap.Marker(point, {enableDragging: true, raiseOnDrag: true}))
          this.points.push(point)
        }).catch(() => {
          throw new Error('没有搜索到目标地址')
        })
      },
      //坐标转地址,返回promise
      pointToAddress(lon, lat){
        let myGeo = new BMap.Geocoder()
        return new Promise((resolve, reject) => {
          myGeo.getLocation(new BMap.Point(lon, lat), (result) => {
            resolve(result)
          })
        })
      },
      //地址转坐标,返回promise ,使用搜索接口，取搜索到的第一个点
      addressToPoint(address){
        return new Promise((resolve, reject) => {
          let options = {
            onSearchComplete: function (results) {
              if (local.getStatus() === BMAP_STATUS_SUCCESS) {
                // 判断状态是否正确
                resolve(results.getPoi(0).point)
              } else {
                reject()
              }
            }.bind(this)
          }
          let local = new BMap.LocalSearch(this.map, options)
          local.search(address)
        })
      },
      // 根据坐标设置地图中心
      centerByPoint(lon, lat, zoom = 18){
        let point = new BMap.Point(lon, lat)
        this.map.centerAndZoom(point, zoom)
      },
      // 根据地址设置地图中心
      centerByAddress(address, zoom = 18){
        this.addressToPoint(address).then(point => {
          this.map.centerAndZoom(point, zoom)
        }).catch(() => {
          throw new Error('没有搜索到目标地址')
        })
      },
      //根据当前标注点生成网格
      createGrid(){
        let polygon = new BMap.Polygon(this.points, {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});   //创建折线
        this.map.addOverlay(polygon);
        polygon.enableEditing()
        return polygon
      },
      // 根据坐标数组生成网格
      createGridByPoints(points, color = 'blue', opacity = 0.5, fillOpacity = 0.5){
        let pointsArr = []
        points.forEach(point => {
          pointsArr.push(new BMap.Point(point.lng, point.lat))
        })
        let polygon = new BMap.Polygon(pointsArr, {strokeColor: color, strokeWeight: 2, strokeOpacity: opacity,fillOpacity:fillOpacity});   //创建折线
        this.map.addOverlay(polygon);
        // polygon.enableEditing()
        return polygon
      },


      // 添加图标点
      addIconPoint(lng, lat, {enableDragging = false, icon = '', width = 30, height = 30}, clickCallBack, doubleClick, dragEnd){
        let point = new BMap.Point(lng, lat)
        let size = new BMap.Size(width, height)
        let oIcon = new BMap.Icon(icon, size)
        oIcon.imageSize = size
        let marker = new BMap.Marker(point, {
          enableDragging: enableDragging,
          icon: oIcon
        })
        clickCallBack && marker.addEventListener('click', clickCallBack)
        doubleClick && marker.addEventListener('dblclick', doubleClick)
        dragEnd && marker.addEventListener('dragend', dragEnd)
        this.map.addOverlay(marker)
        return marker
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .BMap-wrap-box {
    position: relative;
    .BMap-wrap-content {
      width: 100%;
      height: 100%;
    }
    .delete {
      position: absolute;
      width: 90px;
      height: 90px;
      right: 16px;
      top: 16px;
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
  }
</style>
