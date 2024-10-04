<template>
  <div id="olmap" ref="olmap" style="width: 100%; height: 100%">
    <div id="popup" class="ol-popup">
      <a
        href="#"
        id="popup-closer"
        class="ol-popup-closer"
        @click="closePopup"
      ></a>
      <el-popover placement="top-start" :width="200" trigger="hover">
        <div class="info" v-if="properties">
          <h3>{{ properties.name }}</h3>
          <p>开业时间：{{ properties.biz_ext.open_time }}</p>
          <p>评分：{{ properties.biz_ext.rating }}</p>
          <p>地址：{{ properties.address }}</p>
          <p>电话：{{ properties.tel }}</p>
          <img class="scaled-image" :src="properties.photos[0].url" alt="" />
        </div>
        <h2 v-else>没有数据</h2>
        <template #reference>
          <div id="popup-content"></div>
        </template>
      </el-popover>
    </div>
    <el-select
      class="mapselect"
      v-model="mapValue"
      placeholder="切换地图底图"
      @change="changeBaseMap(mapValue)"
    >
      <el-option-group
        v-for="group in options"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-option-group>
    </el-select>
    <el-switch
      v-show="isShowLabel"
      v-model="isLabel"
      @change="changeLabel(isLabel)"
      class="mapLabel"
      inline-prompt
      active-text="显示注记"
      inactive-text="隐藏注记"
    />
    <el-switch
      v-model="isPOI"
      @change="changePoi(isPOI)"
      class="mapPOI"
      inline-prompt
      active-text="餐饮服务"
      inactive-text="餐饮服务"
    />
    <!-- <LayerMenu
      class="maplayermenu"
      ref="layerstatus"
      @LayerStatus="LayerStatus"
    /> -->
  </div>
</template>

<script setup lang='ts'>
import { createApp, ref, onMounted, toRaw } from "vue"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import { transform } from "ol/proj"
import Feature from "ol/Feature"
import mapMoudle from "./modules/maplist.ts"
import Point from "ol/geom/Point"
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import Overlay from "ol/Overlay"
import {
  Icon,
  Style,
  Fill,
  Circle as CircleStyle,
  Text,
  Stroke,
} from "ol/style"
import axios from "axios"
// import { c } from "vite/dist/node/types.d-aGj9QkWt.js"

const map = ref<Map | null>(null)
const popup = ref(null)
const mapLayer = ref<TileLayer | null>(null)
const mapLayerlabel = ref<TileLayer | null>(null)
const mapValue = ref("tdtwx")
const proj: string = "EPSG:4326"
const proj_m = "EPSG:3857"
const mapSources = mapMoudle.maplist
const findMap = mapMoudle.findMap
const findLabel = mapMoudle.findLabel
const options = mapSources.basemapLabel
const label = mapMoudle.Label
const isShowLabel = ref(true)
const isLabel = ref(false)
const isPOI = ref(false)
let properties = ref(null)

