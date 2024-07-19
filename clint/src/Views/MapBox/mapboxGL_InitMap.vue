<template>
  <div id="map">
    <SelectLayer class="mapselect" :map="map"></SelectLayer>
    <!-- <LayerMenu
      class="maplayermenu"
      ref="layerstatus"
      @LayerStatus="LayerStatus"
    ></LayerMenu> -->
  </div>
</template>
<script setup lang='ts'>
import { ref, reactive, onMounted } from "vue"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import config from "../../config/tokenConfig"
import SelectLayer from "../../components/MapBox/SelectLayer.vue"
import LayerMenu from "../../components/commons/LayerMenu.vue"
import axios from "axios"

// 设置Mapbox访问令牌
mapboxgl.accessToken = config.mapbox.accessToken
// 创建一个响应式引用来存储地图实例
const map = ref(null)
onMounted(() => {
  map.value = new mapboxgl.Map({
    container: "map", // 容器ID
    style: "mapbox://styles/snailgis/ckarq4x7c25rs1io2bdg7iv6t", // 地图样式
    center: [117.1805, 34.2666], // 初始中心坐标
    zoom: 13, // 初始缩放级别
    minZoom: 5, // 最小缩放级别
    maxZoom: 18, // 最大缩放级别
    pitch: 40, // 地图倾斜角度
    bearing: 1, // 地图旋转角度
  })

  // map.on("load", () => {
  //   // 添加地图控件
  //   map.addControl(new mapboxgl.NavigationControl(), "top-right")
  //   map.addControl(
  //     new mapboxgl.ScaleControl({ maxWidth: 80, unit: "metric" }),
  //     "bottom-right",
  //   )
  //   map.addControl(
  //     new mapboxgl.FullscreenControl({
  //       container: document.querySelector("#map"),
  //     }),
  //     "top-right",
  //   )
  // })
  const item = { location: "117.1805,34.2666" }
  const marker = new mapboxgl.Marker({
    color: "#FF0000", // 标记的颜色
    draggable: true, // 标记是否可拖动
  })
    .setLngLat([117.1805, 34.2666]) // 设置标记位置
    .addTo(map)
})
const LayerStatus = async (layer) => {
  // console.log(map.value.getCenter())
  const location = map.value.getCenter()
  console.log(location)
  let res = await axios.get(
    `https://restapi.amap.com/v3/place/around?location=${location.lng},${location.lat}&radius=1000&types=餐饮服务&key=5e1bca9ae11b3412a0407d23ce7270e5`,
  )
  let markData = res.data
  let markData = {
    suggestion: {
      keywords: [],
      cities: [],
    },
    count: "450",
    infocode: "10000",
    pois: [
      {
        parent: [],
        address: "富国街醒狮小区西门沿街门面",
        distance: "9",
        pname: "江苏省",
        importance: [],
        biz_ext: {
          cost: [],
          opentime2: "09:00-21:00",
          rating: "4.2",
          open_time: "09:00-21:00",
          meal_ordering: "0",
        },
        biz_type: "diner",
        cityname: "徐州市",
        type: "餐饮服务;餐饮相关场所;餐饮相关",
        photos: [
          {
            title: [],
            url: "http://store.is.autonavi.com/showpic/95d6101aa84f03e828610957b96237fe",
          },
          {
            title: [],
            url: "http://store.is.autonavi.com/showpic/8ca277daa65b76b518d0006ed85504ef",
          },
          {
            title: [],
            url: "http://store.is.autonavi.com/showpic/1a305c1f138ba2fe8ff278f0ca7e714b",
          },
        ],
        typecode: "050000",
        shopinfo: "0",
        poiweight: [],
        childtype: [],
        adname: "泉山区",
        name: "丞相把子肉",
        location: "117.181532,34.266094",
        tel: "18954809825",
        shopid: [],
        id: "B0FFI929ZF",
      },
    ],
    status: "1",
    info: "OK",
  }
  console.log(markData)
  // markData.pois.forEach((item) => {
  //   console.log(
  //     parseFloat(item.location.split(",")[0]),
  //     parseFloat(item.location.split(",")[1]),
  //   )
  //   const marker = new mapboxgl.Marker()
  //     .setLngLat([
  //       parseFloat(item.location.split(",")[0]),
  //       parseFloat(item.location.split(",")[1]),
  //     ])
  //     .addTo(map.value)
  //   const popup = new mapboxgl.Popup({ offset: 25 }).setText(item.name)
  //   marker.setPopup(popup)
  // })
}

// // 组件卸载时清理资源
// onUnmounted(() => {
//   map && map.remove()
// })
</script>


<style scoped>
/* @import url('https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.css'); */
#map {
  /* position: absolute; */
  left: 0;
  top: 0;
  text-align: left;
  width: 100%;
  height: 100%;
}
.mapselect {
  position: absolute;
  top: 3%;
  right: 2%;
  z-index: 2;
  width: 200px;
}
.maplayermenu {
  position: absolute;
  top: 3%;
  left: 10%;
  z-index: 2;
}
</style>