const initMap = async () => {
  map.value = new Map({
    target: "olmap", // 组件模板中地图容器的 ID
    view: new View({
      center: transform([117.1805, 34.2666], proj, proj_m),
      zoom: 15,
    }),
  })
  mapLayer.value = new TileLayer({
    source: mapSources.tdtwx,
    projection: proj,
  })
  mapLayerlabel.value = new TileLayer({
    source: label.tdtwx,
    projection: proj,
  })
  map.value.addLayer(mapLayer.value)
  map.value.addLayer(mapLayerlabel.value)
}
const addMarker = async () => {
  // 假设你的地图实例名为map
  let center = map.value.getView().getCenter()
  let centerLonLat = transform(center, proj_m, proj)
  // console.log(centerLonLat) // 打印转换后的坐标
  // console.log(centerLonLat[0], centerLonLat[1]) // 打印转换后的经度和纬度
  // let res = await axios.get(
  //   `https://restapi.amap.com/v3/place/around?location=${centerLonLat[0]},${centerLonLat[1]}&radius=1000&types=餐饮服务&page_size=50&key=5e1bca9ae11b3412a0407d23ce7270e5`,
  // )
  // console.log("res", res.data)
  // let markData = res.data
  let markData: any = []
  let totalPages = 3
  for (let page = 1; page <= totalPages; page++) {
    let res = await axios.get(
      `https://restapi.amap.com/v3/place/around?location=${centerLonLat[0]},${centerLonLat[1]}&radius=1000&types=餐饮服务&page=${page}&page_size=50&key=5e1bca9ae11b3412a0407d23ce7270e5`,
    )
    console.log(`Page ${page} data:`, res.data)
    markData = markData.concat(res.data.pois) // 假设数据在 res.data.pois 中
  }
  console.log("markData", markData)
  // 在循环外部创建 VectorSource 和 VectorLayer
  const vectorSource = new VectorSource()
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  })

  // 遍历标记数据，为每个标记创建 Feature 并添加到 VectorSource
  markData.forEach((item) => {
    const coords = item.location.split(",").map(Number) // 简化坐标解析
    const marker = new Feature({
      geometry: new Point(transform(coords, proj, proj_m)),
      properties: {
        name: item.name,
        ...item,
      },
    })

    // 启用并设置标记样式，包括图像和文本
    marker.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: "red",
          }),
        }),
        text: new Text({
          text: item.name,
          font: "12px Calibri,sans-serif",
          fill: new Fill({
            color: "#000",
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 2,
          }),
          offsetX: 0,
          offsetY: -10, // 根据需要调整文本偏移量
        }),
      }),
    )

    vectorSource.addFeature(marker) // 将标记添加到源中
  })
  map.value.addLayer(vectorLayer)
  // 创建弹出窗口的 Overlay
  popup.value = new Overlay({
    element: document.getElementById("popup"),
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  })
  map.value.addOverlay(popup.value)
  map.value.on("pointermove", function (event) {
    // 检查鼠标位置下是否有feature
    if (map.value.hasFeatureAtPixel(event.pixel)) {
      map.value.forEachFeatureAtPixel(event.pixel, function (feature) {
        properties = feature.getProperties().properties
        console.log(properties)
        const coordinates = feature.getGeometry().getCoordinates()
        popup.value.setPosition(coordinates)
        document.getElementById("popup-content").innerHTML = "详细信息"
        return true // 停止遍历更多的 feature
      })
    }
  })
}
// function closePopup() {
//   popup.value.setPosition(undefined)
// }
onMounted(() => {
  initMap()
})
const changeLabel = (isLabel: boolean) => {
  if (mapLayerlabel.value) {
    map.value.removeLayer(mapLayerlabel.value)
  }
  const mapLabel = findLabel(mapValue.value)
  if (mapLabel) {
    if (isLabel) {
      mapLayerlabel.value = new TileLayer({
        source: mapLabel,
        projection: proj,
      })
      map.value.addLayer(mapLayerlabel.value)
    }
  }
}
const changePoi = (isPOI: boolean) => {
  if (isPOI) {
    addMarker()
  } else {
    map.value.getLayers().forEach((layer) => {
      if (layer instanceof VectorLayer) {
        map.value.removeLayer(layer)
      }
    })
  }
}
const changeBaseMap = (value: string) => {
  // console.log(value)
  // mapLayer.value = null
  // map.value.removeLayer(mapLayer)
  if (mapLayer.value) {
    map.value.removeLayer(mapLayer.value)
    map.value.removeLayer(mapLayerlabel.value)
  }
  const mapValue = findMap(value)
  mapLayer.value = new TileLayer({
    source: mapValue,
    projection: proj,
  })
  map.value.addLayer(mapLayer.value)
  // this.map.addLayer(this.mapLayerlabel)
  // map.value.removeLayer(mapLayerlabel)
}
</script>

<style scoped>
#olmap {
  position: relative;
  z-index: 1;
}
.mapselect {
  position: absolute;
  top: 3%;
  right: 2%;
  z-index: 2;
  width: 200px;
}
.mapLabel {
  position: absolute;
  top: 8%;
  right: 3%;
  z-index: 2;
}
.mapPOI {
  position: absolute;
  top: 13%;
  right: 3%;
  z-index: 2;
}
.info {
  color: #333;
  font-family: "Microsoft YaHei";
}
.info p {
  margin-top: 10px; /* 设置上边距 */
  margin-bottom: 10px; /* 设置下边距 */
}
.scaled-image {
  width: 100px; /* 或你希望的宽度 */
  height: auto; /* 保持图像的纵横比 */
}
#popup-content {
  color: #fefefe;
  font-size: 13px;
  font-family: "Microsoft YaHei";
}
</style>
